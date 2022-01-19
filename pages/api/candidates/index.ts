import nc from "next-connect";
import Candidate from "../../../src/models/candidateModel";
//next-connect is a replacement of express
import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../utils/db";

const handler = nc();

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const candidates = await Candidate.find({});
  await db.disconnect();
  res.send(candidates);
});

export default handler;
