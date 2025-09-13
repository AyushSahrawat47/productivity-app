import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import bcrypt from "bcryptjs";
import { successResponse, errorResponse } from "@/helpers/response";

export async function POST(request: Request) {
    await dbConnect();
    try{
        const {username, email, password} = await request.json();

        const existingUserVerifiedByUsername = await UserModel.findOne({username, isVerified: true});

        if(existingUserVerifiedByUsername){
            return errorResponse('Username already taken', 400);
        }
        const existingUserVerifiedByEmail = await UserModel.findOne({email});
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        if(existingUserVerifiedByEmail){
            if(existingUserVerifiedByEmail.isVerified){
                return errorResponse('Email already registered', 400);
            }else{
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserVerifiedByEmail.password = hashedPassword;
                existingUserVerifiedByEmail.verifyCode = verifyCode;
                existingUserVerifiedByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserVerifiedByEmail.save();  
            }
        }else{
            const hashedPassword = await bcrypt.hash(password, 10);
            const exipryDate = new Date();
            exipryDate.setHours(exipryDate.getHours()+1);
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: exipryDate, 
            })

            await newUser.save();
        }

        // Send Verification Email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);
        if(!emailResponse.success){
            return errorResponse(emailResponse.message);
        }

        return successResponse(null,'User registered successfully. Please check your email for the verification code.', 201);

    }catch(err){
        console.error("Error registering user:", err)
        return errorResponse('Error Registering User', 500)
        
    }
}