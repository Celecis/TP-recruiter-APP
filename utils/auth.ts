/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

const JWT_SECRET: string = process.env.JWT_SECRET!;

const signToken = (user: any) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

interface User extends NextApiRequest {
  user: string | jwt.JwtPayload | undefined;
}

const isAuth = async (req: User, res: NextApiResponse, next: () => void) => {
  const { authorization } = req.headers;
  if (authorization) {
    // Bearer xxx => xxx
    const token = authorization.slice(7, authorization.length);
    jwt.verify(token, JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: "Token is not valid" });
        //401: unauthorized code
      } else {
        //req.user = decode;
        req.user = decode;
        //decode constains the user _id, userName, email and isRecruiter
        next();
      }
    });
  } else {
    res.status(401).send({ message: "Token is not suppiled" });
  }
};

export { signToken, isAuth };
