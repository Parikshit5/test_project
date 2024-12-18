import jwt from "jsonwebtoken";

const ADMIN_ACCESS_TOKEN_SECRET = process.env.ADMIN_ACCESS_TOKEN_SECRET;
const ADMIN_ACCESS_TOKEN_EXPIRY = process.env.ADMIN_ACCESS_TOKEN_EXPIRY;
const ADMIN_REFRESH_TOKEN_SECRET = process.env.ADMIN_REFRESH_TOKEN_SECRET;
const ADMIN_REFRESH_TOKEN_EXPIRY = process.env.ADMIN_REFRESH_TOKEN_EXPIRY;

console.log(ADMIN_ACCESS_TOKEN_SECRET);


export const generateAdminTokens = (admin) => {
  const { id, email, name } = admin;

  if (!id && !email && !name) {
    throw new Error("Missing required fields: id, email, or name");
  }

  const accessToken = jwt.sign({ id, email, name }, ADMIN_ACCESS_TOKEN_SECRET, {
    expiresIn: ADMIN_ACCESS_TOKEN_EXPIRY,
  });

  const refreshToken = jwt.sign({ id, email, name }, ADMIN_REFRESH_TOKEN_SECRET, {
    expiresIn: ADMIN_REFRESH_TOKEN_EXPIRY,
  });

  return { accessToken, refreshToken };
};



export const validateAdminJwt = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; 

  if (!token) {
    return res.status(401).json({ message: "Unauthorized admin!" });
  }

  try {
    const decoded = jwt.verify(token, ADMIN_ACCESS_TOKEN_SECRET);
    const { password, ...payloadWithoutPassword } = decoded;

    req.admin = payloadWithoutPassword; 
    next();
  } catch (error) {
    console.error("Invalid or expired token:", error);

    return res.status(401).json({ message: "Invalid or expired admin token." });
  }
};
