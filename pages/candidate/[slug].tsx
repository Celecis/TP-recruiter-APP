/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from "react";
import NextLink from "next/link";
import { Grid, Link, List, ListItem, Typography } from "@mui/material";

import Candidate from "../../src/models/candidateModel";
import db from "../../utils/db";

//VANESSA: SERVE APENAS PARA VER A INFO E DEPOIS EDITAR
export default function ViewCandidate(props: any) {
  const { candidate } = props;
  console.log(candidate);
  const interview = JSON.parse(candidate.candidateInterviews);
  console.log(interview);

  return (
    <>
      <Grid container spacing={4}>
        <Grid item md={6} xs={12}>
          <NextLink href="/digital-secretary" passHref>
            <Link>Back to Candidates</Link>
          </NextLink>
          <Grid item xs={12}>
            <List>
              <ListItem>
                <Typography component="h2" variant="h2">
                  {candidate.candidateName}
                </Typography>
              </ListItem>
              <NextLink href={`/recruiter/candidate/${candidate._id}`} passHref>
                <Link>Edit Candidate</Link>
              </NextLink>
              <ListItem>
                <Typography>Email: {candidate.candidateEmail}</Typography>
              </ListItem>
              <ListItem>
                <Typography> Title: {candidate.title}</Typography>
              </ListItem>
              <ListItem>
                <Typography> Files: </Typography>
                <NextLink href={candidate.files} passHref>
                  <Link>{candidate.files}</Link>
                </NextLink>
              </ListItem>
              <ListItem>
                {interview.map(
                  (
                    i: {
                      interviewDescription: string;
                    },
                    index: string
                  ) => (
                    <Typography key={index}>
                      {index + 1} {i.interviewDescription} <br />
                    </Typography>
                  )
                )}
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export async function getServerSideProps(context: any) {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  const candidate = await Candidate.findOne({ slug }).lean();

  await db.disconnect();
  return {
    props: {
      candidate: db.convertDocToObj(candidate),
    },
  };
}
