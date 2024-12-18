import { body,query } from 'express-validator';

export const createAdminValidations = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .isLength({ max: 50 })
    .withMessage('Email must not exceed 50 characters')
    .matches(/^[^\u{1F600}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]+$/u)
    .withMessage('Email cannot include emojis or invalid characters'),

  body('password')
    .trim()
    .isLength({ min: 8, max: 100 })
    .withMessage('Your password must be between 8 and 100 characters long.')
    .matches(/[A-Z]/)
    .withMessage('Your password must contain at least one uppercase letter (e.g., A, B, C).')
    .matches(/[a-z]/)
    .withMessage('Your password must contain at least one lowercase letter (e.g., a, b, c).')
    .matches(/[0-9]/)
    .withMessage('Your password must include at least one number (e.g., 0, 1, 2, 3).')
    .matches(/[@$!%*?&]/)
    .withMessage(
      'Your password must include at least one special character, such as @, $, !, %, *, ?, or &.'
    )
    .matches(/^[^\u{1F600}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]+$/u)
    .withMessage('Password cannot include emojis or invalid characters'),

  body('name')
    .notEmpty()
    .withMessage('Name can\'t be empty')
    .isLength({ min: 2, max: 80 })
    .withMessage('Name must be between 2 and 80 characters.')
    .matches(/^[A-Za-z\s]+$/)
    .withMessage('Name can only include letters and spaces. Emojis and other symbols are not allowed.')
    .matches(/^[^\u{1F600}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]+$/u)
    .withMessage('Name cannot include emojis or invalid characters'),

  body('permissions')
    .isArray({ min: 1, max: 100 }) // Limit number of permissions in array
    .withMessage('Permissions must be an array with at least one permission and no more than 100.')
    .custom((permissions) => {
      for (const perm of permissions) {
        if (!perm.module) {
          throw new Error('Each permission must have a "module" field.');
        }
        if (!Array.isArray(perm.permissions) || perm.permissions.length === 0) {
          throw new Error(
            'Each permission must have a "permissions" array with at least one action.'
          );
        }
        if (perm.permissions.length > 5) {
          throw new Error('Each module can have no more than 5 permission actions.');
        }
        for (const action of perm.permissions) {
          if (!['GET', 'POST', 'DELETE', 'PUT', 'PATCH'].includes(action)) {
            throw new Error(`Invalid permission action: ${action}`);
          }
        }
      }
      return true;
    }),
];


export const adminLoginValidations=[
    body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .isLength({ max: 50 })
    .withMessage('Email must not exceed 50 characters')
    .matches(/^[^\u{1F600}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]+$/u)
    .withMessage('Email cannot include emojis or invalid characters'),

  body('password')
    .trim()
    .isLength({ min: 8, max: 100 })
    .withMessage('Your password must be between 8 and 100 characters long.')
    .matches(/[A-Z]/)
    .withMessage('Your password must contain at least one uppercase letter (e.g., A, B, C).')
    .matches(/[a-z]/)
    .withMessage('Your password must contain at least one lowercase letter (e.g., a, b, c).')
    .matches(/[0-9]/)
    .withMessage('Your password must include at least one number (e.g., 0, 1, 2, 3).')
    .matches(/[@$!%*?&]/)
    .withMessage(
      'Your password must include at least one special character, such as @, $, !, %, *, ?, or &.'
    )
    .matches(/^[^\u{1F600}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]+$/u)
    .withMessage('Password cannot include emojis or invalid characters'),
]



export const viewUserValidations = [
  query('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .isLength({ max: 50 })
    .withMessage('Email must not exceed 50 characters')
    .matches(/^[^\u{1F600}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]+$/u)
    .withMessage('Email cannot include emojis or invalid characters'),
];

export const editUserValidations = [
    query('id')
      .notEmpty()
      .withMessage('User ID is required')
      .isUUID()
      .withMessage('User ID must be a valid UUID'),
  
    body('name')
      .optional()
      .isString()
      .withMessage('Name must be a string')
      .isLength({ min: 2, max: 80 })
      .withMessage('Name must be between 2 and 80 characters')
      .matches(/^[A-Za-z\s]+$/)
      .withMessage('Name can only include letters and spaces'),
  
    body('isDeleted')
      .optional()
      .isBoolean()
      .withMessage('isDeleted must be a boolean value'),
  
    body()
      .custom((value, { req }) => {
        if (!req.body.name && req.body.isDeleted === undefined) {
          throw new Error('At least one of "name" or "isDeleted" is required');
        }
        return true;
      }),
  ];
