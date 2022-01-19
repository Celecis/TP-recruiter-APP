import nc from "next-connect";
//next-connect is a replacement of express
import User from "../../../src/models/userModel";
import bcrypt from "bcryptjs";
import db from "../../../utils/db";
import { signToken } from "../../../utils/auth";
import { NextApiRequest, NextApiResponse } from "next";

const handler = nc();

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const user = await User.findOne({ email: req.body.email });
  await db.disconnect();

  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    const token = signToken(user);
    res.send({
      token,
      _id: user._id,
      userName: user.userName,
      email: user.email,
      isRecruiter: user.isRecruiter,
    });
  } else {
    res.status(401).send({ message: "Invalid email or password" });
  }
});

export default handler;
