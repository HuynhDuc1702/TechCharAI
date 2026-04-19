import validiator from "validator"

export const isEmail=(email: string)=>{
    return validiator.isEmail(email)
}
export const isStrongPassword=(password:string)=>{
    return validiator.isStrongPassword(password,{
         minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols:1
    })
}
