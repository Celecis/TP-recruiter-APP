import nc from "next-connect";
import Candidate from "../../../../src/models/candidateModel";
import Interview from "../../../../src/models/interviewModel";
import db from "../../../../utils/db";
import { NextApiRequest, NextApiResponse } from "next";
import { isAuth } from "../../../../utils/auth";
import { ObjectId } from "mongodb";

const handler = nc();
handler.use(isAuth);

handler.put(async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const candidate = await Candidate.findById(req.query.id);

  if (candidate) {
    candidate.candidateName = req.body.candidateName;
    candidate.candidateEmail = req.body.candidateEmail;
    candidate.title = req.body.title;
    candidate.files = req.body.files;

    console.log(candidate);
    //
    const newInterview = new Interview({
      interviewDescription: req.body.interviewDescription,
      candidate: req.query.id.toString(),
    });

    //console.log(newInterview);

    candidate.candidateInterviews.push(newInterview);
    //console.log(candidate);
    await newInterview.save();
    //
    await candidate.save();
    await db.disconnect();
    res.send({ message: "Perfil de Candidato atualizado com sucesso" });
  } else {
    await db.disconnect();
    res
      .status(404)
      .send({ message: "Não foi possivel atualizar o Perfil de Candidato" });
  }
});

handler.delete(async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const candidate = await Candidate.findById(req.query.id);
  //console.log(candidate);
  const candidateId = candidate._id.toString();
  console.log(candidateId);
  //console.log(interview);

  if (candidate) {
    await candidate.remove();
    await Interview.deleteMany({
      candidate: new ObjectId(candidateId),
    });
    //
    //console.log(candidate);
    await db.disconnect();
    res.send({ message: "Perfil de Candidato apagado" });
  } else {
    await db.disconnect();
    res
      .status(404)
      .send({ message: "Não foi possivel encontrar o Perfil de Candidato" });
  }
});

export default handler;
