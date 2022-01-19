import nc from "next-connect";
import Candidate from "../../../../src/models/candidateModel";
import db from "../../../../utils/db";
import { NextApiRequest, NextApiResponse } from "next";
import { isAuth } from "../../../../utils/auth";

const handler = nc();
handler.use(isAuth);

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const candidates = await Candidate.find({});
  await db.disconnect();
  res.send(candidates);
});

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();

  console.log(req.body._id);
  const newCandidate = new Candidate({
    slug: "candidato-" + Math.floor(Math.random() * 9999) + 1,
    candidateName: "Nome do Candidato",
    candidateEmail: "Email do Candidato",
    title: "Escrever cargo",
    files: "",
    recruiter: req.body.userInfo._id,
  });

  const candidate = await newCandidate.save();
  await db.disconnect();
  res.send({ message: "Candidato criado com sucesso", candidate });
});

export default handler;
