import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { PrismaClient } from '@prisma/client'; 

const prisma = new PrismaClient(); 

const allowedFormats = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'image/webp',
  'image/gif',
  'image/heic',  
  'image/heif'
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');
  },
  filename: async (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${file.fieldname}${ext}`;

    if (req.user) {
      const email = req.user?.email || req.body.email; 
    
      try {
        const user = await prisma.user.findUnique({
          where: { email },
        });
    
        if (user && user.profileImage && !user.isDeleted) {
          const oldProfileImagePath = path.join('public', 'uploads', user.profileImage);
          fs.unlink(oldProfileImagePath, (err) => {
            if (err) {
              console.error('Error deleting old profile image:', err);
            }
          });
        }
        
        
        req.body.profileImage = filename;
        cb(null, filename); 
      } catch (error) {
        console.error('Error fetching user for profile image update:', error);
        cb(error);
      }
    }
    else {
      cb(null, filename); 
    }
  },
});

const fileFilter = (req, file, cb) => {
  if (!allowedFormats.includes(file.mimetype)) {
    return cb(new Error('Invalid file format. Only JPEG, PNG, JPG, WEBP, HEIC, HEIF, and GIF are allowed.'));
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB file size limit
});

export const validateProfileImage = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Profile image is required.' });
  }
  next();
};
