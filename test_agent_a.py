#!/usr/bin/env python3
"""Test script to trigger Agent A workflow"""

import requests
import json
import time
import os

# Get credentials from environment
username = os.getenv('AUTH_USERNAME')
password = os.getenv('AUTH_PASSWORD')

# Base URL
base_url = 'http://localhost:5000'

print("🧪 Testing Agent A Workflow Trigger\n")

# Step 1: Login to get session
print("1️⃣ Logging in...")
session = requests.Session()
login_response = session.post(
    f'{base_url}/api/login',
    json={'email': username, 'password': password}
)

if login_response.status_code != 200:
    print(f"❌ Login failed: {login_response.text}")
    exit(1)

print("✅ Login successful!\n")

# Step 2: Trigger Agent A workflow
print("2️⃣ Triggering Agent A workflow...")
trigger_response = session.post(
    f'{base_url}/api/trigger-workflow',
    json={
        'agent_id': 'agent_a',
        'message': 'Test workflow - checking Pipedrive client login and shortlist',
        'user_id': 'test_user_123'
    }
)

print(f"Response status: {trigger_response.status_code}")
print(f"Response: {json.dumps(trigger_response.json(), indent=2)}\n")

if trigger_response.status_code == 200:
    response_data = trigger_response.json()
    run_id = response_data.get('run_id')
    
    print(f"✅ Workflow triggered! Run ID: {run_id}\n")
    
    # Step 3: Poll for status
    print("3️⃣ Polling for workflow status (max 30 seconds)...")
    for i in range(6):  # Poll 6 times, 5 seconds apart
        time.sleep(5)
        status_response = session.get(f'{base_url}/api/poll-workflow-status/{run_id}')
        status_data = status_response.json()
        
        print(f"   Poll #{i+1}: Status = {status_data.get('status')}")
        
        if status_data.get('status') == 'completed':
            print(f"\n🎉 Workflow completed!")
            print(f"Result: {status_data.get('result')}")
            break
else:
    print(f"❌ Workflow trigger failed: {trigger_response.text}")
