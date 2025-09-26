import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import { errorResponse, successResponse } from "@/helpers/response";


const UsernameQuerySchema = z.object({
    username: usernameValidation,
})

export async function GET(request: Request) {
    await dbConnect();

    try{
        const {username, code} = await request.json();
        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({username: decodedUsername});
        if(!user){
            return errorResponse('User not found', 404);
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true;
            await user.save();
            return successResponse(null, 'Account verified successfully');
        }else if(!isCodeNotExpired){
            return errorResponse('Verification code has expired, Please sign up again to get a new code', 400);
        }else{
            return errorResponse('Invalid verification code', 400);
        }

    }catch (err) {
        console.error('Error verifying code:', err);
        return errorResponse('Internal server error');
    }
}