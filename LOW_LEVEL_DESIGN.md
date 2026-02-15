# Low-Level Design - Smart Airport Ride Pooling

This document details the internal design patterns and implementation strategies used in the backend.

## Architectural Patterns

### 1. Service-Repository Pattern
- **Controllers**: Handle HTTP-specific logic, validate inputs, and delegate to Services.
- **Services**: Implement business logic and orchestrate data flow. They are independent of the transport layer (HTTP/REST).
- **Repositories**: Encapsulate Prisma queries. Each repository corresponds to a database model (Cab, Passenger, RideRequest, CabAssignment).

### 2. Dependency Injection (Manual)
- Classes such as `RideRequestController` instantiate their required services in the constructor, allowing for clear ownership and modularity.

## Concurrency Control & Transactions

### 1. Locking Strategy
- **Pessimistic Locking**: In `CabRepository.findFirstAvailableWithLock`, the system uses `SELECT ... FOR UPDATE`. This locks the specific cab row being assigned until the transaction completes, preventing multiple users from claiming the same seat concurrently.
- **Isolation Level**: Standard PostgreSQL isolation ensures consistent reads.

### 2. Transaction Usage
- **Atomic Operations**: Critical flows like `assignCabToRideRequest` and `cancelRideRequest` are wrapped in `prisma.$transaction`.
- **Consistency**: This ensures that either all related records (Cab, RideRequest, CabAssignment) are updated together, or none are, preventing orphaned data.

## Error Handling Design

### 1. AppError Class
- A custom `AppError` class extending `Error` is used to capture:
    - `message`: Descriptive error text.
    - `statusCode`: HTTP status code (e.g., 404, 400).
    - `isOperational`: Flag to distinguish between planned business errors and unexpected system failures.

### 2. Global Middleware
- A centralized `errorHandler` middleware catches all errors passed to `next()`.
- It formats the response consistently:
    ```json
    {
      "status": "error",
      "message": "Error details..."
    }
    ```

## Class Relationships

- **Passenger** has many **RideRequest**.
- **RideRequest** has one **CabAssignment**.
- **Cab** has many **CabAssignment**.
- **CabAssignment** links one **Cab** to one **RideRequest**.
