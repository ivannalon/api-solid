import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Create Gym (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to create a Gym", async () => {
    const {token} = await createAndAuthenticateUser(app, true)

    const response = await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "NodeJs Gym",
        description: "Some description",
        phone: "31999999999",
        latitude: -19.5277951,
        longitude: -42.6194421,
      });

    expect(response.statusCode).toEqual(201);
  });
});
