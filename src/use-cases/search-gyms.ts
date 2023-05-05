import { GymsRepository } from "@/repositories/gyms-repository";
import type { Gym } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found";

interface SearchGymUseCaseRequest {
  query: string;
  page: number;
}

interface SearchGymUseCaseResponse {
  gyms: Gym[];
}

export class SearchGymUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({query, page
  }: SearchGymUseCaseRequest): Promise<SearchGymUseCaseResponse> {
    const gyms  = await this.gymsRepository.searchMany(query, page)

    if(!gyms) {
        throw new ResourceNotFoundError()
    }

    return {
      gyms,
    };
  }
}
