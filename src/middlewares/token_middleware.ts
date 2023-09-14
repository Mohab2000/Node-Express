import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export class TokenMiddleware {
  static verifyAuthToken(req: Request, res: Response, next: NextFunction) {
    try {
      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader) {
        return res.status(401).json({ error: "Authorization header missing" });
      }

      const token = authorizationHeader.split(" ")[1];
      jwt.verify(token, process.env.JWT!);

      next();
    } catch (error) {
      res.status(401).json({ error: "Invalid token" });
    }
  }
}
