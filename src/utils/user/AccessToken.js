import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.USER_ACCESS_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRY = process.env.USER_ACCESS_TOKEN_EXPIRY;
const REFRESH_TOKEN_SECRET = process.env.USER_REFRESH_TOKEN_SECRET;
const REFRESH_TOKEN_EXPIRY = process.env.USER_REFRESH_TOKEN_EXPIRY;

export const generateTokens = (user) => {
  const { id, email, name } = user;

  if (!id && !email && !name) {
    throw new Error("Missing required fields: id, email, or name");
  }

  const accessToken = jwt.sign({ id, email, name }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });

  const refreshToken = jwt.sign({ id,email, name }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });

  return { accessToken, refreshToken };
};


export const validateJwt = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer token

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized user!" });
  }

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    const { password, ...payloadWithoutPassword } = decoded;

    req.user = payloadWithoutPassword; 
    next();
  } catch (error) {
    console.error("Invalid or expired token:", error);

    return res.status(401).json({ message: "Invalid or expired token." });
  }
};
