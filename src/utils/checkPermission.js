import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const checkPermission = (moduleName, action) => {
    return async (req, res, next) => {
        try {
            const adminId = req.admin.id;

            const admin = await prisma.admin.findUnique({
                where: { id: adminId },
            });

            if (!admin) {
                return res.status(404).json({ message: 'Admin not found' });
            }

            const permissions = admin.permissions ? JSON.parse(admin.permissions) : [];

            const hasPermission = await Promise.all(
                permissions.map(async (permission) => {
                    const module = await prisma.module.findUnique({
                        where: { id: permission.module },
                    });

                    return (
                        module?.name === moduleName && 
                        permission.permissions.includes(action)
                    );
                })
            );

            if (!hasPermission.some((perm) => perm)) {
                return res.status(403).json({ message: 'Access Denied' });
            }

            next();
        } catch (err) {
            next(err);
        }
    };
};
