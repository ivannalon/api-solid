import { beforeEach, describe, expect, it } from "vitest";
import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { AuthenticateUseCase } from "./authenticate";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe("Authenticate Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(inMemoryUsersRepository);
  });

  it("should be able to authenticate", async () => {
    await inMemoryUsersRepository.create({
      name: "Ivan Nalon",
      email: "ivannalon@gmail.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({
      email: "ivannalon@gmail.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to authenticate with wrong email", async () => {
    expect(() =>
      sut.execute({
        email: "ivannalon@gmail.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able to authenticate with wrong password", async () => {
    await inMemoryUsersRepository.create({
      name: "Ivan Nalon",
      email: "ivannalon@gmail.com",
      password_hash: await hash("123456", 6),
    });

    expect(() =>
      sut.execute({
        email: "ivannalon@gmail.com",
        password: "1234567",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
