import nc from "next-connect";
import User from "../../../src/models/userModel";
import db from "../../../utils/db";
import bcrypt from "bcryptjs";
import { signToken } from "../../../utils/auth";
import { NextApiRequest, NextApiResponse } from "next";

const handler = nc();

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  try {
    const existUser = await User.findOne({ email: req.body.email });

    if (existUser) {
      return res.status(401).send({
        message: "Ja existe um registo com este email",
      });
    }

    const newUser = new User({
      userName: req.body.userName,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
      isRecruiter: true,
    });
    const user = await newUser.save();
    console.log(user);
    const token = signToken(user);
    return res.send({
      token,
      _id: user._id,
      userName: user.userName,
      email: user.email,
      isRecruiter: user.isRecruiter,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Algo de errado aconteceu. Tente novamente." });
  }
});

export default handler;
