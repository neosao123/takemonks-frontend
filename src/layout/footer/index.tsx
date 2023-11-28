// react
import React from "react";

// next
import Link from "next/link";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";

// material
import {
  Box,
  Grid,
  Typography,
  Container,
  Stack,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
} from "@mui/material";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";

// styles
import RootStyled from "./styled";

// logo
import Logo from "src/components/logo";

// social icons
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import PinterestIcon from "@mui/icons-material/Pinterest";

// config
import config from "../config.json";

const getSocialIcon = (name: string) => {
  switch (name) {
    case "Facebook":
      return <FacebookIcon />;
    case "Instagram":
      return <InstagramIcon />;

    case "Linkedin":
      return <LinkedInIcon />;

    default:
      return <PinterestIcon />;
  }
};
export default function Footer() {
  const { footer_links, company, social } = config;
  const router = useRouter();
  const { t } = useTranslation("common");
  return (
    <RootStyled>
      <Container>
        <Grid container spacing={3} className="grid-container">
          <Grid item lg={3} md={3} sm={6} xs={12}>
            <Box className="logo">
              <Logo />
            </Box>
            <Typography variant="body2" color="text.primary" mt={2}>
              {t("footer.address")}
            </Typography>
            <Typography
              href={`mailto:${company.email}`}
              target="_blank"
              component={Link}
              variant="body2"
              color="text.secondary"
              mt={2}
              mb={0.8}
              className="text-link"
            >
              <EmailRoundedIcon fontSize="small" /> {company.email}
            </Typography>
            <Typography
              href={`tel:${company.phone}`}
              component={Link}
              variant="body2"
              color="text.secondary"
              className="text-link"
            >
              <LocalPhoneRoundedIcon fontSize="small" /> {company.phone}
            </Typography>
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Grid container spacing={2}>
              {/* {footer_links.map((v) => (
                <Grid item md={4} xs={4} key={Math.random()}>
                  <Typography
                    variant="subtitle1"
                    color="text.primary"
                    mt={1}
                    mb={2}
                  >
                    {t(v.headline)}
                  </Typography>
                  <nav aria-label="secondary mailbox folders">
                    <List>
                      {v.children.map((val) => (
                        <ListItem disablePadding dense key={Math.random()}>
                          <ListItemButton
                            component="a"
                            href={val.href}
                            className="list-button"
                          >
                            <ListItemText primary={t(val.name)} />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </nav>
                </Grid>
              ))} */}
            </Grid>
          </Grid>
          <Grid item lg={3} md={3} sm={6} xs={12}>
            <Typography
              variant="subtitle1"
              color="text.primary"
              mt={1}
              mb={2.5}
            >
              {t("footer.follow-us")}
            </Typography>
            <Stack spacing={1} direction="row" className="social-main">
              {social.map((social) => (
                <IconButton
                  key={Math.random()}
                  sx={{ color: social.color }}
                  onClick={() => router.push(social.href)}
                >
                  {getSocialIcon(social.name)}
                </IconButton>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </RootStyled>
  );
}
