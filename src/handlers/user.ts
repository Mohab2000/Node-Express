import express, { Request, Response } from "express";
import { User, UserStore } from "../models/user";
const user = new UserStore();

const create = async (req: Request, res: Response) => {
  const createdUser: User = {
    username: req.body.username,
    password: req.body.password,
  };
  const newUser = await user.create(createdUser);
  res.json(newUser);
};

const authenticate = async (req: Request, res: Response) => {
  const username = req.body.username;
  const password = req.body.password;
  const authenticatedUser = await user.authenticate(username, password);

  res.json(authenticatedUser);
};
const user_routes = (app: express.Application) => {
  app.post("/users", create);
  app.post("/authenticate", authenticate);
};
export default user_routes;
