/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect } from "react";

import { useRouter } from "next/router";
import { Store } from "../utils/store";
import CandidatesProfiles from "../components/candidatesProfiles";
import { Button, Grid, Typography } from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";
import { getError } from "../utils/error";
import Candidate from "../src/models/candidateModel";
import db from "../utils/db";

export default function DigitalSecretary(props: any) {
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const { candidates } = props;
  console.log(userInfo);

  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
    }
  }, []);

  const { enqueueSnackbar } = useSnackbar();

  //VANESSA: VAI CRIAR UMA PÁGINA COM UM ID ÚNICO
  //CREATE NEW CANDIDATE BUTTON
  const createHandler = async () => {
    try {
      const { data } = await axios.post(
        `/api/recruiter/candidates`,
        { userInfo },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      router.push(`/recruiter/candidate/${data.candidate._id}`);
      enqueueSnackbar("Candidato criado com sucesso", { variant: "success" });
    } catch (error: string | any) {
      enqueueSnackbar(getError(error), {
        variant: "error",
        autoHideDuration: 3000,
      });
    }
  };

  return (
    <>
      <Grid container>
        <Grid item xs={6}>
          <Typography component="h1" variant="h1">
            Candidatos
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Button onClick={createHandler} color="primary" variant="contained">
            Create
          </Button>
        </Grid>
        <CandidatesProfiles candidates={candidates} />
      </Grid>
    </>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const candidates = await Candidate.find({}).lean();
  await db.disconnect();
  return {
    props: {
      candidates: candidates.map(db.convertDocToObj),
    },
  };
}
