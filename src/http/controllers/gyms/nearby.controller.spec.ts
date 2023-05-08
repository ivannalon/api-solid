import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Nearby Gyms (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to search nearby Gyms", async () => {
    const { token } = await createAndAuthenticateUser(app);

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "NodeJs Gym",
        description: "Some description",
        phone: "31999999999",
        latitude: -19.5277951,
        longitude: -42.6194421,
      });

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "TS Gym",
        description: "Some description",
        phone: "31999999999",
        latitude: -19.4696288,
        longitude: -42.4533595,
      });

    const response = await request(app.server)
      .get("/gyms/nearby")
      .query({ latitude: -19.5277951, longitude: -42.6194421 })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: "NodeJs Gym",
      }),
    ]);
  });
});
