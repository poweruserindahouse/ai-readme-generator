# AI README Generator

## Description

The **AI README Generator** is a full-stack application designed to automatically generate professional README.md files for public GitHub repositories. It consists of a modern, dark-themed React frontend and a powerful FastAPI backend. The backend leverages the OpenAI API to produce high-quality documentation based on the content of the source code. This project aims to simplify the process of creating well-structured README files, saving time for developers and maintaining consistency in documentation.

## Features

### Frontend

- **Modern & Responsive UI:** Enjoy a sleek, dark-themed interface that adapts seamlessly across all device sizes.
- **Real-time Input Validation:** Ensures the GitHub URL entered is structurally valid before processing.
- **Clear State Indicators:** Provides feedback with visual cues like spinners and status messages.
- **Robust Error Handling:** Displays user-friendly error alerts when issues arise.
- **Convenient Output Management:** Copy or download the generated README with ease.

### Backend

- **Fast & Asynchronous:** Utilize FastAPI for high performance, capable of managing concurrent requests efficiently.
- **Intelligent Code Crawling:** Analyzes the repository content while ignoring irrelevant files and directories.
- **AI-Powered Content Generation:** Uses OpenAI's GPT models to craft human-like, high-quality documentation.
- **Secure API Key Management:** Protects the OpenAI API key using a .env file.

## Tech Stack

### Frontend

- **UI Library:** React
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Icons:** Lucide React

### Backend

- **Framework:** FastAPI
- **Server:** Uvicorn
- **AI Integration:** OpenAI Python Library
- **Git Operations:** GitPython
- **Environment Management:** python-dotenv

## Installation

To set up and run this project, follow the instructions below.

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment:**
   ```bash
   # Create the environment
   python3 -m venv .venv

   # Activate it
   source .venv/bin/activate
   ```

3. **Install the necessary dependencies:**
   ```bash
   pip install "fastapi[all]" openai python-dotenv GitPython
   ```

4. **Configure your API Key:**

   Create a file named `.env` in the backend directory and add your OpenAI API key to it:

   ```plaintext
   OPENAI_API_KEY="sk-YourSecretApiKeyHere"
   ```

### Frontend Setup

1. **Navigate to the frontend directory and install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

## How to Run the Application

To run the application, both the backend server and frontend need to be started up:

### Start the Backend Server

1. Open a terminal and ensure your virtual environment is activated.
2. Run the following command to start the server:
   ```bash
   uvicorn main:app --reload
   ```
   The backend server will be running at [http://127.0.0.1:8000](http://127.0.0.1:8000).

### Start the Frontend

#### If Using a Single HTML File

1. Open `index.html` in your web browser.

#### If It's a React Project

1. Navigate to the frontend directory in a new terminal.
2. Run the development server:
   ```bash
   npm run dev
   ```

## Usage

1. With both applications running, open the frontend application in your browser.
2. Enter the URL for a public GitHub repository in the provided input field.
3. Click "Generate README" to begin the process.
4. The app will display a loading indicator while generating the README.
5. Once complete, you can copy or download the generated README file using the available buttons.

This application streamlines README creation, making it effortless to keep your documentation informative and up-to-date. Enjoy generating high-quality README files with just a URL!