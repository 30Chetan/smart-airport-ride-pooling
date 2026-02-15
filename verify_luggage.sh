#!/bin/bash

# Base URL
BASE_URL="http://localhost:3000"
TIMESTAMP=$(date +%s)

echo "--- Create Cab ---"
CAB_RES=$(curl -s -X POST $BASE_URL/cabs \
  -H "Content-Type: application/json" \
  -d "{\"driverName\": \"Luggage Driver $TIMESTAMP\", \"totalSeats\": 4, \"luggageCapacity\": 5}")

echo "Response: $CAB_RES"

if [[ $CAB_RES == *"availableLuggageCapacity\":5"* ]]; then
  echo -e "\nSUCCESS: availableLuggageCapacity initialized correctly!"
else
  echo -e "\nFAILURE: availableLuggageCapacity check failed."
  exit 1
fi
