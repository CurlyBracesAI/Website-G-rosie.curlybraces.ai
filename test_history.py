import requests
import json

url = "http://127.0.0.1:5000/rosie-test"
headers = {"Content-Type": "application/json"}

print("=" * 60)
print("Test 1: Simple message (no history)")
print("=" * 60)
data1 = {"message": "My name is Alice."}
response1 = requests.post(url, headers=headers, json=data1, timeout=30)
print(f"Status: {response1.status_code}")
print(f"Response: {response1.json()['message']}\n")

print("=" * 60)
print("Test 2: Follow-up with conversation history")
print("=" * 60)
data2 = {
    "message": "What is my name?",
    "history": [
        {"role": "user", "content": "My name is Alice."},
        {"role": "assistant", "content": response1.json()['message']}
    ]
}
response2 = requests.post(url, headers=headers, json=data2, timeout=30)
print(f"Status: {response2.status_code}")
print(f"Response: {response2.json()['message']}\n")

print("=" * 60)
print("Test 3: Without history (should not remember)")
print("=" * 60)
data3 = {"message": "What is my name?"}
response3 = requests.post(url, headers=headers, json=data3, timeout=30)
print(f"Status: {response3.status_code}")
print(f"Response: {response3.json()['message']}\n")

print("=" * 60)
print("All tests completed!")
print("=" * 60)
