import requests
import json

url = "http://127.0.0.1:5000/rosie-test"
headers = {"Content-Type": "application/json"}
data = {"message": "Hello Rosie, who are you?"}

try:
    response = requests.post(url, headers=headers, json=data, timeout=30)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"Error: {e}")
