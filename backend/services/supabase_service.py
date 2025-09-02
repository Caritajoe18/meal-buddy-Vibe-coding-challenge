
from supabase import create_client, Client
import os
from dotenv import load_dotenv
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")  # service role key for server-side actions
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_user_location(email: str):
    if not email:
        return None
    res = supabase.table("profiles").select("location").eq("email", email).execute()
    if res.data:
        return res.data[0].get("location")
    return None

def insert_subscription(user_id: str, plan: str, amount: int = 0):
    try:
        res = supabase.table('subscriptions').insert({"user_id": user_id, "plan": plan, "amount": amount, "status": "active"}).execute()
        return res
    except Exception as e:
        print('insert_subscription error', e)
        return None
