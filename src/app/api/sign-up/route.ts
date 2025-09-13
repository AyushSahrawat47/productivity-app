import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    await dbConnect();
    try{}catch(err){
        console.error("Error registering user:", err)
        
    }
}