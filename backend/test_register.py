import requests

url = 'http://localhost:5000/register'
data = {
    'username': 'testuser2',
    'email': 'testuser2@example.com',
    'password': 'password123',
    'role': 'consumer'
}

response = requests.post(url, json=data)
print(f"Status Code: {response.status_code}")
print(f"Response: {response.text}")
