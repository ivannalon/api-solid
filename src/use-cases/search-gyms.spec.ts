import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { SearchGymsUseCase } from "./search-gyms";

let inMemoryGymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe("Fetch User Check-in History Use Case", () => {
  beforeEach(async () => {
    inMemoryGymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(inMemoryGymsRepository);
  });

  it("should be able to search for gyms", async () => {
    await inMemoryGymsRepository.create({
      title: "Nodejs Gym",
      description: null,
      phone: null,
      latitude: -19.5277951,
      longitude: -42.6194421,
    });

    await inMemoryGymsRepository.create({
      title: "Nodejs Academy",
      description: null,
      phone: null,
      latitude: -19.5277951,
      longitude: -42.6194421,
    });

    const { gyms } = await sut.execute({ query: "Node", page: 1 });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "Nodejs Gym" }),
      expect.objectContaining({ title: "Nodejs Academy" }),
    ]);
  });

  it("should be able to search paginated gyms", async () => {
    for (let index = 1; index <= 22; index++) {
      await inMemoryGymsRepository.create({
        title: `Nodejs Gym ${index}`,
        description: null,
        phone: null,
        latitude: -19.5277951,
        longitude: -42.6194421,
      });
    }

    const { gyms } = await sut.execute({
      query: "Node",
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "Nodejs Gym 21" }),
      expect.objectContaining({ title: "Nodejs Gym 22" }),
    ]);
  });
});
