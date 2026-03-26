import pool from "../config/database.js";

const categories = [
  {
    name: "Breakfast",
    image:
      "https://res.cloudinary.com/dxbuth8qr/image/upload/v1744641138/breakfast_6161644c49.png",
  },
  {
    name: "Lunch",
    image:
      "https://res.cloudinary.com/dxbuth8qr/image/upload/v1744641138/fried_rice_61132fe65e.png",
  },
  {
    name: "Dinner",
    image:
      "https://res.cloudinary.com/dxbuth8qr/image/upload/v1754226535/rice_irwzpg.png",
  },
  {
    name: "Dessert",
    image:
      "https://res.cloudinary.com/dxbuth8qr/image/upload/v1744641142/panna_cotta_79704f01df.png",
  },
  {
    name: "Cake",
    image:
      "https://res.cloudinary.com/dxbuth8qr/image/upload/v1744641138/cake_74e3bb2363.png",
  },
  {
    name: "Salad",
    image:
      "https://res.cloudinary.com/dxbuth8qr/image/upload/v1744641142/salad_4c41943784.png",
  },
  {
    name: "Fast-Food",
    image:
      "https://res.cloudinary.com/dxbuth8qr/image/upload/v1744641138/fast_food_06e83e4f55.png",
  },
  {
    name: "Drink",
    image:
      "https://res.cloudinary.com/dxbuth8qr/image/upload/v1744641138/cocktail_2dcae8916d.png",
  },
];

const seedCategories = async () => {
  try {
    console.log("🌱 Starting category seeding...");

    // Clear existing categories (optional - comment out if you want to keep existing)
    await pool.query("DELETE FROM categories");
    console.log("🗑️  Cleared existing categories");

    // Insert new categories
    for (const category of categories) {
      const result = await pool.query(
        "INSERT INTO categories (name, image) VALUES ($1, $2) RETURNING *",
        [category.name, category.image]
      );
      console.log(`✅ Added category: ${category.name}`);
    }

    // Verify seeding
    const countResult = await pool.query("SELECT COUNT(*) FROM categories");
    const count = parseInt(countResult.rows[0].count);

    console.log(`🎉 Category seeding completed! Total categories: ${count}`);

    // Show all seeded categories
    const allCategories = await pool.query(
      "SELECT * FROM categories ORDER BY name"
    );
    console.log("\n📋 Seeded Categories:");
    allCategories.rows.forEach((cat) => {
      console.log(`  - ${cat.name}`);
    });
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
    throw error;
  } finally {
    await pool.end();
  }
};

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedCategories()
    .then(() => {
      console.log("✅ Category seeding completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Category seeding failed:", error);
      process.exit(1);
    });
}

export default seedCategories;
