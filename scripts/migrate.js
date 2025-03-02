// const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigrations() {
  const migrationsDir = path.join(__dirname, "../src/database/migrations");
  const files = fs.readdirSync(migrationsDir).sort();

  for (const file of files) {
    console.log(`Running migration: ${file}`);
    const migration = fs.readFileSync(path.join(migrationsDir, file), "utf8");

    try {
      // await supabase.from("migrations").insert({
      //   name: file,
      //   executed_at: new Date().toISOString(),
      // });

      const { error } = await supabase.rpc("run_sql", {
        sql: migration,
      });

      if (error) throw error;

      console.log(`Successfully ran migration: ${file}`);
    } catch (error) {
      if (error.code === "23505") {
        // duplicate key error
        console.log(`Migration ${file} already executed`);
        continue;
      }
      console.error(`Error running migration ${file}:`, error);
      process.exit(1);
    }
  }
}

runMigrations().catch(console.error);
