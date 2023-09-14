import dotenv from "dotenv";
dotenv.config();
const { PASSWORD_BCRYPTION, SALT_ROUNDS } = process.env;
export default {
  pepper: PASSWORD_BCRYPTION || "your-default-pepper-secret",
  salt: SALT_ROUNDS || "10",
};
