import httpx
from ..core.config import settings

async def get_nutrition_for_meal(meal_name: str) -> dict:
    if settings.NUTRITIONIX_APP_ID == "mock_app_id":
        meal_lower = meal_name.lower()
        if "salad" in meal_lower:
            return {"calories": 150.0, "protein": 5.0, "carbs": 10.0, "fat": 8.0, "health_score": 9.5}
        elif "pizza" in meal_lower or "burger" in meal_lower:
            return {"calories": 850.0, "protein": 30.0, "carbs": 100.0, "fat": 40.0, "health_score": 3.0}
        elif "egg" in meal_lower:
            return {"calories": 140.0, "protein": 12.0, "carbs": 1.0, "fat": 10.0, "health_score": 8.0}
        else:
            # Generate a pseudo-random looking value based on string length
            base = len(meal_name) * 20.0
            return {
                "calories": 200.0 + base,
                "protein": 15.0 + (len(meal_name) % 10),
                "carbs": 30.0 + (len(meal_name) % 20),
                "fat": 10.0 + (len(meal_name) % 5),
                "health_score": 6.5
            }
    
    # Real implementation using Nutritionix API
    url = "https://trackapi.nutritionix.com/v2/natural/nutrients"
    headers = {
        "x-app-id": settings.NUTRITIONIX_APP_ID,
        "x-app-key": settings.NUTRITIONIX_API_KEY,
        "Content-Type": "application/json"
    }
    payload = {"query": meal_name}
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=payload, headers=headers)
            response.raise_for_status()
            data = response.json()
            food = data.get("foods", [])[0]
            
            return {
                "calories": food.get("nf_calories", 0),
                "protein": food.get("nf_protein", 0),
                "carbs": food.get("nf_total_carbohydrate", 0),
                "fat": food.get("nf_total_fat", 0),
                "health_score": 5.0 # Need custom logic for this based on nutrients
            }
        except Exception as e:
            print(f"Error fetching nutrition: {e}")
            return None
