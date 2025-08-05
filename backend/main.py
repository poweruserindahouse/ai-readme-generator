# main.py

from email.policy import HTTP
import os
import shutil
import tempfile
import git
import openai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from dotenv import load_dotenv


load_dotenv()

app = FastAPI(
    title="AI README Generator",
    description="An API to generate a README.md from a public GitHub repository.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

client = openai.OpenAI()

class RepoRequest(BaseModel):
    repo_url: HttpUrl

def crawl_repository(repo_path: str) -> str:
    all_code_content = []

    files_to_ignore = ['.lock', '.log', '.md', '.txt', '.json', '.yml', '.yaml', '.xml', '.csv']
    dirs_to_ignore = ['.git', 'node_modules', 'dist', 'build', '__pycache__', 'venv', 'target', 'docs']
    image_extensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp']

    print(f"Starting repository crawl in: {repo_path}")

    for root, dirs, files in os.walk(repo_path):
        dirs[:] = [d for d in dirs if d not in dirs_to_ignore]

        for file in files:

            if any(file.endswith(ext) for ext in files_to_ignore + image_extensions):
                continue

            file_path = os.path.join(root, file)
            try:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()

                relative_path = os.path.relpath(file_path, repo_path)
                header = f"--- File: {relative_path} ---\n"
                all_code_content.append(header + content)
                print(f"   -Reading file: {relative_path}")

            except Exception as e:
                print(f"  - Could not read file {file_path}: {e}")

    print("Repository crawl finished.")
    return "\n\n.join(all_code_content)"

@app.post("/generate-readme")
async def generate_readme_endpoint(request: RepoRequest):
    repo_url = str(request.repo_url)
    temp_dir = None

    try:
        temp_dir = tempfile.mkdtemp()
        print(f"Cloning {repo_url} into temporary directory {temp_dir}...")

        git.Repo.clone_from(repo_url, temp_dir)
        print("Repo cloned successfully.")

        code_content = crawl_repository(temp_dir)

        if not code_content:
            raise HTTPException(
                status_code = 400,
                detail="Could not find any readable code files in the repository."
            )

        system_prompt = "You are an expert technical writer specializing in creating high-quality README.md files for software projects."
        user_prompt = f"""
        Based on the entire codebase provided below, generate a comprehensive and well-structured README.md file in Markdown format.

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

    except git.exec.GitCommandError as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to clone repository. Ensure the URL is correct and repository is public. Error: {e}"
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An unexcepted error occurred: {str(e)}"
        )

    finally:
        if temp_dir and os.path.exists(temp_dir):
            print(f"Cleaning up temporary directory: {temp_dir}")
            shutil.rmtree(temp_dir)

