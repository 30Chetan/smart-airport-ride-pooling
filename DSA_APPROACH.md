# DSA Approach - Smart Airport Ride Pooling

This document explains the Data Structures and Algorithms approach used for the Ride Assignment engine.

## Ride Assignment Algorithm

The system implements a **Constrained Greedy Selection** algorithm for cab assignment.

### Logic:
1. **Filtering**: Identify all cabs with `status: AVAILABLE`.
2. **Criteria Validation**:
    - `availableSeats >= 1`
    - `availableLuggageCapacity >= rideRequest.luggageCount`
3. **Selection**: Pick the oldest available cab (FIFO) to ensure fairness among drivers.
4. **Atomicity**: The selection and subsequent updates (decrementing seats/luggage) are performed inside a database transaction with a row-level lock.

### Time Complexity:
- **Search**: `O(log N)` where N is the number of cabs, assuming proper indexing on `status`, `availableSeats`, and `availableLuggageCapacity`.
- **Total**: `O(log N + T)` where T is the constant time for transaction overhead.

### Space Complexity:
- **O(1)**: The algorithm does not require significant auxiliary space as it operates directly on the database result set.

## Concurrency Behavior

### The Double-Booking Problem
In a high-concurrency environment (100+ requests/sec), two ride requests might fetch the same "Available Cab" at the exact same millisecond. If both proceed, the cab might end up with negative seats.

### Solution: Row-Level Locking
- The system uses `FOR UPDATE` in the PostgreSQL query.
- When Request A reads Cab 1, a lock is placed.
- If Request B tries to read Cab 1, it must wait until Request A's transaction commits or rolls back.
- This ensures that seat/luggage decrements are strictly sequential for any single cab.

## Future Improvement: Ride Pooling Algorithm
Currently, the system assigns one ride request to a cab at a time. To implement full ride pooling (multiple requests in one trip):
1. **Clustering**: Use a spatial index (or GeoJSON) to find ride requests with similar routes.
2. **Pathfinding**: Use Dijkstra’s or A* algorithm to calculate segments and ensure the detour distance stays within the `detourTolerance`.
