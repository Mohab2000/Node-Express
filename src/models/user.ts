import bcrypt from "bcrypt";
import Client from "../database";
import config from "../bcrypt";

export type User = {
  id?: number;
  username: string;
  password: string;
};

export class UserStore {
  async create(
    u: User
  ): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const conn = await Client.connect();
      const checkUsernameSql = "SELECT * FROM users WHERE username = $1";
      const existingUser = await conn.query(checkUsernameSql, [u.username]);

      if (existingUser.rows.length > 0) {
        conn.release();
        return {
          success: false,
          message: `Username (${u.username}) already exists.`,
        };
      }

      const sql =
        "INSERT INTO users (username, password_digest) VALUES($1, $2) RETURNING *";

      const hash = bcrypt.hashSync(
        u.password + config.pepper,
        parseInt(config.salt)
      );
      const result = await conn.query(sql, [u.username, hash]);
      const user = result.rows[0];

      conn.release();

      return { success: true, message: "User created successfully", user };
    } catch (err) {
      throw new Error(`unable create user (${u.username}): ${err}`);
    }
  }

  async authenticate(username: string, password: string): Promise<User | null> {
    const conn = await Client.connect();
    const sql = "SELECT password_digest FROM users WHERE username = $1";
    const result = await conn.query(sql, [username]);
    if (result.rows.length) {
      const user = result.rows[0];
      if (bcrypt.compareSync(password + config.pepper, user.password_digest)) {
        return user;
      }
    }
    return null;
  }
}
