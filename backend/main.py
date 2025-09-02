
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Body
from models.meal_request import MealRequest
from services.supabase_service import get_user_location, insert_subscription
from services.ai_service import generate_meal_plan

app = FastAPI()

# CORS for frontend - adjust in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Meal Buddy backend is running 🚀"}
    
@app.post("/mealplan")
async def mealplan(req: MealRequest):
    location = getattr(req, 'location', None) or get_user_location(getattr(req, 'email', None))
    if not location:
        raise HTTPException(status_code=400, detail="Location required (or set in Supabase profile)")
    plan = await generate_meal_plan(req.ingredients, req.diet, location)
    return {"plan": plan}

@app.post('/subscribe')
async def subscribe(payload: dict = Body(...)):
    # expected payload: { user_id: str, plan: str, amount: int }
    user_id = payload.get('user_id')
    plan = payload.get('plan')
    amount = payload.get('amount', 0)
    if not user_id or not plan:
        raise HTTPException(status_code=400, detail='user_id and plan are required')
    # insert subscription record
    inserted = insert_subscription(user_id=user_id, plan=plan, amount=amount)
    if not inserted:
        raise HTTPException(status_code=500, detail='Failed to record subscription')
    return {'status': 'ok'}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
