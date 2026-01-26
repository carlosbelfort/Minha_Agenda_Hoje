import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { app } from "../src/app";
import { createTestUser } from "./helpers/createTestUser";

describe("Autenticação", () => {
  beforeAll(async () => {
    await app.ready();
    await createTestUser();
  });

  afterAll(async () => {
    await app.close();
  });

  it("deve autenticar o usuário com credenciais válidas", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: {
        email: "admin@email.com",
        password: "123456",
      },
    });

    expect(response.statusCode).toBe(200);

    const body = response.json();
    expect(body).toHaveProperty("token");
  });
});
