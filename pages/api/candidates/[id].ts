import nc from "next-connect";
import Candidate from "../../../src/models/candidateModel";
//next-connect is a replacement of express
import db from "../../../utils/db";
import { NextApiRequest, NextApiResponse } from "next";

const handler = nc();

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const candidate = await Candidate.findById(req.query.id);
  await db.disconnect();
  res.send(candidate);
});

export default handler;
