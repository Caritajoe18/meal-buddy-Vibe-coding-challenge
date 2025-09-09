-- Seed common ingredients
INSERT INTO public.ingredients (name, category, average_cost_per_unit, unit, nutritional_info) VALUES
-- Proteins
('Chicken Breast', 'protein', 6.99, 'lb', '{"calories": 165, "protein": 31, "carbs": 0, "fat": 3.6}'),
('Ground Beef', 'protein', 5.99, 'lb', '{"calories": 250, "protein": 26, "carbs": 0, "fat": 15}'),
('Salmon Fillet', 'protein', 12.99, 'lb', '{"calories": 208, "protein": 22, "carbs": 0, "fat": 12}'),
('Eggs', 'protein', 3.49, 'dozen', '{"calories": 70, "protein": 6, "carbs": 1, "fat": 5}'),
('Black Beans', 'protein', 1.29, 'can', '{"calories": 227, "protein": 15, "carbs": 41, "fat": 1}'),
('Tofu', 'protein', 2.99, 'block', '{"calories": 94, "protein": 10, "carbs": 3, "fat": 6}'),

-- Vegetables
('Broccoli', 'vegetable', 2.49, 'lb', '{"calories": 34, "protein": 3, "carbs": 7, "fat": 0.4}'),
('Spinach', 'vegetable', 2.99, 'bag', '{"calories": 23, "protein": 3, "carbs": 4, "fat": 0.4}'),
('Bell Peppers', 'vegetable', 1.99, 'lb', '{"calories": 31, "protein": 1, "carbs": 7, "fat": 0.3}'),
('Onions', 'vegetable', 1.49, 'lb', '{"calories": 40, "protein": 1, "carbs": 9, "fat": 0.1}'),
('Tomatoes', 'vegetable', 2.99, 'lb', '{"calories": 18, "protein": 1, "carbs": 4, "fat": 0.2}'),
('Carrots', 'vegetable', 1.99, 'lb', '{"calories": 41, "protein": 1, "carbs": 10, "fat": 0.2}'),
('Sweet Potatoes', 'vegetable', 1.79, 'lb', '{"calories": 86, "protein": 2, "carbs": 20, "fat": 0.1}'),

-- Grains
('Brown Rice', 'grain', 2.99, 'lb', '{"calories": 216, "protein": 5, "carbs": 45, "fat": 1.8}'),
('Quinoa', 'grain', 4.99, 'lb', '{"calories": 222, "protein": 8, "carbs": 39, "fat": 3.6}'),
('Whole Wheat Pasta', 'grain', 1.99, 'lb', '{"calories": 174, "protein": 7, "carbs": 37, "fat": 1.1}'),
('Oats', 'grain', 3.49, 'lb', '{"calories": 389, "protein": 17, "carbs": 66, "fat": 7}'),

-- Dairy
('Greek Yogurt', 'dairy', 5.99, 'container', '{"calories": 100, "protein": 17, "carbs": 6, "fat": 0}'),
('Milk', 'dairy', 3.99, 'gallon', '{"calories": 42, "protein": 3.4, "carbs": 5, "fat": 1}'),
('Cheese', 'dairy', 4.99, 'block', '{"calories": 113, "protein": 7, "carbs": 1, "fat": 9}'),

-- Pantry Staples
('Olive Oil', 'fat', 7.99, 'bottle', '{"calories": 884, "protein": 0, "carbs": 0, "fat": 100}'),
('Garlic', 'seasoning', 0.99, 'bulb', '{"calories": 42, "protein": 2, "carbs": 9, "fat": 0.1}'),
('Ginger', 'seasoning', 2.99, 'lb', '{"calories": 80, "protein": 2, "carbs": 18, "fat": 0.8}'),
('Lemon', 'fruit', 0.79, 'each', '{"calories": 17, "protein": 0.6, "carbs": 5, "fat": 0.2}'),
('Avocado', 'fruit', 1.49, 'each', '{"calories": 234, "protein": 3, "carbs": 12, "fat": 21}')

ON CONFLICT (name) DO NOTHING;
