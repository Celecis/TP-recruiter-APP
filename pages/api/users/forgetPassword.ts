import nc from "next-connect";
import User from "../../../src/models/userModel";
import Token from "../../../src/models/tokenModel";
import db from "../../../utils/db";
import sendEmail from "../../../utils/sendEmail";
import crypto from "crypto";

import { NextApiRequest, NextApiResponse } from "next";

const handler = nc();

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await db.connect();
    const user = await User.findOne({ email: req.body.email });
    let passwordToken = await Token.findOne({ userId: user._id });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Veja se inseriu o email correctamente, por favor",
      });
    }

    if (!passwordToken) {
      passwordToken = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }

    const link = `${process.env.BASE_URL}/reset-password?token=${passwordToken.token}`;

    await sendEmail(user.email, "Reset Password", link);
    await db.disconnect();
    return res.send({ message: "Email enviado com sucesso." });
  } catch (error) {
    await db.disconnect();
    return res
      .status(400)
      .json({ error: "Email não enviado. Tente novamente." });
  }
});

export default handler;
