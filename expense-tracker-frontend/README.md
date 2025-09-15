# Expense Tracker Frontend

A modern frontend for the Expense Tracker application, built with React, Vite, and TypeScript. This project provides a user-friendly interface to manage personal expenses by consuming the [Expense Tracker API](../ExpenseTracker.API/README.md).

> **Note:** This project is a work in progress. Features are actively being added and improved.

## Features

*   **User Authentication**: Secure user registration and login flows with JWT token management.
*   **Dashboard**: An overview of total categories, expenses, and spending.
*   **Expense Management**: Full CRUD (Create, Read, Update, Delete) operations for expenses.
*   **Category Management**: Full CRUD operations for expense categories.
*   **Data Visualization**: Interactive pie charts to visualize expenses by category.
*   **Protected Routes**: Client-side routing protection to ensure only authenticated users can access sensitive data.
*   **Responsive Design**: A clean and responsive UI built with Tailwind CSS and DaisyUI.

## Technologies

*   **Framework**: [React](https://react.dev/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/), [DaisyUI](https://daisyui.com/)
*   **Data Fetching & State Management**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
*   **Routing**: [React Router](https://reactrouter.com/)
*   **HTTP Client**: [Axios](https://axios-http.com/)
*   **Charting**: [Chart.js](https://www.chartjs.org/) with [react-chartjs-2](https://react-chartjs-2.js.org/)

## Architectural Highlights

This project is built with a focus on modern frontend practices, maintainability, and a great developer experience.

### Component-Based Architecture

The UI is broken down into reusable components, organized by feature in the [`src/pages`](src/pages) and [`src/components`](src/components) directories.

### Centralized Authentication State

Global authentication state (e.g., token, user status) is managed using React's Context API. The [`AuthProvider`](src/context/AuthContext.tsx) provides this state to the entire application, and the [`useAuth`](src/context/AuthContext.tsx) hook offers a simple way for components to access it.

### Server State Management with TanStack Query

Instead of managing server state with `useState` and `useEffect`, the application leverages TanStack Query for data fetching, caching, and synchronization. This simplifies data management, handles loading and error states, and improves performance with features like automatic refetching. See its use in [`CategoriesList.tsx`](src/pages/Categories/CategoriesList.tsx).

### Service Layer Abstraction

API communication is abstracted into a dedicated service layer in the [`src/services`](src/services) directory. Functions like [`getCategories`](src/services/categoriesService.ts) and [`getExpenses`](src/services/expensesService.ts) encapsulate the logic for making API requests, decoupling it from the UI components.

### Protected Routes

The application uses a higher-order component, [`Protected`](src/routes/index.tsx), to guard routes that require authentication. This ensures that users cannot access protected pages like `/expenses` or `/categories` without being logged in.

## Getting Started

### Prerequisites

*   Node.js (LTS version recommended)
*   npm (or a compatible package manager like pnpm or yarn)
*   A running instance of the [Expense Tracker API](../ExpenseTracker.API/README.md).

### Installation & Setup

1.  **Navigate to the project directory:**
    ```sh
    cd expense-tracker-frontend
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the `expense-tracker-frontend` directory with the following content, pointing to your running API instance:

    ```
    VITE_API_BASE_URL="http://localhost:5243"
    ```
    *Note: The default port for the .NET API is often `5243` (HTTPS) or `5093` (HTTP) when run with `dotnet run`.*

4.  **Run the Development Server:**
    ```sh
    npm run dev
    ```

The application will be available at `http://localhost:5173`.