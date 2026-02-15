#!/bin/bash

BASE_URL="http://localhost:3000"
TIMESTAMP=$(date +%s)

echo "--- 1. Create Passenger ---"
PASSENGER_RES=$(curl -s -X POST $BASE_URL/passengers \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"User $TIMESTAMP\", \"phone\": \"$TIMESTAMP\"}")
PASSENGER_ID=$(echo $PASSENGER_RES | grep -o '"id":"[^"]*"' | cut -d'"' -f4)

if [ -z "$PASSENGER_ID" ]; then
  echo "Failed to create passenger"
  exit 1
fi

echo "--- 2. Create Cab (Capacity: 2) ---"
# Luggage Capacity = 2
CAB_RES=$(curl -s -X POST $BASE_URL/cabs \
  -H "Content-Type: application/json" \
  -d "{\"driverName\": \"Driver $TIMESTAMP\", \"totalSeats\": 4, \"luggageCapacity\": 2}")

echo "--- 3. Scenario A: Success (Luggage: 1) ---"
# Create Request with Luggage 1
REQ_OK_RES=$(curl -s -X POST $BASE_URL/ride-requests \
  -H "Content-Type: application/json" \
  -d "{\"passengerId\": \"$PASSENGER_ID\", \"pickupLat\": 10, \"pickupLng\": 20, \"dropLat\": 10.5, \"dropLng\": 20.5, \"luggageCount\": 1, \"detourTolerance\": 5}")
REQ_OK_ID=$(echo $REQ_OK_RES | grep -o '"id":"[^"]*"' | cut -d'"' -f4)

# Assign
ASSIGN_OK_RES=$(curl -s -X POST $BASE_URL/ride-requests/$REQ_OK_ID/assign)
echo "Assignment A (Expected OK): $ASSIGN_OK_RES"

if [[ $ASSIGN_OK_RES == *"rideRequestId"* ]]; then
  echo "SUCCESS: Assigned valid request."
else
  echo "FAILURE: Failed to assign valid request."
  exit 1
fi

echo "--- 4. Scenario B: Failure (Luggage: 5) ---"
# Create Request with Luggage 5 (Capacity remaining is 1, original 2)
# Need new passenger for new request? No, one passenger can have multiple requests? 
# Schema says passengerId is FK. RideRequest has ID.
# Let's create a NEW passenger just to be safe/clean.
TIMESTAMP2=$(($TIMESTAMP + 1))
PASSENGER_RES_2=$(curl -s -X POST $BASE_URL/passengers \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"User $TIMESTAMP2\", \"phone\": \"$TIMESTAMP2\"}")
PASSENGER_ID_2=$(echo $PASSENGER_RES_2 | grep -o '"id":"[^"]*"' | cut -d'"' -f4)

REQ_FAIL_RES=$(curl -s -X POST $BASE_URL/ride-requests \
  -H "Content-Type: application/json" \
  -d "{\"passengerId\": \"$PASSENGER_ID_2\", \"pickupLat\": 10, \"pickupLng\": 20, \"dropLat\": 10.5, \"dropLng\": 20.5, \"luggageCount\": 5, \"detourTolerance\": 5}")
REQ_FAIL_ID=$(echo $REQ_FAIL_RES | grep -o '"id":"[^"]*"' | cut -d'"' -f4)

# Assign
ASSIGN_FAIL_RES=$(curl -s -X POST $BASE_URL/ride-requests/$REQ_FAIL_ID/assign)
echo "Assignment B (Expected Failure 409): $ASSIGN_FAIL_RES"

if [[ $ASSIGN_FAIL_RES == *"No cabs available with sufficient luggage capacity"* ]]; then
  echo "SUCCESS: Correctly rejected large luggage."
else
  echo "FAILURE: Did not reject large luggage or wrong error."
  exit 1
fi
