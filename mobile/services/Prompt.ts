export default {
  GENERATE_RECIPE_OPTION_PROMPT: `Based on the user's request above, create 3 different recipe variants. Each recipe should include:

1. A creative recipe name with an appropriate emoji at the end of the recipe name
2. A 2-line description explaining the dish
3. A list of main ingredients (without quantities)

Please respond in the following JSON format:
\`\`\`json
[
  {
    "recipeName": "Recipe Name with Emoji at the end of the Recipe name",
    "description": "Brief description of the recipe in 2 lines",
    "ingredients": ["ingredient1", "ingredient2", "ingredient3"]
  },
  {
    "recipeName": "Recipe Name with Emoji at the end of the Recipe name", 
    "description": "Brief description of the recipe in 2 lines",
    "ingredients": ["ingredient1", "ingredient2", "ingredient3"]
  },
  {
    "recipeName": "Recipe Name with Emoji at the end of the Recipe name",
    "description": "Brief description of the recipe in 2 lines", 
    "ingredients": ["ingredient1", "ingredient2", "ingredient3"]
  }
]
\`\`\`

Make sure to create diverse and interesting recipe options that match the user's request.`,

  GENERATE_COMPLETE_RECIPE_PROMPT: `Based on the recipe name and description provided, create a complete recipe with the following details:

- Complete list of ingredients with quantities and emoji icons
- Detailed step-by-step cooking instructions
- Total calories (number only)
- Cooking time in minutes
- Number of servings
- Realistic image prompt for the recipe
- Recipe category from: [Breakfast, Lunch, Dinner, Salad, Dessert, Fastfood, Drink, Cake]

Please respond in the following JSON format:
\`\`\`json
{
  "recipeName": "Recipe Name",
  "description": "Recipe description",
  "ingredients": [
    {
      "ingredient": "ingredient name",
      "quantity": "amount needed",
      "icon": "🍅"
    }
  ],
  "steps": [
    "Step 1: Detailed instruction",
    "Step 2: Detailed instruction"
  ],
  "calories": 350,
  "cookTime": 30,
  "serveTo": 4,
  "imagePrompt": "Realistic image description for the recipe",
  "category": "Dinner"
}
\`\`\``,
};
