import { Router } from "express";
import { adminLogin, createAdmin } from "../../controllers/admin/admin.controller.js";
import { adminLoginValidations, createAdminValidations } from "../../validators/admin/admin.validations.js";
import { validate } from "../../middlewares/validate.js";
import { validateAdminJwt } from "../../utils/admin/AccessToken.js";


const router=Router();

router.route('/create').post(
    validateAdminJwt,
    createAdminValidations,
    validate,
    createAdmin
);

router.route('/login').post(
    adminLoginValidations,
    validate,
    adminLogin
)


export default router;