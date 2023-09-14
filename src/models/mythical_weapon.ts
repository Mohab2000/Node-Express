import Client from "../database";

export type Weapon = {
  id?: Number;
  name: String;
  type: String;
  weight: Number;
};
export class MythicalWeaponStore {
  async index(): Promise<Weapon[]> {
    try {
      const conn = await Client.connect();
      const sql = "SELECT * FROM mythical_weapons";
      const result = await conn.query(sql);
      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get weapons ${err}`);
    }
  }
  async show(id: string): Promise<Weapon> {
    try {
      const conn = await Client.connect();
      const sql = "SELECT * FROM mythical_weapons WHERE id=($1)";
      const result = await conn.query(sql, [id]);
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot get weapons ${err}`);
    }
  }
  async create(weap: Weapon): Promise<Weapon> {
    try {
      const conn = await Client.connect();
      const sql =
        "INSERT INTO mythical_weapons (name , type, weight) VALUES ($1, $2, $3) RETURNING *";

      const result = await conn.query(sql, [weap.name, weap.type, weap.weight]);
      const weapon = result.rows[0];

      conn.release();
      return weapon;
    } catch (err) {
      throw new Error(`Cannot get weapons ${err}`);
    }
  }
  async delete(id: string): Promise<Weapon> {
    try {
      const sql = "DELETE FROM mythical_weapons WHERE id=($1) RETURNING *";
      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);

      const weap = result.rows[0];

      conn.release();

      return weap;
    } catch (err) {
      throw new Error(`Could not delete book ${id}. Error: ${err}`);
    }
  }
}
