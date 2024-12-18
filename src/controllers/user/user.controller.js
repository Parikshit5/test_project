import { PrismaClient } from "@prisma/client";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { sendEmail } from "../../utils/mailer.js";
import { otpService } from "../../utils/otpService.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { comparePassword, hashPassword } from './../../utils/bcrypt.js';
import { generateTokens } from './../../utils/user/AccessToken.js';
import path from "path";
import fs from "fs";
import { generateDirectoryLink } from "../../loadEnv.js";
import { OTP_EXPIRE_TIME, SERVER_URL } from "../../constants.js";
import jwt  from 'jsonwebtoken';

const prisma = new PrismaClient();


const DIRECTORY_URL = await generateDirectoryLink();




export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, profileImage } = req.body;
  const password = await hashPassword(req.body.password);

  if (!email || !name || !password) {
    return ApiResponse(res, 400, null, "Email, name, and password are required.");
  }

  const sanitizedEmail = email.trim().toLowerCase();
  
  const existingUser = await prisma.user.findUnique({
    where: { email: sanitizedEmail },
  });

  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + OTP_EXPIRE_TIME); 

  let templatePath = path.join(DIRECTORY_URL, 'templates', 'otpEmail.html');
  console.log("Template Path:", templatePath);

  let htmlContent = fs.readFileSync(templatePath, 'utf8');
  
  if (existingUser) {
    if (existingUser.isDeleted==true) {
      return ApiResponse(res, 403, null, "Your Account is blocked due to breach of community guidelines, if you think its a mistake then please contact us.");
    }
    if (!existingUser.isVerified) {
      const otp = await otpService(sanitizedEmail);
      htmlContent = htmlContent.replace("${otp}", otp);
      
      await prisma.user.update({
        where: { email: sanitizedEmail },
        data: {
          name,
          password,
          profileImage,
        },
      });
      
      await sendEmail({
        to: sanitizedEmail,
        subject: "OTP to Verify Your Account",
        text: "OTP Verification Email",
        html: htmlContent,
      });

      await prisma.otp.upsert({
        where: { email: sanitizedEmail },
        update: { otp, expiresAt },
        create: { email: sanitizedEmail, otp, expiresAt },
      });

      return ApiResponse(
        res,
        202,
        null,
        "Account already exists but not verified. An OTP has been resent to your email."
      );
    }
   
    return ApiResponse(
      res,
      409,
      null,
      "Account already exists with this email."
    );
  }

  const newUser = await prisma.user.create({
    data: {
      name,
      email: sanitizedEmail,
      password,
      profileImage,
    },
  });

  const otp = await otpService(sanitizedEmail);
  htmlContent = htmlContent.replace("${otp}", otp);

  await prisma.otp.upsert({
    where: { email: sanitizedEmail },
    update: { otp, expiresAt },
    create: { email: sanitizedEmail, otp, expiresAt },
  });

  await sendEmail({
    to: sanitizedEmail,
    subject: "OTP to Verify Your Account",
    text: "OTP Verification Email",
    html: htmlContent,
  });

  const sanitizedUser = {
    name: newUser.name,
    email: newUser.email,
    isVerified: newUser.isVerified,
  };

  return ApiResponse(
    res,
    201,
    sanitizedUser,
    "User registered successfully. Please verify your email."
  );
});


export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  
  if (!email || !otp) {
    return ApiResponse(res, 400, null, "Email and OTP are required.");
  }

  const sanitizedEmail = email.trim().toLowerCase();
  console.log("Verifying OTP for email:", sanitizedEmail);

  const otpRecord = await prisma.otp.findUnique({
    where: { email: sanitizedEmail },
  });

  console.log(otpRecord);
  
  if (!otpRecord) {
    return ApiResponse(res, 404, null, "OTP not found for this email.");
  }

  const currentTime = new Date();
  if (currentTime > new Date(otpRecord.expiresAt)) {
    return ApiResponse(res, 400, null, "OTP has expired.");
  }

  if (otpRecord.otp !=otp) {
    return ApiResponse(res, 400, null, "Invalid OTP.");
  }

  let sanitizedEmail1 = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: sanitizedEmail1 },
  });

  if (!user) {
    return ApiResponse(res, 404, null, "User not found.");
  }

 
    await prisma.user.update({
      where: { email: sanitizedEmail },
      data: {
        isVerified:true
      },
    });

 
    await prisma.otp.delete({
      where: { email: sanitizedEmail }, 
    });

    return ApiResponse(res, 200, null, "OTP verified successfully.");
  
});


export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const sanitizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: sanitizedEmail },
  });

  if (!user) {
    return ApiResponse(res, 404, null, "User not found.");
  }

  if (user.isDeleted==true) {
    return ApiResponse(res, 403, null, "Your Account is blocked due to breach of community guidelines, if you think its a mistake then please contact us.");
  }


  if (!user.isVerified) {
    return ApiResponse(res, 400, null, "Account is not verified. Please verify your email.");
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    return ApiResponse(res, 400, null, "Invalid credentials.");
  }

  const data = generateTokens(user);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: data.refreshToken },
  });

  return ApiResponse(res, 200, data, "Login successful.");
});


export const updateProfile = asyncHandler(async (req, res) => {
  const { name} = req.body;
  let profileImage;
  if(req.file){
     profileImage=req.file.filename
  }
  else{
     profileImage=null
  }
  const userId = req.user.id; 

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return ApiResponse(res, 404, null, "User not found.");
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      name: name || user.name, 
      profileImage: profileImage || user.profileImage, 
    },
  });


  return ApiResponse(res, 200, null, "Profile updated successfully.");
});


export const requestForgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return ApiResponse(res, 400, null, "Email is required.");
  }

  const sanitizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: sanitizedEmail },
  });

  if (!user) {
    return ApiResponse(res, 404, null, "User not found.");
  }
  if (user.isVerified === false) {
    return ApiResponse(res, 400, null, "Your Account is Not Verified.");
  }

  if (user.isDeleted) {
    return ApiResponse(res, 400, null, "User account is deactivated.");
  }

  const otp = await otpService(sanitizedEmail);

  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + OTP_EXPIRE_TIME);  // Use OTP_EXPIRE_TIME from constants.js

  let templatePath = path.join(DIRECTORY_URL, 'templates', 'forgetEmail.html');

  let htmlContent = fs.readFileSync(templatePath, 'utf8');

  htmlContent = htmlContent.replace("${otp}", otp);

  try {
    await prisma.otp.upsert({
      where: { email: sanitizedEmail },
      update: { otp, expiresAt },
      create: { email: sanitizedEmail, otp, expiresAt },
    });

    await sendEmail({
      to: sanitizedEmail,
      subject: "Password Reset OTP",
      text: "Here is your OTP for password reset.",
      html: htmlContent,
    });

    return ApiResponse(res, 200, null, "OTP has been sent to your email.");
  } catch (error) {
    console.error("Error while handling OTP request:", error);
    return ApiResponse(res, 500, null, "Something went wrong. Please try again.");
  }
});

export const forgetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return ApiResponse(res, 400, null, "Email, OTP, and new password are required.");
  }

  const sanitizedEmail = email.trim().toLowerCase();

  
  const otpRecord = await prisma.otp.findUnique({
    where: { email: sanitizedEmail },
  });

  if (!otpRecord) {
    return ApiResponse(res, 404, null, "OTP not found for this email.");
  }

  const currentTime = new Date();
  if (currentTime > new Date(otpRecord.expiresAt)) {
    return ApiResponse(res, 400, null, "OTP has expired.");
  }

  if (otpRecord.otp != otp) {
    return ApiResponse(res, 400, null, "Invalid OTP.");
  }

  
  const hashedPassword = await hashPassword(newPassword);

  
  await prisma.user.update({
    where: { email: sanitizedEmail },
    data: { password: hashedPassword },
  });

  
  await prisma.otp.delete({
    where: { email: sanitizedEmail },
  });

  return ApiResponse(res, 200, null, "Password updated successfully.");
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  if (!currentPassword || !newPassword) {
    return ApiResponse(res, 400, null, "Current and new passwords are required.");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return ApiResponse(res, 404, null, "User not found.");
  }

  const isPasswordValid = await comparePassword(currentPassword, user.password);

  if (!isPasswordValid) {
    return ApiResponse(res, 400, null, "Current password is incorrect.");
  }


  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return ApiResponse(res, 200, null, "Password changed successfully.");
});


export const getUserData = asyncHandler(async (req, res) => {
  const userId = req.user.id; 
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: false,
      name: true,
      email: true,
      profileImage: true, 
      createdAt: true,
      updatedAt: true,
    },
  });
  user.profileImage=path.join(SERVER_URL,'uploads',user.profileImage)
  if (!user) {
    return ApiResponse(res, 404, null, "User not found.");
  }

  return ApiResponse(res, 200, user, "User data fetched successfully.");
});


export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return ApiResponse(res, 400, null, "Refresh token is required.");
  }

  const decoded = jwt.verify(refreshToken, process.env.USER_REFRESH_TOKEN_SECRET);

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user || user.refreshToken !== refreshToken) {
    return ApiResponse(res, 403, null, "Invalid refresh token.");
  }

  const data = generateTokens(user);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: data.refreshToken },
  });

  return ApiResponse(res, 200, data, "Tokens refreshed successfully.");
});