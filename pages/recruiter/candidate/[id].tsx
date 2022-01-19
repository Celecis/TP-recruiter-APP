/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useContext } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import { Store } from "../../../utils/store";
import { useRouter } from "next/router";
import { getError } from "../../../utils/error";
import { Controller, useForm } from "react-hook-form";
import { Grid, List, ListItem, Button, TextField, Link } from "@mui/material";
import NextLink from "next/link";
import db from "../../../utils/db";
import Candidate from "../../../src/models/candidateModel";

export default function CreateCandidate({ candidate, candidateId }: any) {
  const { state } = useContext(Store);

  console.log("Candidate vindo depois do SSP:", candidate);
  console.log("ID vindo do getServerSideProps:", candidateId);

  type FormData = {
    _id: string;
    candidateName: string;
    candidateEmail: string;
    title: string;
    files: string;
    slug: string;
    interviewDescription: string;
  };

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const { userInfo } = state;

  useEffect((): any => {
    if (!userInfo) {
      return router.push("/login");
    } else {
      const fetchData = async () => {
        try {
          const { data } = await axios.get(`/api/candidates/${candidateId}`, {
            headers: {
              authorization: `Bearer ${userInfo.token}`,
            },
          });
          setValue("candidateName", data.candidateName);
          setValue("candidateEmail", data.candidateEmail);
          setValue("title", data.title);
          setValue("files", data.files);
          setValue("slug", data.slug);
        } catch (error: string | any) {
          console.log("Erro a buscar info para editar candidato");
        }
      };
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //UPLOAD PHOTO
  const uploadHandler = async (e: any) => {
    const file = e.target.files[0];

    const bodyFormData = new FormData();
    bodyFormData.append("file", file);

    try {
      const { data } = await axios.post("/utils/upload", bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      setValue("files", data.secure_url);

      enqueueSnackbar("Ficheiro submetido com sucesso", {
        variant: "success",
        autoHideDuration: 3000,
      });
    } catch (error: string | any) {
      enqueueSnackbar(getError(error), {
        variant: "error",
        autoHideDuration: 3000,
      });
    }
  };

  //UPDATE CANDIDATE
  const submitHandler = async ({
    _id,
    candidateName,
    candidateEmail,
    title,
    files,
    slug,
    interviewDescription,
  }: {
    _id: any;
    candidateName: any;
    candidateEmail: any;
    title: any;
    files: any;
    slug: any;
    interviewDescription: any;
  }) => {
    closeSnackbar();

    try {
      await axios.put(
        `/api/recruiter/candidates/${candidateId}`,
        {
          _id,
          candidateName,
          candidateEmail,
          title,
          files,
          slug,
          interviewDescription,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      enqueueSnackbar("Candidato actualizado com sucesso", {
        variant: "success",
      });
      router.push(`/recruiter/candidate/${candidateId}`);
      //console.log(image);
    } catch (error: string | any) {
      enqueueSnackbar(getError(error), { variant: "error" });
    }
  };

  //DELETE CANDIDATE
  const deleteHandler = async (candidateDelete: string) => {
    if (
      !window.confirm(
        "Tem a certeza que pretende apagar o perfil do Candidato?"
      )
    ) {
      return;
    }
    try {
      await axios.delete(`/api/recruiter/candidates/${candidateDelete}`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      enqueueSnackbar("Candidato apagado com sucesso", {
        variant: "success",
      });
      router.push(`/digital-secretary`);
    } catch (error: string | any) {
      enqueueSnackbar(getError(error), { variant: "error" });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(submitHandler)}>
        <List>
          <ListItem>
            <Controller
              name="candidateName"
              control={control}
              defaultValue=""
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="candidateName"
                  label="Nome do Candidato"
                  error={Boolean(errors.candidateName)}
                  helperText={
                    errors.candidateName
                      ? "Nome do Candidato é obrigatório"
                      : ""
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>

          <ListItem>
            <Controller
              name="candidateEmail"
              control={control}
              defaultValue=""
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="candidateEmail"
                  label="Email do Candidato"
                  error={Boolean(errors.candidateEmail)}
                  helperText={
                    errors.candidateEmail
                      ? "Email do Candidato é obrigatório"
                      : ""
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>

          <ListItem>
            <Controller
              name="slug"
              control={control}
              defaultValue=""
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="slug"
                  label="URL único do candidato"
                  error={Boolean(errors.slug)}
                  helperText={
                    errors.slug ? "Link do Candidato tem de ser único" : ""
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>

          <ListItem>
            <Controller
              name="title"
              control={control}
              defaultValue=""
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="title"
                  label="Cargo"
                  error={Boolean(errors.title)}
                  helperText={errors.title ? "Cargo é obrigatório" : ""}
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>

          <Grid container spacing={1}>
            <Grid item md={8} xs={12}>
              <ListItem>
                <Controller
                  name="files"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: false,
                  }}
                  render={({ field }) => (
                    <TextField
                      variant="outlined"
                      fullWidth
                      id="files"
                      label="Ficheiros"
                      error={Boolean(errors.files)}
                      helperText={errors.files ? "Image is required" : ""}
                      {...field}
                    ></TextField>
                  )}
                ></Controller>
              </ListItem>
            </Grid>
            <Grid item md={4} xs={12}>
              <ListItem>
                <Button variant="contained" component="label">
                  Enviar Ficheiro
                  <input type="file" onChange={uploadHandler} hidden />
                </Button>
              </ListItem>
            </Grid>
          </Grid>

          <ListItem>
            <Controller
              name="interviewDescription"
              control={control}
              defaultValue=""
              rules={{
                required: false,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="interviewDescription"
                  label="Entrevistas"
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>

          <ListItem>
            <Button variant="contained" type="submit" fullWidth color="primary">
              Update
            </Button>
          </ListItem>
        </List>
      </form>
      <Button
        onClick={() => deleteHandler(candidateId)}
        size="small"
        variant="contained"
      >
        Apagar
      </Button>
      <Button size="small" variant="contained">
        <NextLink href={`/candidate/${candidate.slug}`} passHref>
          <Link>Ver Perfil do Candidato</Link>
        </NextLink>
      </Button>
    </>
  );
}

/*export async function getServerSideProps({ params }) {
	console.log("Params:", params);
	return {
		props: { params },
	};
}*/

export async function getServerSideProps(context: { params: any }) {
  await db.connect();
  const { params } = context;
  const candidateSSPid = params.id;
  console.log("ID:", candidateSSPid);

  const candidate = await Candidate.findById(candidateSSPid).lean();
  console.log(candidate);

  await db.disconnect();
  return {
    props: {
      candidate: db.convertDocToObj(candidate),
      candidateId: candidateSSPid,
    },
  };
}
