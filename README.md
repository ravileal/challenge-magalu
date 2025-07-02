# Favorite Products API - aiqfome Challenge

A RESTful API developed as part of the technical challenge for a Software Engineer position. The project manages clients and their lists of favorite products, integrating with an external product API.

## ✨ Features

- Full CRUD management for Clients.
- Client authentication via JWT.
- Add, list, and remove favorite products.
- Product validation through an external API (`fakestoreapi.com`).
- High-performance caching with Redis to optimize favorite product listings.

---

## 🏛️ Architectural Decisions

This project is built upon the principles of **Hexagonal Architecture (Ports & Adapters)** to ensure low coupling and high testability.

- **Domain**: Contains the pure business logic and entities, with no external dependencies.
- **Application**: Orchestrates the business flows (Use Cases) and defines the interfaces (Ports).
- **Infrastructure**: Implements the technical details (Adapters), such as database access, caching, and external API clients.
- **Presentation**: The application's entry layer (API with Fastify), including controllers and routes.

Key patterns were used to ensure a clean and maintainable codebase:

- **Dependency Injection**: A central "Composition Root" (`src/container.ts`) is responsible for instantiating and injecting all dependencies (like database connections and repositories), ensuring that modules are decoupled and easy to test.
- **Centralized Error Handling**: A global error handler middleware captures all exceptions, standardizing error responses and keeping controllers clean and focused on the success path.

---

## 💻 Tech Stack

- **Language**: Node.js with TypeScript
- **API Framework**: Fastify
- **Database**: PostgreSQL
- **Migrations**: Knex.js
- **Cache**: Redis
- **Testing**: Jest
- **Code Quality**: ESLint (Airbnb config), Prettier, and Husky with `lint-staged`.

---

## 🚀 Getting Started

Using **Docker** and **Docker Compose** is highly recommended to run this project, as it guarantees that the entire environment (API, Database, and Cache) is set up automatically.

**Prerequisites:**

- [Docker](https://www.docker.com/get-started) >= 27.3.1
- [Docker Compose](https://docs.docker.com/compose/gettingstarted/) >= 2.31.0
- [Node Version Manager (NVM)](https://github.com/nvm-sh/nvm) (Recommended) >= 23.3.0

**Setup Steps:**

1. **Clone the repository:**

    ```bash
    git clone [https://github.com/your-username/your-repository.git](https://github.com/your-username/your-repository.git)
    cd your-repository
    ```

2. **Set up the environment:**
    - Use NVM to ensure you are using the correct Node.js version.

        ```bash
        nvm use
        ```

    - Rename the `.env.example` file to `.env`. No changes are needed if you are using the default Docker Compose settings.

3. **Launch the containers:**

    ```bash
    docker-compose up -d --build
    ```

4. **Run database migrations:**

    ```bash
    npm run knex migrate:latest
    ```

That's it! The API will be available at `http://localhost:3333`.

---

## 📄 API Documentation

The API documentation was created using the **OpenAPI 3.0** specification and is available in the `./docs` directory.
