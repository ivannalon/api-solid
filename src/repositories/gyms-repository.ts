import { Gym, Prisma } from "@prisma/client";

export interface FindyManyNearbyParams {
  latitude: number;
  longitude: number
}

export interface GymsRepository {
  searchMany(query: string, page: number): Promise<Gym[]>;
  findyManyNearby(params: FindyManyNearbyParams): Promise<Gym[]>;
  findById(gymId: string): Promise<Gym | null>;
  create(data: Prisma.GymCreateInput): Promise<Gym>;
}
