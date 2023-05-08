import { beforeEach, describe, expect, it } from "vitest";
import { CreateGymUseCase } from "./create-gym";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";

let inMemoryGymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe("Create Gym Use Case", () => {
  beforeEach(() => {
    inMemoryGymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(inMemoryGymsRepository);
  });
  it("should be able to create gym", async () => {
    const { gym } = await sut.execute({
      title: "Nodejs Gym",
      description: null,
      phone: null,
      latitude: -19.5277951,
      longitude: -42.6194421,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
