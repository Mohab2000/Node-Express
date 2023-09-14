import express, { Request, Response } from "express";
import { User, UserStore } from "../models/user";
import jwt from "jsonwebtoken";

const user = new UserStore();

const create = async (req: Request, res: Response) => {
  const createdUser: User = {
    username: req.body.username,
    password: req.body.password,
  };

  try {
    const existingUser = await user.authenticate(
      createdUser.username,
      createdUser.password
    );

    if (existingUser) {
      return res
        .status(400)
        .json({ error: `Username (${createdUser.username}) already exists.` });
    }

    const newUser = await user.create(createdUser);

    const token = jwt.sign({ user: newUser }, process.env.JWT!);

    res.json({ token, newUser });
  } catch (error) {
    res.status(500).json({ error: "User creation failed" });
  }
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
