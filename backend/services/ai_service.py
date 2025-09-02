from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()  # <-- loads .env automatically

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


async def generate_meal_plan(ingredients: str, diet: str, location: str) -> str:
    prompt = f"""
    You are a nutrition expert helping families and individuals eat better while reducing food waste.
     
    The user is located in {location} and has these ingredients: {ingredients}.
    Generate a 7-day meal plan (Breakfast, Lunch, Dinner for each day).
    
    Requirements:
    - Respect this diet type: {diet}
      (options: balanced, low-carb, budget, vegetarian, vegan, high-protein, family-kids, weight-loss, diabetic-friendly, gluten-free).
    - Use the provided ingredients as much as possible to reduce waste.
    - Use local, easy-to-find ingredients and suggest affordable missing ones
      when needed.
    - Avoid repeating the same meal within 7 days.
    - Keep meals culturally neutral and simple to cook.
    - Present results clearly, day by day.
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful nutrition assistant."},
            {"role": "user", "content": prompt},
        ],
    )

    return response.choices[0].message.content
