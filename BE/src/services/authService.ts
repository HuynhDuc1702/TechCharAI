

import AppError from "../utils/appError";
import { isEmail, isStrongPassword } from '../utils/validateUser';
import * as userRepo from "../repositories/userRepo"
import bcrypt from "bcrypt";
import * as mapper from "../mapper/mapper"
import { prisma } from "../lib/prisma";

import { RegisterDTO } from "../Dtos/registerDTO";
import { LoginDTO } from "../Dtos/loginDTO";
import { error } from "node:console";
import { generateToken, generateTokenRefresh } from "../utils/generateToken";


export const loginService = async (data: LoginDTO) => {
    try {
        const { email, password } = data;

        if (!email || !password) {
            throw new AppError("Invalid input", 400);
        }
        if (!isEmail(email)) {
            throw new AppError("Invalid email", 400);
        }
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            console.error(`User with email ${email} not found`, email)
            throw error;
        }
        if (!user.password) {
            throw new AppError("Invalid account", 400);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new AppError("Wrong Password", 400);
        }

        const payload = {
            id: user.id,
            email: user.email

        }

        const accessToken = generateToken(payload);
        const refreshToken = generateTokenRefresh(payload);
        return ({
            message: "Login successced",
            accessToken,
            refreshToken
        })
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log(error);
        }

        if (error instanceof AppError) throw error;

        throw new AppError("Login Failed", 500);
    }

}
export const registerService = async (data: RegisterDTO) => {
    try {

        const { password, email } = data;

        if (!email || !password) {
            throw new AppError("Invalid input", 400);
        }
        if (!isEmail(email)) {
            throw new AppError("Invalid email", 400);
        }
        if (!isStrongPassword(password)) {
            throw new AppError("Password must contain symbols, number, uppercase, lowercase, min length is 6", 400)
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            throw new AppError("User already exist", 400);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        data.password = hashedPassword;
        //Map dto to model
        const userInput = mapper.mapRegisterDTOToUser(data, hashedPassword);


        const newUser = await userRepo.createUser({
            emailVerified: new Date(),
            ...userInput,
        });
        return {
            message: "Registeration sucessfully"
        };

    } catch (error) {
        console.error("Create user failed:", error);
        throw error;
    }
}
