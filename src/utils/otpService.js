import { PrismaClient } from "@prisma/client"; // Import Prisma Client
import { otpGenerator } from "./otpGenerator.js"; // Assuming you have an OTP generator function

const prisma = new PrismaClient(); // Instantiate Prisma Client

export const otpService = async (email) => {
  const otp = otpGenerator(); // Generate the OTP
  const existingOtp = await prisma.otp.findUnique({ where: { email } });

  if (existingOtp) {
    // If OTP exists, update it
    const updatedOtp = await prisma.otp.update({
      where: { email },
      data: {
        otp,
        createdAt: new Date(),
      },
    });
    return updatedOtp.otp; // Return the updated OTP
  } else {
    // If no OTP exists for the email, create a new one
    const newOtp = await prisma.otp.create({
      data: {
        otp,
        email,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 60000), // OTP expiration time (1 minute)
      },
    });
    return newOtp.otp; // Return the new OTP
  }
};
