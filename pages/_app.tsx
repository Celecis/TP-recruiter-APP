import React from "react";
import { AppProps } from "next/app";

import { SnackbarProvider } from "notistack";
import { StoreProvider } from "../utils/store";
import { ThemeProvider } from "styled-components";
import theme from "../src/styles/theme";

import GlobalStyle from "../src/styles/global";
import { CssBaseline } from "@mui/material";
import Layout from "../src/layout/layout";

type ComponentWithPageLayout = AppProps & {
  Component: AppProps["Component"] & {
    PageLayout?: React.ComponentType;
  };
};

const MyApp: React.FC<AppProps> = ({
  Component,
  pageProps,
}: ComponentWithPageLayout) => {
  return (
    <SnackbarProvider
      hideIconVariant
      preventDuplicate
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <StoreProvider>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <CssBaseline />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </StoreProvider>
    </SnackbarProvider>
  );
};

export default MyApp;
