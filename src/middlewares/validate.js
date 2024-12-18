import { validationResult } from 'express-validator';
import multer from 'multer';

// Global middleware to handle validation errors

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
};


export const multerErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
       
        return res.status(415).json({
          message: 'Invalid file format or file size too large.',
          error: err.message,
        });
      } else if (err.name === 'Error') {
        console.log(err);
        return res.status(400).json({
          message: err.message,
          
        });
      }
      
      return res.status(500).json({
        message: 'An unexpected error occurred.',
        error: err.stack,
      });
  };