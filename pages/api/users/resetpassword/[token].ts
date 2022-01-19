import nc from "next-connect";
import User from "../../../../src/models/userModel";
import Token from "../../../../src/models/tokenModel";
import db from "../../../../utils/db";
import bcrypt from "bcryptjs";

import { NextApiRequest, NextApiResponse } from "next";

const handler = nc();

interface UserId extends NextApiRequest {
  params: { userId: string; token: string };

  body: {
    _id: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
}

handler.post(async (req: UserId, res: NextApiResponse) => {
  console.log(req.query.token);
  try {
    await db.connect();

    const token = await Token.findOne({ token: req.query.token });

    if (!token) return res.status(400).send({ error: "Pedido Inválido" });

    const user = await User.findById(token.userId);

    if (!user) {
      return res
        .status(400)
        .send({ message: "Pedido Inválido. Tente novamente" });
    }

    user.password = bcrypt.hashSync(req.body.password);
    user.confirmPassword = req.body.confirmPassword;
    await user.save();
    await token.delete();
    return res.send({ message: "Recuperação de senha com sucesso" });
  } catch (error) {
    return res.status(500).send(error);
  }
});

export default handler;
