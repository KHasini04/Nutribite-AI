import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_api():
    print("Testing API flow...")
    
    # 1. Signup
    print("1. Testing Signup...")
    signup_data = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "Password123",
        "monthly_budget": 5000.0,
        "food_preference": "Vegetarian",
        "goal": "Weight Loss"
    }
    r = requests.post(f"{BASE_URL}/auth/signup", json=signup_data)
    print(f"Signup response: {r.status_code}")
    if r.status_code not in [200, 400]: # 400 means already exists
        print(r.json())
        
    # 2. Login
    print("2. Testing Login...")
    login_data = {
        "email": "test@example.com",
        "password": "Password123"
    }
    r = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    print(f"Login response: {r.status_code}")
    
    if r.status_code != 200:
        print("Login failed, aborting tests.")
        return
        
    token = r.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # 3. Get Recommendation
    print("3. Testing Recommendations...")
    rec_data = {
        "prompt": "Plan My Day"
    }
    r = requests.post(f"{BASE_URL}/recommend/", json=rec_data, headers=headers)
    print(f"Recommendations response: {r.status_code}")
    print(r.json() if r.status_code == 200 else r.text)
    
    # 4. Add Order
    print("4. Testing Add Order...")
    order_data = {
        "restaurant": "Test Rest",
        "meal_name": "Salad",
        "amount": 150.0,
        "calories": 400,
        "protein": 20,
        "carbs": 30,
        "fat": 15
    }
    r = requests.post(f"{BASE_URL}/orders", json=order_data, headers=headers)
    print(f"Add Order response: {r.status_code}")
    print(r.json() if r.status_code == 200 else r.text)
    
    # 5. Get Orders
    print("5. Testing Get Orders...")
    r = requests.get(f"{BASE_URL}/orders", headers=headers)
    print(f"Get Orders response: {r.status_code}")
    if r.status_code == 200:
        print(f"Found {len(r.json())} orders")
    else:
        print(r.text)
        
    # 6. Update Profile
    print("6. Testing Update Profile...")
    profile_data = {
        "monthly_budget": 6000.0,
        "goal": "Maintenance",
        "food_preference": "Vegan",
        "target_calories": 2500,
        "target_protein": 150
    }
    r = requests.put(f"{BASE_URL}/profile/", json=profile_data, headers=headers)
    print(f"Update Profile response: {r.status_code}")
    print(r.json() if r.status_code == 200 else r.text)

    # 7. Delete Order
    print("7. Testing Delete Order...")
    order_id = requests.get(f"{BASE_URL}/orders/", headers=headers).json()[0]["id"]
    r = requests.delete(f"{BASE_URL}/orders/{order_id}", headers=headers)
    print(f"Delete Order response: {r.status_code}")
    
    # 8. Clear Orders
    print("8. Testing Clear Orders...")
    r = requests.delete(f"{BASE_URL}/orders/", headers=headers)
    print(f"Clear Orders response: {r.status_code}")
    print(f"Orders after clear: len={len(requests.get(f'{BASE_URL}/orders/', headers=headers).json())}")

if __name__ == "__main__":
    test_api()
