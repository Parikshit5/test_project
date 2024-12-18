import { Router } from "express";
import { loginUser, registerUser, updateProfile, verifyOtp, requestForgetPassword, forgetPassword, resetPassword, getUserData, refreshToken } from "../../controllers/user/user.controller.js";
import { multerErrorHandler, validate } from './../../middlewares/validate.js';
import { loginValidations, registerValidations, updateProfileValidations, verifyOtpValidations,requestForgetPasswordValidations, forgetPasswordValidations, resetPasswordValidations } from './../../validators/user/user.validations.js';
import { upload, validateProfileImage } from './../../middlewares/multer.middleware.js';
import { validateJwt } from "../../utils/user/AccessToken.js";


const router=Router();

router.route('/register').post(
    upload.single('profileImage'),
    validateProfileImage,
    registerValidations,
    validate,
    multerErrorHandler,
    registerUser
);

router.route('/verifyEmail').post(
    verifyOtpValidations,
    validate,
    verifyOtp
);

router.route('/login').post(
    loginValidations,
    validate,
    loginUser
)

router.route("/").put(
    validateJwt,
    upload.single('profileImage'),
    multerErrorHandler,
    updateProfileValidations,
    validate,
    updateProfile,
    
)

router.route("/requestForgetPassword").post(
    requestForgetPasswordValidations,
    validate,
    requestForgetPassword,
    
)

router.route("/forgetPassword").post(
    forgetPasswordValidations,
    validate,
    forgetPassword,
)

router.route('/resetPassword').post(
    validateJwt,
    resetPasswordValidations,
    validate,
    resetPassword
  );

  router.route('/').get(
    validateJwt,
    getUserData
  )

  router.route('/refreshAccessToken').post(
    refreshToken
  )
export default router;