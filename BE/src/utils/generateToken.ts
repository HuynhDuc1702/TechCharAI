import { JwtPayload } from "../types/jwt"

const jwt = require('jsonwebtoken')

export const generateToken = (payload: JwtPayload) => {
    return jwt.sign(payload, process.env.JWT_SECRET,{expiresIn: '30m'})
}

export const generateTokenRefresh = (payload: JwtPayload) => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '7d'})
}
