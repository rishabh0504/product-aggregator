# Product Aggregator Backend

A **NestJS** backend service for aggregating product prices and availability from multiple external APIs. Built with **NestJS**, **Prisma**, and **PostgreSQL**.

---

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Scripts](#scripts)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- Aggregates product prices from multiple sources
- Scheduled fetch using `@nestjs/schedule`
- Prisma ORM for database management
- Configurable retry, timeout, and circuit breaker policies

---

## Requirements

- Node.js >= 20.x
- npm >= 10.x
- Docker & Docker Compose (for PostgreSQL setup)
- PostgreSQL >= 15.x (or use Docker)

---

## Getting Started

1. **Clone the repository**

```bash
git clone <repository-url>
cd product-aggregator-backend
```

## Install dependencies

`npm install`

## Configure environment variables

Copy .env.example to .env and update variables:

`cp .env.example .env`

## Start PostgreSQL using Docker Compose

<pre>docker-compose up -d</pre>

## Run Prisma migrations

<pre>npm run prisma:migrate</pre>

## Generate Prisma client

<pre>npm run prisma:generate</pre>

## Start the server

### Development (hot reload):

<pre>npm run start:dev</pre>

## Production:

<pre>npm run build
npm run start:prod</pre>

## Test case:

<pre>npm run test:e2e</pre>

## Swagger docs

<pre>http://localhost:3000/docs#/</pre>

The server will run at http://localhost:3000.

| Variable                      | Description                                            | Default                                                                 |
| ----------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------- |
| DATABASE_URL                  | PostgreSQL connection string                           | postgres://postgres:postgres@127.0.0.1:5432/aggregator_db?schema=public |
| PORT                          | Application port                                       | 3000                                                                    |
| FETCH_INTERVAL_SECONDS        | Interval to fetch product data (in seconds)            | 20                                                                      |
| STALENESS_SECONDS             | Maximum allowed data age (in seconds)                  | 120                                                                     |
| FETCH_TIMEOUT_MS              | Timeout for external API requests (ms)                 | 8000                                                                    |
| RETRY_MAX_ATTEMPTS            | Maximum retry attempts for failed requests             | 3                                                                       |
| RETRY_BASE_DELAY_MS           | Base delay for retry exponential backoff (ms)          | 500                                                                     |
| CIRCUIT_BREAKER_FAILURES      | Number of consecutive failures to open circuit breaker | 5                                                                       |
| CIRCUIT_BREAKER_RESET_SECONDS | Time to reset circuit breaker (seconds)                | 60                                                                      |
