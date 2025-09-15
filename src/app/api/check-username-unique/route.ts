import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { success, z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import { errorResponse, successResponse } from "@/helpers/response";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = { username: searchParams.get("username") };

    // validate with zod
    const result = UsernameQuerySchema.safeParse(queryParams);

    if (!result.success) {
      const usernameErrors = z.treeifyError(result.error).properties?.username?.errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid query parameter",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingVerifiedUser) {
      return errorResponse("Username is already taken", 400);
    }

    return successResponse(null,'Username is unique')

  } catch (error) {
    console.error("Error checking username uniqueness:", error);
    return errorResponse("Internal server error");
  }
}
