import { Request, response, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import * as charService from "../services/characterService";

export const getAllCharacters = async (req: Request, res: Response) => {
    try {
        const characters = await charService.getAllCharacters();
        if (!characters) {
            return res.status(404).json({ message: "No characters found" });
        }
        return res.status(200).json(characters);
    } catch (error) {
        console.error("Error when get all characters", error);
        return res.status(500).json({ message: "System Error" });
    }
};

export const getMyCharacters = async (req: Request, res: Response) => {
    const payload = req.user as JwtPayload;
    const creatorId = payload?.id as string;
    if (!creatorId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const characters = await charService.getCharactersByUser(creatorId);
        return res.status(200).json(characters);
    } catch (error) {
        console.error("Error when get user characters", error);
        return res.status(500).json({ message: "System Error" });
    }
};

export const getCharacter = async (req: Request, res = response) => {
    const id = req.params.id as string;
    try {
        const character = await charService.getCharacter(id);
        if (!character) {
            return res.status(404).json({ message: `can not find character with id= ${id}`, id });
        }
        return res.status(200).json(character);
    } catch (error) {
        console.error("Error when get a character", error);
        return res.status(500).json({ message: "System Error" });
    }
};

export const addCharacter = async (req: Request, res = response) => {
    const payload = req.user as JwtPayload;
    const creatorId = payload?.id as string;
    if (!creatorId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const createdCharacter = await charService.createCharacter({ ...req.body, creatorId });
        return res.status(200).json(createdCharacter);
    } catch (error) {
        console.error("Error when add a character", error);
        return res.status(500).json({ message: "System Error" });
    }
};

export const updateCharacter = async (req: Request, res = response) => {
    const id = req.params.id as string;

    const payload = req.user as JwtPayload;
    const creatorId = payload?.id as string;


    try {
        const character = await charService.getCharacter(id);

        if (!character) {
            return res.status(404).json({ message: `can not find character with id= ${id}`, id });
        }
        if (character?.creatorId !== creatorId) {
            return res.status(403).json({ message: "Forbidden, you can't update this character" });
        }
        await charService.updateCharacter(id, req.body);

        return res.status(200).json("Character updated successfully");
    } catch (error) {
        console.error("Error update character", error);
        return res.status(500).json({ message: "System Error" });
    }
};

export const deleteCharacter = async (req: Request, res = response) => {
    const id = req.params.id as string;
    const payload = req.user as JwtPayload;
    const creatorId = payload?.id as string;
    try {
        const character = await charService.getCharacter(id);

        if (!character) {
            return res.status(404).json({ message: `can not find character with id= ${id}`, id });
        }
        if (character?.creatorId !== creatorId) {
            return res.status(403).json({ message: "Forbidden, you can't delete this character" });
        }
        await charService.deleteCharacter(id);
        return res.status(200).json("Character deleted successfully");
    } catch (error) {
        console.error("Error when delete character", error);
        return res.status(500).json({ message: "System Error" });
    }
};
