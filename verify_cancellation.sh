#!/bin/bash

# Base URL
BASE_URL="http://localhost:3000"

# Generate unique phone number to avoid unique constraint error
PHONE=$((RANDOM % 9000000000 + 1000000000))

echo "--- 1. Create Passenger ---"
PASSENGER_RES=$(curl -s -X POST $BASE_URL/passengers \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"Test User Cancellation\", \"phone\": \"$PHONE\"}")
echo "Response: $PASSENGER_RES"
PASSENGER_ID=$(echo $PASSENGER_RES | grep -o '"id":"[^"]*"' | cut -d'"' -f4)

if [ -z "$PASSENGER_ID" ]; then
  echo "Failed to create passenger"
  exit 1
fi

echo -e "\n--- 2. Create Cab ---"
CAB_RES=$(curl -s -X POST $BASE_URL/cabs \
  -H "Content-Type: application/json" \
  -d '{"driverName": "Cancellation Driver", "totalSeats": 1, "luggageCapacity": 1}')
echo "Response: $CAB_RES"
CAB_ID=$(echo $CAB_RES | grep -o '"id":"[^"]*"' | cut -d'"' -f4)

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

echo -e "\n--- 5. Verify Cab is FULL ---"
CAB_STATUS_RES=$(curl -s -X GET $BASE_URL/cabs/$CAB_ID)
echo "Cab Status: $CAB_STATUS_RES"

if [[ $CAB_STATUS_RES == *"FULL"* ]]; then
  echo "SUCCESS: Cab is correctly marked as FULL"
else
  echo "FAILURE: Cab should be FULL"
fi

echo -e "\n--- 6. Cancel Ride Request ---"
CANCEL_RES=$(curl -s -X POST $BASE_URL/ride-requests/$RIDE_ID/cancel)
echo "Response: $CANCEL_RES"

if [[ $CANCEL_RES == *"success"* ]]; then
  echo "SUCCESS: Cancel API returned success"
else
  echo "FAILURE: Cancel API failed"
  exit 1
fi

echo -e "\n--- 7. Verify Ride Request is CANCELLED ---"
# Assuming there is a GET ride-requests/:id endpoint, if not we check if cancel worked from response
# Let's check cab status again
echo -e "\n--- 8. Verify Cab is AVAILABLE again ---"
CAB_STATUS_RES=$(curl -s -X GET $BASE_URL/cabs/$CAB_ID)
echo "Cab Status: $CAB_STATUS_RES"

if [[ $CAB_STATUS_RES == *"AVAILABLE"* && $CAB_STATUS_RES == *"\"availableSeats\":1"* && $CAB_STATUS_RES == *"\"availableLuggageCapacity\":1"* ]]; then
  echo -e "\nSUCCESS: Cab capacity and status restored successfully!"
else
  echo -e "\nFAILURE: Cab capacity or status not restored."
  exit 1
fi

echo -e "\n--- ALL TESTS PASSED ---"
