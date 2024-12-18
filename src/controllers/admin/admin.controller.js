import { PrismaClient } from "@prisma/client";
import { asyncHandler } from '../../utils/asyncHandler.js';
import { comparePassword, hashPassword } from "../../utils/bcrypt.js";
import { generateAdminTokens } from "../../utils/admin/AccessToken.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const prisma = new PrismaClient();


export const createAdmin = asyncHandler(async (req, res) => {
    let { name, email, password, permissions,role} = req.body;
    let createdBy = req.admin.createdBy; 
    const existingUser=await prisma.admin.findUnique(
        {
            where: { email },
          }
    )
    if(existingUser){
        return ApiResponse(res, 400, null,"Admin already exists with this email");
    }
    if (!name || !email || !password || !permissions || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    password = await hashPassword(password);
  
    const superAdmin = await prisma.admin.findUnique({
      where: { id: req.admin.id },
    });
  
    if (!superAdmin || superAdmin.role !== 'superAdmin') {
      return res.status(403).json({ message: "Unauthorized action. Only Super Admin can create an Admin." });
    }
  
    const permissionsString = JSON.stringify(permissions);
  
    const newAdmin = await prisma.admin.create({
      data: {
        name,
        email,
        password,
        role,
        createdBy,
        permissions: permissionsString, 
      },
    });
  
    return ApiResponse(res, 201,{
        id: newAdmin.id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
        permissions:JSON.parse(newAdmin.permissions)
      },
      "Admin created successfully"
    );
    
  });



  export const adminLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
  
  
    const admin = await prisma.admin.findUnique({
      where: { email },
    });
  
    if (!admin || admin.isDeleted) {
      return res.status(404).json({ message: 'Admin not found or deleted.' });
    }
  
    if (!['admin', 'superAdmin'].includes(admin.role)) {
      return res.status(403).json({ message: 'Unauthorized role.' });
    }
  
   
    const isPasswordValid = comparePassword(password,admin.password);
  
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
  
    const tokens = generateAdminTokens(admin);
  
    return ApiResponse(res,200,tokens,'Login Successful');
  });
