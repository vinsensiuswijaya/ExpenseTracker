# Expense Tracker

Expense Tracker is a full-stack web application designed to help users manage their personal finances. It features a secure RESTful API built with .NET 8 and a modern, responsive frontend built with React and TypeScript.

This project is a demonstration of modern web development practices, including a clean, layered backend architecture and a reactive, component-based frontend.

## Project Structure

The repository is organized into two main projects:

*   `./ExpenseTracker.API/`: The backend REST API.
*   `./expense-tracker-frontend/`: The frontend client application.

Each project has its own detailed `README.md` with more specific information about its architecture and setup.

*   [Backend README](./ExpenseTracker.API/README.md)
*   [Frontend README](./expense-tracker-frontend/README.md)

## Features

*   **Secure User Authentication**: User registration and login with JWT-based authentication.
*   **Expense & Category Management**: Full CRUD (Create, Read, Update, Delete) functionality for expenses and categories, scoped to the authenticated user.
*   **Data Visualization**: Aggregated expense data is available, visualized as charts on the frontend.
*   **Responsive UI**: A clean and responsive user interface built with Tailwind CSS and DaisyUI.
*   **Protected Routes**: Both the API and the client application protect routes that require authentication.

## Technologies

### Backend (API)

*   **Framework**: .NET 8, ASP.NET Core
*   **Database**: PostgreSQL with Entity Framework Core
*   **Authentication**: ASP.NET Core Identity with JWT Bearer Tokens
*   **Architecture**: Layered (Controllers, Services, Repositories)
*   **Validation**: FluentValidation

### Frontend

*   **Framework**: React
*   **Language**: TypeScript
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS, DaisyUI
*   **State Management**: TanStack Query (React Query) for server state
*   **Routing**: React Router
*   **HTTP Client**: Axios

## Getting Started

Follow these instructions to get both the backend and frontend running locally.

### Prerequisites

*   .NET 8 SDK
*   Node.js (LTS version)
*   PostgreSQL Server

### 1. Backend Setup

First, set up and run the .NET API.

1.  **Navigate to the API directory:**
    ```sh
    cd ExpenseTracker.API
    ```

2.  **Configure Environment Variables:**
    Create a `.env` file in the `ExpenseTracker.API` directory with the following content. Replace the placeholder values with your own.
    ```
    DefaultConnection="<YOUR_POSTGRESQL_CONNECTION_STRING>"
    JWT_ISSUER="<YOUR_JWT_ISSUER>"
    JWT_AUDIENCE="<YOUR_JWT_AUDIENCE>"
    JWT_SIGNINGKEY="<YOUR_SUPER_SECRET_JWT_SIGNING_KEY>"
    ```
    *Example Connection String: `Server=localhost;Port=5432;Database=expensedb;User Id=postgres;Password=yourpassword;`*

3.  **Apply Database Migrations:**
    Run the following command to create the database schema:
    ```sh
    dotnet ef database update
    ```

4.  **Run the API:**
    ```sh
    dotnet run
    ```
    The API will be running at `http://localhost:5243` (or a similar port). Note this URL for the next step.

### 2. Frontend Setup

With the backend running, set up and run the React client.

1.  **Open a new terminal.** Navigate to the frontend directory:
    ```sh
    cd expense-tracker-frontend
    ```

2.  **Install Dependencies:**
    ```sh
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the `expense-tracker-frontend` directory. Point the `VITE_API_BASE_URL` to your running backend instance.
    ```
    VITE_API_BASE_URL="http://localhost:5243"
    ```

4.  **Run the Frontend:**
    ```sh
    npm run dev
    ```

### 3. Access the Application

The application will be available in your browser at `http://localhost:5173`.