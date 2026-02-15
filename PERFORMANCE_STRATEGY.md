# Performance Strategy - Smart Airport Ride Pooling

This document outlines the strategies implemented and recommended to ensure high performance and low latency.

## 1. Database Optimizations

### Prisma Optimization
- **Lean Queries**: Only fetch required fields using the `select` clause (though full objects are used currently for simplicity).
- **Connection Pooling**: Use the `?connection_limit=20` parameter in the `DATABASE_URL` to manage concurrent connections efficiently.

### Indexing
- **Frequent Lookups**: Indexes on `RideStatus`, `CabStatus`, and foreign keys (`passengerId`, `cabId`) to ensure `O(log N)` search performance.
- **Ordered Lookups**: Indexes on `createdAt` in the `Cab` table to speed up the FIFO assignment query.

## 2. Scalability Strategies

### Horizontal Scaling
- Use **Docker Swarm** or **Kubernetes** to run multiple instances of the application.
- Since the application is stateless (session-less), any instance can handle any request.

### Node Cluster Mode
- Utilize the `cluster` module in Node.js to spawn one worker process per CPU core on a single machine, fully utilizing multi-core hardware.
- Process managers like **PM2** can be used to handle this automatically:
  ```bash
  pm2 start dist/server.js -i max
  ```

## 3. Load Balancing
- Use **Nginx** or a cloud-native load balancer (AWS ALB) to distribute incoming traffic.
- Health check endpoint `/health` is implemented to allow the load balancer to remove unhealthy nodes automatically.

## 4. Caching & Persistence

### Redis Integration
- **Distributed Locks**: Use Redis (Redlock) if the database row-level locking becomes a bottleneck in extremely high-scale scenarios.
- **Session/Metadata Caching**: Store hot data like passenger profiles or active cab locations in Redis for sub-millisecond access.

## 5. Network Optimization
- **Gzip Compression**: Enable compression for API responses to reduce payload size.
- **Keep-Alive**: Ensure HTTP persistent connections are used to reduce TCP handshake overhead.

## Performance Metrics (Targets)
- **Concurrency**: 10,000 users.
- **Throughput**: 100+ requests per second.
- **Latency**: P95 < 300ms.
