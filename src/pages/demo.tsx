import React from "react";
import Image from "next/image";
import Head from "next/head";
import { Grid, Container, Box, Card, Typography, Button } from "@mui/material";
import { useRouter } from "next/router";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Logo from "src/components/logo";
import DashboardImage from "../../public/images/dashboard-commercehope.png";
import ClientImage from "../../public/images/commercehope-client-app.png";

export default function LivePreview() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Live Preview | COMMERCEHOPE</title>
        <meta charSet="utf-8" />
        <meta name="twitter:card" content="app" />
        <meta name="twitter:site" content="https://www.commercehope.com/" />
        <meta name="twitter:creator" content="@handle" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_IE" />
        <meta property="og:site_name" content="COMMERCEHOPE" />
        <title>COMMERCEHOPE Open Source Reactjs Ecommerce script</title>
        <meta
          name="robots"
          content="index,follow,nosnippet,max-snippet:-1,max-image-preview:none,noarchive,noimageindex,max-video-preview:-1,notranslate"
        />
        <meta
          name="description"
          content="COMMERCEHOPE is a leading open source reactjs ecommerce script based on Nextjs and Mongodb that can be used to sell your products online"
        />
        <meta
          property="og:title"
          content="COMMERCEHOPE Open Source Reactjs Ecommerce script"
        />
      </Head>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          sx={{
            boxShadow: "none",
            bgcolor: "transparent",
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            "& .MuiToolbar-root": {
              minHeight: "66px",
            },
          }}
        >
          <Toolbar>
            <Logo isMobile={true} />

            <Box ml="auto">
              <Button onClick={() => router.push("/demo")} color="primary">
                Home
              </Button>
              <Button
                onClick={() =>
                  window.open(
                    "https://documentations.commercehope.com/",
                    "_ blank"
                  )
                }
                sx={{
                  color: "text.primary",
                }}
              >
                Documentation
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>

      <Container>
        <Typography
          variant="h2"
          color="text.primary"
          my={4}
          sx={{ textAlign: "center" }}
        >
          Live Preview
        </Typography>
        <Grid container spacing={2}>
          <Grid item md={6} xs={12}>
            <Card sx={{ textAlign: "center", p: 3 }}>
              <Box
                position="relative"
                sx={{
                  width: 300,
                  height: 200,
                  mx: "auto",
                }}
              >
                <Image
                  src={ClientImage}
                  alt="commercehope app esktop"
                  layout="fill"
                  objectFit="cover"
                />
              </Box>
              <Typography variant="h3" color="text.primary">
                Front-end
              </Typography>
              <Typography variant="body1" color="text.secondary">
                The Front-end Application is designed for users to buy products
                online.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{ my: 2 }}
                onClick={() => router.push("/")}
              >
                View Demo
              </Button>
            </Card>
          </Grid>
          <Grid item md={6} xs={12}>
            <Card sx={{ textAlign: "center", p: 3, mb: 5 }}>
              <Box
                position="relative"
                sx={{
                  width: 300,
                  height: 200,
                  mx: "auto",
                }}
              >
                <Image
                  src={DashboardImage}
                  alt="commercehope app esktop"
                  layout="fill"
                  objectFit="cover"
                />
              </Box>
              <Typography variant="h3" color="text.primary">
                Admin Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary">
                The Admin Dashboard is Designed for the admin to manage products
                and sales.
              </Typography>
              <a
                href="https://e-cosmetics-admin.vercel.app"
                target="_blank"
                style={{ textDecoration: "none" }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ my: 2 }}
                >
                  View Demo
                </Button>
              </a>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
