import express, { Request, Response } from "express";
import { Weapon, MythicalWeaponStore } from "../models/mythical_weapon";
import { TokenMiddleware } from "../middlewares/token_middleware";

const store = new MythicalWeaponStore();

const index = async (_req: Request, res: Response) => {
  const weapons = await store.index();
  res.json(weapons);
};

const create = async (req: Request, res: Response) => {
  const weapon: Weapon = {
    name: req.body.name,
    type: req.body.type,
    weight: req.body.weight,
  };

  const newWeapon = await store.create(weapon);
  res.json(newWeapon);
};

const show = async (req: Request, res: Response) => {
  const weapon = await store.show(req.params.id);
  res.json(weapon);
};

const destroy = async (req: Request, res: Response) => {
  const deleted = await store.delete(req.params.id);

  res.json(deleted);
};

const mythical_weapon_routes = (app: express.Application) => {
  app.get("/products", TokenMiddleware.verifyAuthToken, index);
  app.get("/products/:id", TokenMiddleware.verifyAuthToken, show);
  app.delete("/products/:id", TokenMiddleware.verifyAuthToken, destroy);
  app.post("/products", TokenMiddleware.verifyAuthToken, create);
};
export default mythical_weapon_routes;
