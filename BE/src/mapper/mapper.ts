import { RegisterDTO } from "../Dtos/registerDTO";
import { Prisma } from "../generated/prisma";

export const mapRegisterDTOToUser = (
  dto: RegisterDTO,
  hashedPassword: string
): Prisma.UserCreateInput => {
  return {
    email: dto.email,
    password: hashedPassword,
    name: dto.name ?? null,
  };
};