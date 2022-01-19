import bcrypt from "bcryptjs";

const data = {
  users: [
    {
      userName: "Vanessa Torres",
      email: "admin@gmail.com",
      password: bcrypt.hashSync("123123"),
      isRecruiter: true,
    },
    {
      userName: "John Doe",
      email: "johnDoe@gmail.com",
      password: bcrypt.hashSync("123123"),
      isRecruiter: true,
    },
  ],
  candidates: [
    {
      slug: "jane-doe",
      candidateName: "Jane Doe",
      candidateEmail: "janeDoe@gmail.com",
      title: "FullStack",
      candidateInterviews: [
        { description: "Primeira Entrevista: Correu muito bem!" },
      ],
    },
  ],
};
export default data;
