import {z} from 'zod'

export const usernameValidation = z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(33, "Username must be at most 33 characters long")
    .regex(/[a-zA-Z][a-zA-Z0-9-_]{3,32}/gi, "Username must start with a letter and can contain letters, numbers, hyphens, and underscores");

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.email({message:"Invalid email address"}),
    password:z.string().min(6,{message:"Password must be at least 6 characters long"}),
}) 