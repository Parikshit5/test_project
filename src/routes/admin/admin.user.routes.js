import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import { validateAdminJwt } from "../../utils/admin/AccessToken.js";
import { editUser, userPagination, viewUser } from "../../controllers/admin/adminUser/admin.user.controller.js";
import { checkPermission } from "../../utils/checkPermission.js";
import { editUserValidations, viewUserValidations } from "../../validators/admin/admin.validations.js";


const router=Router();

router.route('/').post(
    validateAdminJwt,
    checkPermission('users',"POST"),
    editUserValidations,
    validate,
    editUser
);

router.route('/').get(
    validateAdminJwt,
    checkPermission('users',"GET"),
    viewUserValidations,
    validate,
    viewUser
)

router.route('/pagination').get(
    validateAdminJwt,
    checkPermission('users',"GET"),
    validate,
    userPagination
)


export default router;