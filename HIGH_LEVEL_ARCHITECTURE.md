# High-Level Architecture - Smart Airport Ride Pooling

This document outlines the high-level architecture of the Smart Airport Ride Pooling backend system, designed for reliability, consistency, and scale.

## System Components

### 1. API Layer (Express.js)
- **Role**: Entry point for all client requests.
- **Responsibilities**: 
    - Request validation using `Zod`.
    - Routing and middleware execution (JWT, Helmet, CORS).
    - Error handling via global middleware.
    - Exposing Swagger/OpenAPI documentation.

### 2. Service Layer (Business Logic)
- **Role**: Contains the core business rules of the application (e.g., ride assignment, cancellation logic).
- **Responsibilities**:
    - Orchestrating repository calls.
    - Managing database transactions to ensure atomicity.
    - Enforcing domain-specific constraints (e.g., seat capacity, luggage limits).

### 3. Repository Layer (Data Access)
- **Role**: Abstracted data access layer using Prisma ORM.
- **Responsibilities**:
    - Performing CRUD operations.
    - Implementing database-specific optimizations (e.g., raw SQL for row-level locking).
    - Hiding Prisma complexity from the service layer.

### 4. Database (PostgreSQL)
- **Role**: Persistent storage for all system state (Passengers, Cabs, RideRequests, Assignments).
- **Features**: 
    - Relational integrity.
    - Transactional support (ACID).
    - Indexing for performance on high-read fields.

### 5. Distributed Cache/Lock (Redis)
- **Role**: Used for distributed locking and potentially caching frequently accessed data.
- **Usage**: Ensuring concurrency control across multiple application instances in a horizontal scaling scenario.

### 6. Infrastructure (Docker)
- **Role**: Containerization for consistent development and production environments.
- **Components**: `Dockerfile` for the Node.js app and `docker-compose.yml` for local orchestration of Postgres and Redis.

## Scalability & Performance Strategy

To handle **10,000 concurrent users** and **100 requests per second** while keeping latency **under 300ms**:

### 1. Horizontal Scalability
- The application is stateless, allowing it to be scaled horizontally across multiple containers/pods using a Load Balancer (e.g., Nginx or AWS ALB).
- Redis is utilized for distributed state/locks to prevent race conditions across nodes.

### 2. Database Optimization
- **Connection Pooling**: Using Prisma's built-in connection pooling or dedicated tools like PgBouncer.
- **Read-Write Splitting**: Offloading heavy read operations to replica databases.
- **Indexing**: Optimized indexes on `status`, `passengerId`, and `cabId` to ensure fast lookups.

### 3. Asynchronous Processing
- Offloading non-critical tasks (e.g., notification sending) to background workers using a message queue (BullMQ + Redis).

### 4. Efficient Locking
- Utilizing selective row-level locking (`FOR UPDATE`) instead of table-level locks to maximize concurrency during ride assignments.
