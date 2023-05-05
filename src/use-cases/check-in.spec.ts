import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInUseCase } from "./check-in";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxDistanceError } from "./errors/max-distance-error";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";

let inMemoryCheckInsRepository: InMemoryCheckInsRepository;
let inMemoryGymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("Check-in Use Case", () => {
  beforeEach(async () => {
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository();
    inMemoryGymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(
      inMemoryCheckInsRepository,
      inMemoryGymsRepository
    );

    await inMemoryGymsRepository.create({
      id: 'gym-01',
      title: "Nodejs Gym",
      description: null,
      phone: null,
      latitude: -19.5277951,
      longitude: -42.6194421,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check-in", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user01",
      userLatitude: -19.5277951,
      userLongitude: -42.6194421,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check-in twice in the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -19.5277951,
      userLongitude: -42.6194421,
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-01",
        userId: "user-01",
        userLatitude: -19.5277951,
        userLongitude: -42.6194421,
      })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it("should be able to check-in but in different days", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -19.5277951,
      userLongitude: -42.6194421,
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -19.5277951,
      userLongitude: -42.6194421,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check-in on distant gym", async () => {
    await inMemoryGymsRepository.create({
      id: 'gym-02',
      title: "Nodejs Gym",
      description: null,
      phone: null,
      latitude: 0,
      longitude: 0,
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-02",
        userId: "user01",
        userLatitude: -19.5277951,
        userLongitude: -42.6194421,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
