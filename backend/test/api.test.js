import request from "supertest";
import app from "../src/server.js";

describe("API Endpoints", () => {
  describe("Health Check", () => {
    it("should return health status", async () => {
      const res = await request(app).get("/health").expect(200);

      expect(res.body).toHaveProperty("status", "OK");
      expect(res.body).toHaveProperty("timestamp");
      expect(res.body).toHaveProperty("environment");
    });
  });

  describe("Categories", () => {
    it("should get all categories", async () => {
      const res = await request(app).get("/api/categories").expect(200);

      expect(res.body).toHaveProperty("data");
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("Recipes", () => {
    it("should get all recipes", async () => {
      const res = await request(app).get("/api/recipes").expect(200);

      expect(res.body).toHaveProperty("data");
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("should return 404 for non-existent recipe", async () => {
      await request(app).get("/api/recipes/999999").expect(404);
    });
  });

  describe("Users", () => {
    it("should return 404 for non-existent user", async () => {
      await request(app)
        .get("/api/user-lists/email/nonexistent@example.com")
        .expect(404);
    });
  });

  describe("Authentication", () => {
    it("should return 401 for protected routes without token", async () => {
      await request(app).post("/api/recipes").send({}).expect(401);
    });
  });
});
