import httpx
from ..core.config import settings
import json

async def get_ai_recommendation(prompt: str, user_budget: float, user_preference: str, user_goal: str) -> str:
    if settings.GEMINI_API_KEY == "mock_gemini_key":
        prompt_lower = prompt.lower()
        is_veg = user_preference.lower() == "vegetarian"
        
        if "plan my day" in prompt_lower:
            return json.dumps([
                {
                    "meal_name": "Oatmeal with Berries" if is_veg else "Scrambled Eggs with Toast",
                    "calories": 350, "protein": 18, "carbs": 45, "fat": 12,
                    "reason": "High energy start to your day."
                },
                {
                    "meal_name": "Tofu Quinoa Bowl" if is_veg else "Grilled Chicken Salad",
                    "calories": 420, "protein": 30, "carbs": 30, "fat": 15,
                    "reason": "Light, protein-packed lunch."
                },
                {
                    "meal_name": "Paneer Stir Fry" if is_veg else "Baked Salmon with Asparagus",
                    "calories": 550, "protein": 40, "carbs": 25, "fat": 20,
                    "reason": "Satisfying dinner to hit your macros."
                }
            ])
            
        if "breakfast" in prompt_lower:
            if "fiber" in prompt_lower:
                meal_name = "Oatmeal with Berries"
            else:
                meal_name = "Avocado Toast" if is_veg else "Scrambled Eggs with Toast"
            return json.dumps({
                "meal_name": meal_name,
                "calories": 350,
                "protein": 18,
                "carbs": 45,
                "fat": 12,
                "reason": f"A perfect breakfast choice that matches your '{prompt}' request within budget."
            })
        else:
            if "protein" in prompt_lower:
                meal_name = "Tofu Quinoa Salad" if is_veg else "Grilled Chicken Salad"
            else:
                meal_name = "Paneer Rice Bowl"
                
            return json.dumps({
                "meal_name": meal_name,
                "calories": 420,
                "protein": 30,
                "carbs": 30,
                "fat": 15,
                "reason": f"Fits your budget and preference for '{prompt}' as a {user_preference}."
            })
    
    # Real implementation using Gemini API
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key={settings.GEMINI_API_KEY}"
    
    system_prompt = f"""
    You are an expert AI Food & Nutrition Assistant. 
    User Budget: {user_budget}
    Preference: {user_preference}
    Goal: {user_goal}
    User Request: {prompt}
    
    CRITICAL INSTRUCTIONS:
    1. If the User Request is exactly "Plan My Day", generate a JSON array of exactly 3 meals (Breakfast, Lunch, Dinner). The total cost should be under the user's budget.
    2. Otherwise, suggest a single meal and return a single JSON object.
    3. Ensure the macros (calories, protein, carbs, fat) are realistic and fit the requested nutrients or goal.
    
    If returning one meal, use this format EXACTLY:
    {{ "meal_name": "...", "calories": 100, "protein": 10, "carbs": 10, "fat": 10, "reason": "..." }}
    
    If returning 3 meals, use this format EXACTLY:
    [
      {{ "meal_name": "...", "calories": 100, "protein": 10, "carbs": 10, "fat": 10, "reason": "Breakfast" }},
      {{ "meal_name": "...", "calories": 100, "protein": 10, "carbs": 10, "fat": 10, "reason": "Lunch" }},
      {{ "meal_name": "...", "calories": 100, "protein": 10, "carbs": 10, "fat": 10, "reason": "Dinner" }}
    ]
    """
    
    payload = {
        "contents": [{
            "parts": [{"text": system_prompt}]
        }]
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=payload)
            response.raise_for_status()
            data = response.json()
            text = data["candidates"][0]["content"]["parts"][0]["text"]
            
            # Extract JSON from markdown if needed
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
                
            return text
        except Exception as e:
            print(f"Error fetching AI recommendation: {e}")
            return '{"error": "Failed to get recommendation"}'
