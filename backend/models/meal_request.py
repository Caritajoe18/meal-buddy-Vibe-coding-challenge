from pydantic import BaseModel
from typing import Optional

class MealRequest(BaseModel):
    ingredients: str
    diet: str
    email: Optional[str] = None
    location: Optional[str] = None
