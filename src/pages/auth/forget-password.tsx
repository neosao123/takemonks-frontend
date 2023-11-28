// next
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import React, { useState, useEffect } from "react";
import LockIcon from "@mui/icons-material/Lock";
import RemoveRedEyeRoundedIcon from "@mui/icons-material/RemoveRedEyeRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
// material
import {
  Box,
  Button,
  Container,
  Typography,
  TextField,
  Card,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
// components
const ForgetPasswordForm = dynamic(
  () => import("src/components/_main/auth/forgetPasswordForm")
);
import { GuestGuard } from "src/guards";
// api
import * as api from "src/services";
import * as Yup from "yup";
// react query
import { useMutation } from "react-query";
import { toast } from "react-hot-toast";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function ResetPassword() {
  const router = useRouter();
  const { t } = useTranslation("forget-password");
  const [email, setEmail] = useState("");
  const [dataEmail, setdataEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setloading] = useState(false);
  const [openOtp, setOpenOtp] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [openChangePass, setChangePass] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    let timer: any;
    if (openOtp) {
      timer = setTimeout(() => {
        setOpenOtp(false);
      }, 600000);
    }

    // Clear the timer when the component unmounts or when the dialog is closed
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [openOtp]);
  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };
  const ChangePassWordSchema = Yup.object().shape({
    newPassword: Yup.string()
      .min(6, "Password must be between 6 and 16 characters")
      .max(16, "Password must be between 6 and 16 characters")
      .required("New Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords must match")
      .required("New Password is required"),
  });

  const { mutate } = useMutation(api.forgetPassword, {
    onSuccess: (err) => {
      setloading(false);
      setOpenOtp(true);
      toast.success(t("common:resent-email"));
    },
    onError: (err: any) => {
      const message = JSON.stringify(err.response.data.message);
      setloading(false);
      toast.error(
        message ? t(JSON.parse(message)) : t("common:something-wrong")
      );
    },
  });
  const handleChangePassword = async () => {
    if (newPassword.length === 0 || confirmPassword.length === 0) {
      toast.error("Both fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match. Please try again.");
      return;
    }

    try {
      const payl = { pass: newPassword, email: dataEmail };
      const changedPass = await api.updateUserPass(payl);
      if (changedPass.success) {
        toast.success("Password updated successfully!");
        router.push("/auth/login");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating password. Please try again.");
    }
  };
  const isApplyButtonDisabled = otpValue.length !== 6;
  const handleOtpApply = async () => {
    if (otpValue && dataEmail) {
      const payload = {
        otp: otpValue,
        email: dataEmail,
      };

      try {
        const response = await api.validOtp(payload);

        if (response.success) {
          toast.success("OTP is valid");
          setOpenOtp(false);
          setChangePass(true);
        } else {
          toast.error("Invalid OTP. Please try again.");
        }
      } catch (error) {
        // Handle API error if any
        console.error(error);
        toast.error("Error validating OTP. Please try again.");
      }
    }
  };
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
            {t("TakeMonks")}
          </Typography>
          <Typography
            textAlign="center"
            variant="body1"
            lineHeight={0.9}
            color="primary.contrastText"
          >
            {/* {t("slogan")} */}
          </Typography>
        </Box>
        <Container>
          <Card className="password-card">
            {!sent ? (
              <>
                <Typography variant="h3" textAlign="center" paragraph>
                  {t("forget-password")}
                </Typography>
                <Typography color="text.secondary" mb={5} textAlign="center">
                  {t("description")}
                </Typography>
                <ForgetPasswordForm
                  onSent={() => setSent(true)}
                  setOpenOtp={setOpenOtp}
                  setdataEmail={setdataEmail}
                  onGetEmail={(value: any) => setEmail(value)}
                  t={t}
                />
                <Button
                  fullWidth
                  size="large"
                  onClick={() => router.push("/auth/login")}
                  className="full-width-btn"
                >
                  {t("back")}
                </Button>
              </>
            ) : (
              <Box textAlign="center">
                {/* <SentIcon sx={{ mb: 5, mx: 'auto', height: 160 }} /> */}
                {openOtp && (
                  <Dialog open={openOtp}>
                    <DialogTitle>Enter OTP</DialogTitle>
                    <DialogContent>
                      <TextField
                        autoFocus
                        margin="dense"
                        label="OTP"
                        fullWidth
                        value={otpValue}
                        onChange={(e) => setOtpValue(e.target.value)}
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => setOpenOtp(false)} color="primary">
                        Cancel
                      </Button>
                      <Button onClick={handleOtpApply} color="primary"   disabled={isApplyButtonDisabled}> 
                        Apply
                      </Button>
                    </DialogActions>
                  </Dialog>
                )}
                {openChangePass && (
                  <>
                    <TextField
                      fullWidth
                      margin="dense"
                      label="New Password"
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleShowPassword} edge="end">
                              {showPassword ? (
                                <RemoveRedEyeRoundedIcon />
                              ) : (
                                <VisibilityOffRoundedIcon />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      // onChange={(e) => setNewPassword(e.target.value)}
                      onChange={(e: any) => {
                        const inputValue = e.target.value;
                        if (inputValue.length >= 6 && inputValue.length <= 16) {
                          setNewPassword(inputValue);
                          setError("");
                        } else {
                          setNewPassword(inputValue); // Still update the state to show the input value
                          setError(
                            "Password must be between 6 and 16 characters."
                          );
                        }
                      }}
                      helperText={error} // Display the error message as helper text
                      error={!!error}
                    />
                    <TextField
                      fullWidth
                      margin="dense"
                      label="Confirm Password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      // onChange={handleConfirmPasswordChange}
                    />
                    <Button
                      onClick={handleChangePassword}
                      variant="contained"
                      color="primary"
                    >
                      Change Password
                    </Button>
                  </>
                )}

                {!openChangePass && (
                  <>
                    <Typography variant="h3" gutterBottom>
                      {t("request-send")}
                    </Typography>
                    <Typography mb={5}>
                      {t("sent-to")} &nbsp;<strong>{dataEmail}</strong>.
                      <br />
                    </Typography>
                    <LoadingButton
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                      loading={loading}
                      onClick={() => mutate(dataEmail)}
                    >
                      {t("resend")}
                    </LoadingButton>
                  </>
                )}
                <Button
                  size="large"
                  fullWidth
                  onClick={() => router.push("/auth/login")}
                  className="full-width-btn"
                >
                  {t("back")}
                </Button>
              </Box>
            )}
          </Card>
        </Container>
      </Box>
    </GuestGuard>
  );
}
