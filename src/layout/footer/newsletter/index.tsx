import React from "react";
import * as Yup from "yup";
// react query
import { useMutation } from "react-query";
// formik
import { Form, FormikProvider, useFormik } from "formik";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import LoadingButton from "@mui/lab/LoadingButton";
import Container from "@mui/material/Container";
// api
import * as api from "src/services";
// notification
import useTranslation from "next-translate/useTranslation";
import { toast } from "react-hot-toast";
import RootStyled from "./styled";

export default function NewsLetter() {
  const [loading, setloading] = React.useState(false);
  const { t } = useTranslation("common");

  const ChangePassWordSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email must be a valid email address")
      .required(t("footer.email-required")),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: ChangePassWordSchema,
    onSubmit: async (values) => {
      setloading(true);
      mutate(values);
    },
  });

  const { mutate } = useMutation(api.sendNewsletter, {
    onSuccess: (data) => {
      toast.success(t(data.message));

      setloading(false);
      formik.resetForm();
    },
    onError: (err: any) => {
      setloading(false);
      toast.error(t(err.message));
    },
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  return (
    <RootStyled>
      <Container fixed className="container-fixed">
        <FormikProvider value={formik}>
          <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <Stack className="newsletter-main">
              <Typography variant="h3" color="primary" textAlign="center">
                {t("footer.newsletter")}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.primary"
                textAlign="center"
                fontWeight={400}
              >
                {t("footer.update")}
              </Typography>
              <Stack
                spacing={2}
                direction="row"
                justifyContent="center"
                className="newsletter-form"
              >
                <TextField
                  id="newslatter"
                  fullWidth
                  placeholder={t("footer.enter-email")}
                  variant="outlined"
                  {...getFieldProps("email")}
                  error={Boolean(touched.email && errors.email)}
                  helperText={touched.email && errors.email}
                  className="newsletter-textfield"
                />
                <LoadingButton
                  loading={loading}
                  size="large"
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{
                    px: 4,
                    svg: {
                      color: "common.white",
                    },
                  }}
                >
                  {t("footer.subscribe")}
                </LoadingButton>
              </Stack>
            </Stack>
          </Form>
        </FormikProvider>
      </Container>
    </RootStyled>
  );
}
