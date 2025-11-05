#!/usr/bin/env python3
"""Direct test of Make.com webhook integration"""

import requests
import json
import os

# Get the webhook URL from environment
webhook_url = os.getenv('MAKE_WEBHOOK_AGENT_A')

print("🧪 Testing Agent A Webhook Integration\n")
print(f"Webhook URL: {webhook_url[:50]}..." if webhook_url else "No webhook URL found!")
print()

if not webhook_url:
    print("❌ MAKE_WEBHOOK_AGENT_A secret not set!")
    exit(1)

# Test payload matching what Rosie actually sends
test_payload = {
    "agent_type": "agent_a",
    "run_number": 1,
    "user": {
        "id": 1,
        "name": "Test User",
        "email": "test@example.com"
    },
    "conversation_context": "Test: Check Pipedrive for new client logins and add to shortlist",
    "timestamp": "2025-11-05T23:43:00Z"
}

print("📤 Sending test payload to Make.com webhook...")
print(f"Payload: {json.dumps(test_payload, indent=2)}\n")

try:
    response = requests.post(
        webhook_url,
        json=test_payload,
        headers={'Content-Type': 'application/json'},
        timeout=30
    )
    
    print(f"Response Status: {response.status_code}")
    print(f"Response Headers: {dict(response.headers)}")
    print(f"Response Body: {response.text}\n")
    
    if response.status_code == 200:
        print("✅ Webhook triggered successfully!")
        print("\n🔄 Now check your Make.com scenario to see if it ran")
        print("⏰ The HTTP callback should call back to Rosie with results")
    else:
        print(f"❌ Webhook trigger failed with status {response.status_code}")
        
except Exception as e:
    print(f"❌ Error: {str(e)}")
