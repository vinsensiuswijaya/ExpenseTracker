# Expense Tracker API

A robust backend API for a personal expense tracking application, built with .NET 8 and ASP.NET Core. This project demonstrates a clean, layered architecture and modern backend development practices.

## Features

*   **User Authentication**: Secure user registration and login using JWT (JSON Web Tokens).
*   **Expense Management**: Full CRUD (Create, Read, Update, Delete) operations for user-specific expenses.
*   **Category Management**: Full CRUD operations for user-specific expense categories.
*   **Data Visualization**: An endpoint to provide aggregated expense data for charts (e.g., expenses by category).

## Technologies

*   **Framework**: .NET 8, ASP.NET Core
*   **Database**: PostgreSQL with Entity Framework Core
*   **Authentication**: ASP.NET Core Identity with JWT Bearer Tokens
*   **Architecture**: Layered architecture (Controllers, Services, Repositories)
*   **Libraries**:
    *   **AutoMapper**: For object-to-object mapping (Entities to DTOs).
    *   **FluentValidation**: For robust and declarative input validation.
    *   **DotNetEnv**: For managing environment variables.

## Architectural Highlights

This project is built with a focus on separation of concerns, maintainability, and scalability.

### Service Layer

The business logic is encapsulated within a dedicated service layer (`/Services`). This decouples the business rules from the presentation layer (Controllers), making the logic reusable and easier to test independently.

*   [`ICategoriesService`](ExpenseTracker.API/Interfaces/ICategoriesService.cs)
*   [`IExpensesService`](ExpenseTracker.API/Interfaces/IExpensesService.cs)

### Repository Pattern

Data access is abstracted using the repository pattern. A generic repository (`GenericRepository.cs`) provides common data operations, while specific repositories (`ExpenseRepository.cs`, `CategoryRepository.cs`) handle more complex queries. This isolates the data access logic, allowing for easier changes to the data source and improved testability.

*   [`IGenericRepository<T>`](ExpenseTracker.API/Interfaces/IGenericRepository.cs)
*   [`IExpenseRepository`](ExpenseTracker.API/Interfaces/IExpenseRepository.cs)
*   [`ICategoryRepository`](ExpenseTracker.API/Interfaces/ICategoryRepository.cs)

### Result Object Pattern

Instead of throwing exceptions for predictable failures (e.g., "not found"), services return a custom `Result<T>` object. This pattern provides a clear and explicit way to handle both successful outcomes and business logic errors, improving code readability and robustness.

*   [`Result.cs`](ExpenseTracker.API/Shared/Result.cs)

### JWT Authentication

The API is secured using JSON Web Tokens. The [`TokenService`](ExpenseTracker.API/Services/TokenService.cs) generates a token upon successful login, which the client must include in the `Authorization` header for subsequent requests to protected endpoints.

### Dependency Injection

The application makes extensive use of .NET's built-in dependency injection container to manage the lifetime of services, repositories, and other components. This promotes loosely coupled code and is configured in [`Program.cs`](ExpenseTracker.API/Program.cs).

## API Endpoints

The API exposes the following resources:

| Controller | Endpoint | Description |
|---|---|---|
| `Account` | `POST /api/account/register` | Registers a new user. |
| | `POST /api/account/login` | Logs in a user and returns a JWT. |
| `Category` | `GET /api/category` | Gets all categories for the authenticated user. |
| | `POST /api/category` | Creates a new category. |
| | `PUT /api/category/{id}` | Updates an existing category. |
| | `DELETE /api/category/{id}` | Deletes a category. |
| `Expense` | `GET /api/expense` | Gets all expenses for the authenticated user. |
| | `POST /api/expense` | Creates a new expense. |
| | `PUT /api/expense/{id}` | Updates an existing expense. |
| | `DELETE /api/expense/{id}` | Deletes an expense. |
| | `GET /api/expense/chart` | Gets aggregated expense data for charts. |

## Getting Started

### Prerequisites

*   .NET 8 SDK
*   PostgreSQL

### Installation & Setup

1.  **Clone the repository.**
2.  **Configure Environment Variables:**
    Create a `.env` file in the `ExpenseTracker.API` directory with the following content:

    ```
    DefaultConnection="<YOUR_POSTGRESQL_CONNECTION_STRING>"
    JWT_ISSUER="<YOUR_JWT_ISSUER>"
    JWT_AUDIENCE="<YOUR_JWT_AUDIENCE>"
    JWT_SIGNINGKEY="<YOUR_SUPER_SECRET_JWT_SIGNING_KEY>"
    ```

3.  **Apply Migrations:**
    Navigate to the `ExpenseTracker.API` directory and run the following command to create the database schema:
    ```sh
    dotnet ef database update
    ```

4.  **Run the Application:**
    ```sh
    dotnet run --project ExpenseTracker.API
    ```
