/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/indent */
import React, { useContext, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Grid, Container, Typography, TextField } from "@mui/material";
import { useSnackbar } from "notistack";
import { getError, getSuccess } from "../utils/error";
import axios from "axios";
import { Store } from "../utils/store";
import { useRouter } from "next/router";

const validationSchema = Yup.object({
  password: Yup.string()
    .required("É necessário uma senha")
    .min(6, "É necessário um mínimo de 6 caracteres")
    .max(20, "É necessário um máximo de 20 caracteres"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "As senhas precisam ser iguais")
    .required("É necessário confirmar a senha"),
});

function ResetPassword() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    if (userInfo) {
      router.push("/dashboard");
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      _id: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      closeSnackbar();

      try {
        const { data } = await axios.post(
          `/api/users/resetpassword/${router.query.token}`,
          {
            _id: values._id,
            password: values.password,
            confirmPassword: values.confirmPassword,
          }
        );
        enqueueSnackbar(getSuccess(data), {
          variant: "success",
          autoHideDuration: 3000,
        }),
          router.push("/login");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: string | any) {
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
              ALTERAR SENHA
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              color="secondary"
              id="password"
              name="password"
              label="Senha"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              color="secondary"
              id="confirmPassword"
              name="confirmPassword"
              label="Confirme a senha"
              type="password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              error={
                formik.touched.confirmPassword &&
                Boolean(formik.errors.confirmPassword)
              }
              helperText={
                formik.touched.confirmPassword && formik.errors.confirmPassword
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              color="secondary"
              variant="contained"
              fullWidth
              type="submit"
            >
              Confirmar
            </Button>
          </Grid>
        </Grid>
      </Container>
    </form>
  );
}

export default ResetPassword;
