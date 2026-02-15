#!/bin/bash

# Base URL
BASE_URL="http://localhost:3000"
TIMESTAMP=$(date +%s)

echo "--- 1. Create Passenger ---"
PASSENGER_RES=$(curl -s -X POST $BASE_URL/passengers \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"User $TIMESTAMP\", \"phone\": \"$TIMESTAMP\"}")
echo "Response: $PASSENGER_RES"
PASSENGER_ID=$(echo $PASSENGER_RES | grep -o '"id":"[^"]*"' | cut -d'"' -f4)

if [ -z "$PASSENGER_ID" ]; then
  echo "Failed to create passenger"
  exit 1
fi

echo -e "\n--- 2. Create Cab ---"
CAB_RES=$(curl -s -X POST $BASE_URL/cabs \
  -H "Content-Type: application/json" \
  -d "{\"driverName\": \"Driver $TIMESTAMP\", \"totalSeats\": 4, \"luggageCapacity\": 2}")
echo "Response: $CAB_RES"

echo -e "\n--- 3. Create Ride Request ---"
RIDE_RES=$(curl -s -X POST $BASE_URL/ride-requests \
  -H "Content-Type: application/json" \
  -d "{\"passengerId\": \"$PASSENGER_ID\", \"pickupLat\": 10, \"pickupLng\": 20, \"dropLat\": 10.5, \"dropLng\": 20.5, \"luggageCount\": 1, \"detourTolerance\": 5}")
echo "Response: $RIDE_RES"
RIDE_ID=$(echo $RIDE_RES | grep -o '"id":"[^"]*"' | cut -d'"' -f4)

if [ -z "$RIDE_ID" ]; then
  echo "Failed to create ride request"
  exit 1
fi

echo -e "\n--- 4. Assign Cab to Ride Request ---"
ASSIGN_RES=$(curl -s -X POST $BASE_URL/ride-requests/$RIDE_ID/assign)
echo "Response: $ASSIGN_RES"

if [[ $ASSIGN_RES == *"rideRequestId"* ]]; then
  echo -e "\nSUCCESS: Cab assigned successfully with locking!"
else
  echo -e "\nFAILURE: Cab assignment failed."
  exit 1
fi
