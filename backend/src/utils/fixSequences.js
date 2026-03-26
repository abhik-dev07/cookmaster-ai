import pool from "../config/database.js";

const fixSequences = async () => {
  try {
    console.log("🔧 Fixing PostgreSQL sequences...");

    // Get all tables with serial columns
    const tables = ["users", "categories", "recipes", "user_favorites"];

    for (const table of tables) {
      console.log(`\n📋 Checking table: ${table}`);

      // Get the current maximum ID
      const maxIdResult = await pool.query(
        `SELECT MAX(id) as max_id FROM ${table}`
      );
      const maxId = maxIdResult.rows[0].max_id || 0;

      console.log(`  Current max ID: ${maxId}`);

      if (maxId > 0) {
        // Fix the sequence to start from the next value after the max ID
        const sequenceName = `${table}_id_seq`;
        const nextValue = maxId + 1;

        await pool.query(
          `SELECT setval('${sequenceName}', ${nextValue}, false)`
        );
        console.log(
          `  ✅ Fixed sequence ${sequenceName} to start from ${nextValue}`
        );
      } else {
        console.log(
          `  ℹ️  No data in table ${table}, sequence is already at 1`
        );
      }
    }

    // Verify the fixes
    console.log("\n🔍 Verifying sequence fixes...");
    for (const table of tables) {
      const sequenceName = `${table}_id_seq`;
      const currentValueResult = await pool.query(
        `SELECT last_value FROM ${sequenceName}`
      );
      const currentValue = currentValueResult.rows[0].last_value;

      const maxIdResult = await pool.query(
        `SELECT MAX(id) as max_id FROM ${table}`
      );
      const maxId = maxIdResult.rows[0].max_id || 0;

      console.log(
        `  ${table}: sequence at ${currentValue}, max ID is ${maxId}`
      );

      if (currentValue <= maxId) {
        console.log(
          `  ⚠️  Warning: ${table} sequence might still be out of sync`
        );
      } else {
        console.log(`  ✅ ${table} sequence is properly synchronized`);
      }
    }

    console.log("\n🎉 Sequence fixing completed!");
  } catch (error) {
    console.error("❌ Error fixing sequences:", error);
    throw error;
  } finally {
    await pool.end();
  }
};

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  fixSequences()
    .then(() => {
      console.log("✅ Sequence fixing completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Sequence fixing failed:", error);
      process.exit(1);
    });
}

export default fixSequences;
