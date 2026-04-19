import { prisma } from "../lib/prisma";
import { Prisma } from "../generated/prisma";

export const createUser = async (data: Prisma.UserCreateInput) => {
  return prisma.user.create({
    data,
  });
};