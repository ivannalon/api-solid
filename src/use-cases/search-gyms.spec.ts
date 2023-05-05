import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { SearchGymUseCase } from "./search-gyms";

let inMemoryGymsRepository: InMemoryGymsRepository;
let sut: SearchGymUseCase;

describe("Fetch User Check-in History Use Case", () => {
  beforeEach(async () => {
    inMemoryGymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymUseCase(inMemoryGymsRepository);
  });

  it("should be able to search for gyms", async () => {
    await inMemoryGymsRepository.create({
        id: "gym-01",
        title: "Nodejs Gym",
        description: null,
        phone: null,
        latitude: -19.5277951,
        longitude: -42.6194421,
      });
    
      await inMemoryGymsRepository.create({
        id: "gym-02",
        title: "Nodejs Academy",
        description: null,
        phone: null,
        latitude: -19.5277951,
        longitude: -42.6194421,
      });

    const {gyms} = await sut.execute({query: 'Node', page: 1})

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ id: "gym-01" }),
      expect.objectContaining({ id: "gym-02" }),
    ]);
  });

  it("should be able to search paginated gyms", async () => {
    for (let index = 1; index <= 22; index++) {
        await inMemoryGymsRepository.create({
            id: `gym-${index}`,
            title: "Nodejs Gym",
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
  });
});
