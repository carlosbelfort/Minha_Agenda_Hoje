import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { app } from "../src/app";
import { createTestUser } from "./helpers/createTestUser";

describe("Agenda", () => {
  beforeAll(async () => {
    await app.ready();
    await createTestUser();
  });

  afterAll(async () => {
    await app.close();
  });

  it("deve criar uma agenda para usuário autenticado", async () => {
    const login = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: {
        email: "admin@email.com",
        password: "123456",
      },
    });

    expect(login.statusCode).toBe(200);

    const token = login.json().token;

    const response = await app.inject({
      method: "POST",
      url: "/agendas",
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        title: "Agenda Teste",
        date: "2026-01-30",
      },
    });

    expect(response.statusCode).toBe(201);
  });
});
