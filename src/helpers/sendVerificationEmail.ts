import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "../types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Productivity App - Verify Your Email",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    if(error){
        console.error("Resend error:", error);
        return { success: false, message: "Failed to send verification email" };
    } else {
        return { success: true, message: "Verification email sent successfully" };
    }
  } catch (err) {
    console.error("Error sending verification email:", err);
    return { success: false, message: "Failed to send verification email" };
  }
}
