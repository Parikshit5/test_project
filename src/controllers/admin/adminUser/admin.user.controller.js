import { PrismaClient } from "@prisma/client";
import { ApiResponse } from '../../../utils/ApiResponse.js';
import path from "path";
import { SERVER_URL } from './../../../constants.js';


const prisma = new PrismaClient();

export const editUser = async (req, res) => {
    const { name, isDeleted } = req.body;
    const {id}=req.query;

    if ( !name && !isDeleted ) {
        return res.status(400).json({ message: 'At least one field is required, either name or isDeleted' });
    }

    const user = await prisma.user.findUnique({
        where: { id },
    });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const updatedUser = await prisma.user.update({
        where: { id },
        data: {
            name: name ? name : user.name, 
            isDeleted: isDeleted !== undefined ? isDeleted : user.isDeleted,
        },
    });
    return ApiResponse(res,200,{id:id,name:updatedUser.name,isDeleted:updatedUser.isDeleted},"User updated successfully.")
};


export const viewUser = async (req, res) => {
    const { email } = req.query;

    console.log('Received email:', email);

    if (!email) {
        return ApiResponse(res,400,null,"Email is required");
    }

    let user = await prisma.user.findUnique({
        where: { email, isDeleted: false, isVerified: true },
        select: {
            id: true,
            name: true,
            email: true,
            isDeleted: true,
            isVerified: true,
            profileImage: true,  // Only select the profileImage as well
        },
    });
    user.profileImage = path.join(SERVER_URL, 'uploads', user.profileImage);

    if (!user) {
        return ApiResponse(res,404,null,"User not found");
    }
    return ApiResponse(res,200,user,"User found");
};


export const userPagination = async (req, res) => {
    const { page = 1, limit = 10, email, isVerified, isDeleted } = req.query;

    const skip = (page - 1) * limit;

    const filters = {};


    if (email) {
        filters.email = {
            contains: email.toLowerCase(),
        };
    }

    if (isVerified !== undefined) {
        filters.isVerified = isVerified === 'true';
    }

    if (isDeleted !== undefined) {
        filters.isDeleted = isDeleted === 'true';
    }

    let users = await prisma.user.findMany({
        where: filters,
        skip,
        take: parseInt(limit),
        select: {
            id: true,
            name: true,
            email: true,
            isDeleted: true,
            isVerified: true,
            profileImage: true,  
        },
    });


    users = users.map(user => {
        if (user.profileImage) {
            user.profileImage = path.join(SERVER_URL, 'uploads', user.profileImage);
        }
        return user;
    });

 
    const totalUsers = await prisma.user.count({
        where: filters,
    });

    const totalPages = Math.ceil(totalUsers / limit);

    return res.status(200).json({
        message: 'Users retrieved successfully',
        data: users,
        page,
        totalPages,
        totalUsers,
    });
};
