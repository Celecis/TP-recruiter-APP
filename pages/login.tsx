import React, { useContext, useEffect } from "react";

import { FormikProps, useFormik } from "formik";
import * as Yup from "yup";
import {
  Button,
  Grid,
  Link,
  Container,
  Typography,
  TextField,
} from "@mui/material";
import axios from "axios";
import { Store } from "../utils/store";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

import { useSnackbar } from "notistack";
import { getError } from "../utils/error";

interface MyFormValues {
  email: string;
  password: string;
}

const validationSchema = Yup.object({
  email: Yup.string()
    .required("É necessário um email.")
    .email("Insira um email válido"),

  password: Yup.string()
    .required("É necessário uma senha")
    .min(6, "É necessário um mínimo de 6 caracteres")
    .max(20, "É necessário um máximo de 20 caracteres"),
});

function Login() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    if (userInfo) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formik: FormikProps<MyFormValues> = useFormik<MyFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      closeSnackbar();
      try {
        const { data } = await axios.post("/api/users/login", {
          email: values.email,
          password: values.password,
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
              ENTRAR
            </Typography>
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
            <Button
              color="secondary"
              variant="contained"
              fullWidth
              type="submit"
              size="small"
            >
              Entrar
            </Button>
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <br />
              <Link href="/forget-password" variant="body2" color="secondary">
                Esqueceu a senha?
              </Link>
            </Grid>
            <Grid item xs={12}>
              <Link href="/register" variant="body2" color="secondary">
                {"Não tem uma conta? REGISTAR"}
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </form>
  );
}

export default Login;
