import React, { useContext, useEffect } from "react";
import { Button, Link, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { Store } from "../utils/store";

const Home: React.FC = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const router = useRouter();

  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main>
      <h1>Bem vindo</h1>
      {userInfo?.isRecruiter === true ? (
        <Link href="/digital-secretary">
          <Button variant="contained">Secretario Digital</Button>
        </Link>
      ) : (
        <Typography>Não tem autorização</Typography>
      )}
    </main>
  );
};

export default Home;
