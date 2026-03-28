import { ConvexHttpClient } from "convex/browser";
import fs from "node:fs/promises";
import path from "node:path";
import { api } from "../convex/_generated/api.js";

function stripSurroundingQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function parseEnvFile(content) {
  const parsed = {};

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const equalsIndex = line.indexOf("=");
    if (equalsIndex === -1) {
      continue;
    }

    const key = line.slice(0, equalsIndex).trim();
    const value = line.slice(equalsIndex + 1).trim();
    if (!key) {
      continue;
    }

    parsed[key] = stripSurroundingQuotes(value);
  }

  return parsed;
}

async function loadLocalEnvFiles() {
  const envCandidates = [".env.local", ".env"];

  for (const candidate of envCandidates) {
    const envPath = path.resolve(process.cwd(), candidate);

    try {
      const content = await fs.readFile(envPath, "utf8");
      const parsed = parseEnvFile(content);

      for (const [key, value] of Object.entries(parsed)) {
        if (typeof process.env[key] === "undefined") {
          process.env[key] = value;
        }
      }
    } catch (error) {
      if (error && typeof error === "object" && "code" in error) {
        if (error.code === "ENOENT") {
          continue;
        }
      }
      throw error;
    }
  }
}

async function main() {
  await loadLocalEnvFiles();

  const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;
  const seedSecret = process.env.CONVEX_SEED_SECRET;

  if (!convexUrl) {
    throw new Error("Missing EXPO_PUBLIC_CONVEX_URL in environment");
  }

  const filePathArg = process.argv[2] ?? "scripts/categories.seed.json";
  const filePath = path.resolve(process.cwd(), filePathArg);
  const fileContents = await fs.readFile(filePath, "utf8");

  const categories = JSON.parse(fileContents);
  if (!Array.isArray(categories)) {
    throw new Error("Seed file must be a JSON array of categories");
  }

  if (seedSecret) {
    const response = await fetch(`${convexUrl}/seed/categories`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-seed-secret": seedSecret,
      },
      body: JSON.stringify({ categories }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log("Category seed complete (HTTP endpoint):", result);
    return;
  }

  const client = new ConvexHttpClient(convexUrl);
  const result = await client.mutation(api.categories.seedCategories, {
    categories,
  });

  console.log(
    "Category seed complete (direct Convex mutation, no CONVEX_SEED_SECRET set):",
    result,
  );
}

main().catch((error) => {
  console.error("Category seed failed:", error);
  process.exit(1);
});
