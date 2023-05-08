import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms";

let inMemoryGymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe("Fetch Nearby Gyms Use Case", () => {
  beforeEach(async () => {
    inMemoryGymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(inMemoryGymsRepository);
  });

  it("should be able to fetch nearby gyms", async () => {
    await inMemoryGymsRepository.create({
      title: "Near Gym",
      description: null,
      phone: null,
      latitude: -19.5277951,
      longitude: -42.6194421,
    });

    await inMemoryGymsRepository.create({
      title: "Far Gym",
      description: null,
      phone: null,
      latitude: -19.4696288,
      longitude: -42.4533595,
    });

    const { gyms } = await sut.execute({
      userLatitude: -19.5277951,
      userLongitude: -42.6194421,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "Near Gym" })]);
  });
});
