/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from "react";

import { FormikProps, useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Store } from "../utils/store";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useSnackbar } from "notistack";
import { getError } from "../utils/error";

import {
  Grid,
  Link,
  Container,
  Typography,
  TextField,
  Button,
} from "@mui/material";

interface MyFormValues {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  isRecruiter: boolean;
}

const validationSchema = Yup.object().shape({
  userName: Yup.string()
    .required("É necessario um nome de usuário")
    .max(100, "É aceite um máximo de 100 caracteres"),
  email: Yup.string()
    .required("É necessário um email.")
    .email("Insira um email válido"),
  password: Yup.string()
    .required("É necessário uma senha")
    .min(6, "É necessário um mínimo de 6 caracteres")
    .max(20, "É necessário um máximo de 20 caracteres"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "As senhas precisam ser iguais")
    .required("É necessário confirmar a senha"),
});

const Register = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    if (userInfo) {
      router.push("/");
    }
  }, []);

  const formik: FormikProps<MyFormValues> = useFormik<MyFormValues>({
    initialValues: {
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
      isRecruiter: true,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      closeSnackbar();
      try {
        const { data } = await axios.post("/api/users/register", {
          userName: values.userName,
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword,
          isRecruiter: values.isRecruiter,
          headers: {
            "Content-Type": "application/json",
          },
        });
        dispatch({ type: "USER_LOGIN", payload: data });
        Cookies.set("userInfo", JSON.stringify(data));
        router.push("/");
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
              REGISTAR
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="userName"
              name="userName"
              label="Nome de Usuário"
              value={formik.values.userName}
              onChange={formik.handleChange}
              error={formik.touched.userName && Boolean(formik.errors.userName)}
              helperText={formik.touched.userName && formik.errors.userName}
              color="secondary"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              color="secondary"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="password"
              name="password"
              label="Senha"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              color="secondary"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
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
              color="secondary"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              color="secondary"
              variant="contained"
              fullWidth
              type="submit"
              size="small"
            >
              Registar
            </Button>
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs>
              <br />
              <Link href="/login" variant="body2" color="secondary">
                {"Já tem uma conta? ENTRAR"}
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </form>
  );
};

export default Register;
