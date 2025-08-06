# main.py

import os
import shutil
import tempfile
import git
import openai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from dotenv import load_dotenv

# --- 1. Initialization and Configuration ---

load_dotenv()

app = FastAPI(
    title="AI README Generator",
    description="An API to generate a README.md from a public GitHub repository.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://ai-readme-generator.tushr.xyz"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = openai.OpenAI()

CONTEXT_MAX_TOKENS = 15000

# --- 2. Pydantic Model for Request Validation ---

class RepoRequest(BaseModel):
    repo_url: HttpUrl

# --- 3. Helper Functions (Token Counting & Crawling) ---

def count_tokens(text: str) -> int:
    """
    A simple heuristic to estimate token count.
    The OpenAI rule of thumb is ~4 characters per token.
    """
    return len(text) // 4

def crawl_repository(repo_path: str) -> str:
    """
    Crawls a local repository path, extracts content from relevant code files,
    and concatenates it into a single string to be sent to the LLM.
    """
    all_code_content = []
    
    # FIX: Heavily optimized for React/Node.js ecosystems.
    files_to_ignore = [
        # General config, lock, and data files
        '.lock', '.log', '.md', '.txt', '.json', '.yml', '.yaml', '.xml', '.csv', '.env',
        'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml',
        # JS/TS build tool and framework configs
        'tailwind.config.js', 'postcss.config.js', 'next.config.js', 'vite.config.js',
        'svelte.config.js', 'nuxt.config.js', 'remix.config.js', 'astro.config.mjs',
        'tsconfig.json', 'jsconfig.json', '.eslintrc.json', '.prettierrc', '.babelrc',
    ]
    
    # Directories to completely ignore
    dirs_to_ignore = [
        '.git', '.github', 'node_modules', 'dist', 'build', '__pycache__', 'venv', 'target', 
        'docs', '.next', '.svelte-kit',
        # Common UI, asset, and test directories
        'components', 'ui', 'pages', 'views', 'styles', 'assets', 'public', 
        '__tests__', 'cypress', 'e2e'
    ]
    
    # File extensions to ignore
    extensions_to_ignore = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp', '.css', '.scss', '.less']
    
    # Test file suffixes to ignore
    test_suffixes = ['.test.js', '.spec.js', '.test.ts', '.spec.ts', '.test.jsx', '.spec.jsx', '.test.tsx', '.spec.tsx']

    print(f"Starting repository crawl in: {repo_path}")

    for root, dirs, files in os.walk(repo_path):
        # Modify dirs in-place to skip ignored directories
        dirs[:] = [d for d in dirs if d not in dirs_to_ignore]

        for file in files:
            # Check against exact file names and test file suffixes
            if file in files_to_ignore or any(file.endswith(suffix) for suffix in test_suffixes):
                continue
            
            # Check against extensions
            if any(file.endswith(ext) for ext in extensions_to_ignore):
                continue

            file_path = os.path.join(root, file)
            try:
                if os.path.getsize(file_path) > 1024 * 1024: # 1MB limit
                    print(f"  - Skipping large file: {os.path.relpath(file_path, repo_path)}")
                    continue

                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                
                if not content.strip():
                    continue

                relative_path = os.path.relpath(file_path, repo_path)
                header = f"--- File: {relative_path} ---\n"
                all_code_content.append(header + content)
                print(f"  - Successfully read file: {relative_path}")

            except Exception as e:
                print(f"  - Could not read file {os.path.relpath(file_path, repo_path)}: {e}")

    if not all_code_content:
        print("Crawl finished: WARNING - No readable code content was found.")
    else:
        print(f"Crawl finished: Found content in {len(all_code_content)} files.")

    return "\n\n".join(all_code_content)

# --- 4. The Main API Endpoint ---

@app.post("/generate-readme")
async def generate_readme_endpoint(request: RepoRequest):
    repo_url = str(request.repo_url)
    temp_dir = None

    try:
        temp_dir = tempfile.mkdtemp()
        print(f"Cloning {repo_url} into temporary directory {temp_dir}...")
        git.Repo.clone_from(repo_url, temp_dir)
        print("Repository cloned successfully.")

        code_content = crawl_repository(temp_dir)

        if not code_content:
            raise HTTPException(
                status_code=400,
                detail="Crawl complete, but no readable code files were found in the repository."
            )

        # --- Token Handling and Content Truncation ---
        token_count = count_tokens(code_content)
        truncation_note = ""
        
        if token_count > CONTEXT_MAX_TOKENS:
            print(f"Context too long ({token_count} tokens). Truncating to {CONTEXT_MAX_TOKENS} tokens.")
            max_chars = CONTEXT_MAX_TOKENS * 4
            code_content = code_content[:max_chars]
            truncation_note = "Note: The following codebase is a partial snapshot of the repository, truncated due to length constraints."


        # --- OpenAI API Call ---
        system_prompt = "You are an expert technical writer specializing in creating high-quality README.md files for software projects."
        user_prompt = f"""
        {truncation_note}

        Based on the codebase provided below, generate a comprehensive and well-structured README.md file in Markdown format.

        The README should include the following sections:
        1.  **Project Title**: An appropriate and catchy title for the project.
        2.  **Description**: A detailed explanation of what the project does, its purpose, and its key features.
        3.  **Features**: A bulleted list of the main functionalities.
        4.  **Installation**: A clear, step-by-step guide on how to install and set up the project. Provide commands in code blocks.
        5.  **Usage**: Instructions on how to run the application and examples of how to use it.

        Here is the codebase:
        {code_content}
        """

        print("Generating README with OpenAI API...")
        chat_completion = client.chat.completions.create(
            model="gpt-4o", 
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
        )
        
        generated_readme = chat_completion.choices[0].message.content
        print("README generated successfully.")
        
        return {"readme": generated_readme}

    except git.exc.GitCommandError as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to clone repository. Ensure the URL is correct and the repository is public. Error: {e}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred: {str(e)}"
        )
    finally:
        if temp_dir and os.path.exists(temp_dir):
            print(f"Cleaning up temporary directory: {temp_dir}")
            shutil.rmtree(temp_dir)
