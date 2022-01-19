/* eslint-disable @typescript-eslint/indent */
import React, { useContext, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import { useSnackbar } from "notistack";
import { getError } from "../utils/error";
import axios from "axios";
import { Store } from "../utils/store";
import { useRouter } from "next/router";

import { Button, Grid, Container, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";

const validationSchema = Yup.object({
  email: Yup.string()
    .required("É necessário um email.")
    .email("Insira um email válido"),
});

function ForgetPassword() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();

  const { state } = useContext(Store);
  const { userInfo } = state;
  useEffect(() => {
    if (userInfo) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      closeSnackbar();
      try {
        const { data } = await axios.post("/api/users/forgetPassword", {
          email: values.email,
        });
        console.log(data);
        enqueueSnackbar(getError(data), {
          variant: "success",
          autoHideDuration: 3000,
        }),
          router.push("/login");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: string | unknown | any) {
        enqueueSnackbar(getError(error), {
          variant: "error",
          autoHideDuration: 3000,
        });
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} autoComplete="off">
      <Container maxWidth="xs">
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography variant="h5" color="secondary">
              RECUPERAR SENHA
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              color="secondary"
              id="email"
              name="email"
              label="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              color="secondary"
              variant="contained"
              fullWidth
              type="submit"
            >
              Recuperar Senha
            </Button>
          </Grid>
        </Grid>
      </Container>
    </form>
  );
}

export default ForgetPassword;
