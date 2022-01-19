import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import NextLink from "next/link";

//VANESSA: AQUI VAI MOSTRAR A LISTA DE TODOS OS CANDIDATOS REGISTADOS PELO RECRUTADOR
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DigitalSecretary(props: string | any) {
  return (
    <>
      <Grid container spacing={4} className="grid">
        {props.candidates.map(
          (candidate: {
            _id: React.Key | null | undefined;
            slug: string;
            candidateName:
              | boolean
              | React.ReactChild
              | React.ReactFragment
              | React.ReactPortal
              | null
              | undefined;
          }) => (
            <Grid item md={4} key={candidate._id}>
              <Card>
                <NextLink href={`candidate/${candidate.slug}`} passHref>
                  <CardActionArea>
                    <CardContent>
                      <Typography component="h2" variant="h2">
                        {candidate.candidateName}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </NextLink>
              </Card>
            </Grid>
          )
        )}
      </Grid>
    </>
  );
}
