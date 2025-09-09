-- Create profiles table for user management
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  location TEXT,
  dietary_preferences TEXT[], -- Array of dietary preferences like 'vegetarian', 'low-carb', etc.
  budget_preference TEXT CHECK (budget_preference IN ('budget', 'moderate', 'premium')),
  family_size INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ingredients table
CREATE TABLE IF NOT EXISTS public.ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT, -- 'protein', 'vegetable', 'grain', 'dairy', etc.
  average_cost_per_unit DECIMAL(10,2),
  unit TEXT, -- 'lb', 'kg', 'piece', etc.
  nutritional_info JSONB, -- Store calories, protein, carbs, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_ingredients table (what ingredients user has)
CREATE TABLE IF NOT EXISTS public.user_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES public.ingredients(id) ON DELETE CASCADE,
  quantity DECIMAL(10,2),
  expiry_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, ingredient_id)
);

-- Create meal_plans table
CREATE TABLE IF NOT EXISTS public.meal_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  week_start_date DATE NOT NULL,
  total_estimated_cost DECIMAL(10,2),
  dietary_preferences TEXT[],
  ai_generated BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meals table (individual meals within a meal plan)
CREATE TABLE IF NOT EXISTS public.meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_plan_id UUID NOT NULL REFERENCES public.meal_plans(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 1 AND 7), -- 1=Monday, 7=Sunday
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  recipe_name TEXT NOT NULL,
  recipe_instructions TEXT,
  estimated_prep_time INTEGER, -- minutes
  estimated_cost DECIMAL(10,2),
  nutritional_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meal_ingredients table (ingredients needed for each meal)
CREATE TABLE IF NOT EXISTS public.meal_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_id UUID NOT NULL REFERENCES public.meals(id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES public.ingredients(id) ON DELETE CASCADE,
  quantity DECIMAL(10,2) NOT NULL,
  unit TEXT NOT NULL,
  is_available BOOLEAN DEFAULT FALSE, -- whether user already has this ingredient
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create shopping_lists table
CREATE TABLE IF NOT EXISTS public.shopping_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  meal_plan_id UUID REFERENCES public.meal_plans(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  total_estimated_cost DECIMAL(10,2),
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create shopping_list_items table
CREATE TABLE IF NOT EXISTS public.shopping_list_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shopping_list_id UUID NOT NULL REFERENCES public.shopping_lists(id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES public.ingredients(id) ON DELETE CASCADE,
  quantity DECIMAL(10,2) NOT NULL,
  unit TEXT NOT NULL,
  estimated_cost DECIMAL(10,2),
  is_purchased BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_list_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Create RLS policies for user_ingredients
CREATE POLICY "user_ingredients_select_own" ON public.user_ingredients FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_ingredients_insert_own" ON public.user_ingredients FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_ingredients_update_own" ON public.user_ingredients FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "user_ingredients_delete_own" ON public.user_ingredients FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for meal_plans
CREATE POLICY "meal_plans_select_own" ON public.meal_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "meal_plans_insert_own" ON public.meal_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "meal_plans_update_own" ON public.meal_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "meal_plans_delete_own" ON public.meal_plans FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for meals (access through meal_plans)
CREATE POLICY "meals_select_own" ON public.meals FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.meal_plans WHERE meal_plans.id = meals.meal_plan_id AND meal_plans.user_id = auth.uid())
);
CREATE POLICY "meals_insert_own" ON public.meals FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.meal_plans WHERE meal_plans.id = meals.meal_plan_id AND meal_plans.user_id = auth.uid())
);
CREATE POLICY "meals_update_own" ON public.meals FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.meal_plans WHERE meal_plans.id = meals.meal_plan_id AND meal_plans.user_id = auth.uid())
);
CREATE POLICY "meals_delete_own" ON public.meals FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.meal_plans WHERE meal_plans.id = meals.meal_plan_id AND meal_plans.user_id = auth.uid())
);

-- Create RLS policies for meal_ingredients (access through meals)
CREATE POLICY "meal_ingredients_select_own" ON public.meal_ingredients FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.meals 
    JOIN public.meal_plans ON meal_plans.id = meals.meal_plan_id 
    WHERE meals.id = meal_ingredients.meal_id AND meal_plans.user_id = auth.uid()
  )
);
CREATE POLICY "meal_ingredients_insert_own" ON public.meal_ingredients FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.meals 
    JOIN public.meal_plans ON meal_plans.id = meals.meal_plan_id 
    WHERE meals.id = meal_ingredients.meal_id AND meal_plans.user_id = auth.uid()
  )
);
CREATE POLICY "meal_ingredients_update_own" ON public.meal_ingredients FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.meals 
    JOIN public.meal_plans ON meal_plans.id = meals.meal_plan_id 
    WHERE meals.id = meal_ingredients.meal_id AND meal_plans.user_id = auth.uid()
  )
);
CREATE POLICY "meal_ingredients_delete_own" ON public.meal_ingredients FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.meals 
    JOIN public.meal_plans ON meal_plans.id = meals.meal_plan_id 
    WHERE meals.id = meal_ingredients.meal_id AND meal_plans.user_id = auth.uid()
  )
);

-- Create RLS policies for shopping_lists
CREATE POLICY "shopping_lists_select_own" ON public.shopping_lists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "shopping_lists_insert_own" ON public.shopping_lists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "shopping_lists_update_own" ON public.shopping_lists FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "shopping_lists_delete_own" ON public.shopping_lists FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for shopping_list_items (access through shopping_lists)
CREATE POLICY "shopping_list_items_select_own" ON public.shopping_list_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.shopping_lists WHERE shopping_lists.id = shopping_list_items.shopping_list_id AND shopping_lists.user_id = auth.uid())
);
CREATE POLICY "shopping_list_items_insert_own" ON public.shopping_list_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.shopping_lists WHERE shopping_lists.id = shopping_list_items.shopping_list_id AND shopping_lists.user_id = auth.uid())
);
CREATE POLICY "shopping_list_items_update_own" ON public.shopping_list_items FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.shopping_lists WHERE shopping_lists.id = shopping_list_items.shopping_list_id AND shopping_lists.user_id = auth.uid())
);
CREATE POLICY "shopping_list_items_delete_own" ON public.shopping_list_items FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.shopping_lists WHERE shopping_lists.id = shopping_list_items.shopping_list_id AND shopping_lists.user_id = auth.uid())
);

-- Allow public read access to ingredients table (no RLS needed for reference data)
-- This allows users to search and select from available ingredients
