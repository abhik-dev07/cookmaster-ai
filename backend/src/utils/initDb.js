import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pool from "../config/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const initDatabase = async () => {
  try {
    console.log("Initializing database...");

    // Read the SQL schema file
    const schemaPath = path.join(__dirname, "../config/database.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");

    // Execute the schema
    await pool.query(schema);

    console.log("Database initialized successfully!");

    // Test the connection
    const result = await pool.query("SELECT NOW() as current_time");
    console.log("Database connection test:", result.rows[0]);

    // Fix sequences to prevent ID conflicts
    console.log("\n🔧 Fixing sequences...");
    const tables = ["users", "categories", "recipes", "user_favorites"];

    for (const table of tables) {
      const maxIdResult = await pool.query(
        `SELECT MAX(id) as max_id FROM ${table}`
      );
      const maxId = maxIdResult.rows[0].max_id || 0;

      if (maxId > 0) {
        const sequenceName = `${table}_id_seq`;
        const nextValue = maxId + 1;
        await pool.query(
          `SELECT setval('${sequenceName}', ${nextValue}, false)`
        );
        console.log(`✅ Fixed ${sequenceName} to start from ${nextValue}`);
      }
    }
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw error;
  } finally {
    await pool.end();
  }
};

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initDatabase()
    .then(() => {
      console.log("Database setup completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Database setup failed:", error);
      process.exit(1);
    });
}

export default initDatabase;
