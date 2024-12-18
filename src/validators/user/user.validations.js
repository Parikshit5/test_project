import { body,check } from 'express-validator';
export const registerValidations = [
 
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),

  body('password')
  .trim()
  .isLength({ min: 8 })
  .withMessage('Your password must be at least 8 characters long.')
  .matches(/[A-Z]/)
  .withMessage('Your password must contain at least one uppercase letter (e.g., A, B, C).')
  .matches(/[a-z]/)
  .withMessage('Your password must contain at least one lowercase letter (e.g., a, b, c).')
  .matches(/[0-9]/)
  .withMessage('Your password must include at least one number (e.g., 0, 1, 2, 3).')
  .matches(/[@$!%*?&]/)
  .withMessage(
    'Your password must include at least one special character, such as @, $, !, %, *, ?, or &.'
  ),

  body('name')
    .notEmpty()
    .withMessage('Name can\'t be empty') 
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[A-Za-z\s]+$/) // Regex to allow only letters and spaces
    .withMessage('Name can only include letters and spaces. Emojis and other symbols are not allowed.')
];

export const verifyOtpValidations = [
  
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email address'),
  
    body('otp')
      .trim()
      .isLength({ min: 1, max: 20 })
      .withMessage('OTP must be between 1 and 20 characters long.')
      .isNumeric()
      .withMessage('OTP must be a valid numeric value'),
  
  ];

  export const  loginValidations=[
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email address'),

      body('password')
      .trim()
      .isLength({ min: 8 })
      .withMessage('Your password must be at least 8 characters long.')
      .matches(/[A-Z]/)
      .withMessage('Your password must contain at least one uppercase letter (e.g., A, B, C).')
      .matches(/[a-z]/)
      .withMessage('Your password must contain at least one lowercase letter (e.g., a, b, c).')
      .matches(/[0-9]/)
      .withMessage('Your password must include at least one number (e.g., 0, 1, 2, 3).')
      .matches(/[@$!%*?&]/)
      .withMessage(
        'Your password must include at least one special character, such as @, $, !, %, *, ?, or &.'
      ),   
  ]


  export const updateProfileValidations = [
    
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters long.')
      .matches(/^[A-Za-z\s]+$/)
      .withMessage('Name can only include letters and spaces. Emojis and other symbols are not allowed.'),
  
    
      check('profileImage')
      .optional() 
      .custom((value, { req }) => {
        
        const file = req.file;
        if (file) {
         
          const validMimeTypes = [
            'image/jpeg',
            'image/png',
            'image/jpg',
            'image/webp',
            'image/gif',
            'image/heic',  
            'image/heif'
          ];;
          if (!validMimeTypes.includes(file.mimetype)) {
            throw new Error('Profile image must be a valid image file.');
          }
  
          
          const maxSize = 2 * 1024 * 1024; // 2 MB
          if (file.size > maxSize) {
            throw new Error('Profile image size must be less than 2 MB.');
          }
        }
        return true;
      }),
  
    // Custom validation to ensure at least one field is provided
    body('name')
      .custom((value, { req }) => {
        if (!value && !req.file) {
          throw new Error("At least one of 'name' or 'profileImage' must be provided to update.");
        }
        return true;
      })
  
  ];

  export const requestForgetPasswordValidations=[
    body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),
  ]

  export const forgetPasswordValidations=[
      body('email')
        .isEmail()
        .withMessage('Please provide a valid email address'),
    
      body('otp')
        .trim()
        .isLength({ min: 1, max: 20 })
        .withMessage('OTP must be between 1 and 20 characters long.')
        .isNumeric()
        .withMessage('OTP must be a valid numeric value'),
    
      body('newPassword')
        .trim()
        .isLength({ min: 8 })
        .withMessage('New password must be at least 8 characters long.')
        .matches(/[A-Z]/)
        .withMessage('New password must contain at least one uppercase letter.')
        .matches(/[a-z]/)
        .withMessage('New password must contain at least one lowercase letter.')
        .matches(/[0-9]/)
        .withMessage('New password must include at least one number.')
        .matches(/[@$!%*?&]/)
        .withMessage('New password must include at least one special character.'),
  ]

  export const resetPasswordValidations=[
    body('currentPassword')
    .trim()
    .notEmpty()
    .withMessage('Current password is required.'),

  body('newPassword')
    .trim()
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long.')
    .matches(/[A-Z]/)
    .withMessage('New password must contain at least one uppercase letter.')
    .matches(/[a-z]/)
    .withMessage('New password must contain at least one lowercase letter.')
    .matches(/[0-9]/)
    .withMessage('New password must include at least one number.')
    .matches(/[@$!%*?&]/)
    .withMessage('New password must include at least one special character.'),
  ]