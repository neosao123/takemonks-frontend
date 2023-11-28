import React from "react";

// next
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";

// material
import { Box, Button, Container, Typography, Card } from "@mui/material";

// guest guard
import { GuestGuard } from "src/guards";

// components
const ResetPasswordForm = dynamic(
  () => import("src/components/_main/auth/resetPasswordForm")
);
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function ResetPassword() {
  const router = useRouter();
  const { t } = useTranslation("reset-password");
  return (
    <GuestGuard>
      <Box className="auth-pages">
        <Box className="gradient">
          <Typography
            textAlign="center"
            variant="h3"
            fontWeight={300}
            lineHeight={0.7}
            color="primary.contrastText"
          >
            {t("welcome")}
          </Typography>
          <Typography
            textAlign="center"
            variant="h2"
            color="primary.contrastText"
            className="company-name"
          >
            {t("company")}
          </Typography>
          <Typography
            textAlign="center"
            variant="body1"
            lineHeight={0.9}
            color="primary.contrastText"
          >
            {t("slogan")}
          </Typography>
        </Box>
        <Container>
          <Card className="password-card">
            <>
              <Typography textAlign="center" mb={1} variant="h4" gutterBottom>
                {t("reset-password")}
              </Typography>
              <Typography
                color="text.secondary"
                mb={5}
                textAlign="center"
                lineHeight={0.9}
              >
                {t("update")}
              </Typography>
              <ResetPasswordForm t={t} />
              <Button
                fullWidth
                size="large"
                onClick={() => router.push("/auth/login")}
                className="full-width-btn"
              >
                {t("back")}
              </Button>
            </>
          </Card>
        </Container>
      </Box>
    </GuestGuard>
  );
}
