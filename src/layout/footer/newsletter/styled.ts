import { styled } from "@mui/material/styles";
const RootStyled = styled("div")(({ theme }) => ({
  "& .container-fixed": {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  "& .newsletter-main": {
    background: theme.palette.background.paper,
    textAlign: "center",
    border: `1px solid ${theme.palette.divider}`,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    borderRadius: "8px",
    h3: {
      textTransform: "uppercase",
    },
    "& .newsletter-form": {
      maxWidth: 500,
      marginLeft: "auto",
      marginRight: "auto",
      width: "100%",
      marginTop: theme.spacing(3),
    },
    "& .newsletter-textfield": {
      "& .MuiInputBase-root": {
        maxHeight: 48,
        background: theme.palette.background.paper,
        "& .MuiInputBase-input::placeholder": {
          color: theme.palette.text.secondary,
        },
      },
    },
    input: {
      color: theme.palette.text.primary,
      "&::placeholder": {
        color: theme.palette.text.primary,
      },
    },
    "& .MuiFormHelperText-root": {
      color: theme.palette.text.primary + "!important",
    },
    "& .MuiOutlinedInput-root": {
      paddingRight: theme.spacing(0.6),
      "&.Mui-error": {
        color: theme.palette.text.primary,
        "& fieldset": {
          borderColor: theme.palette.text.primary,
        },
      },
      "& fieldset": {
        borderColor: theme.palette.text.primary,
      },
      "&:hover fieldset": {
        borderColor: theme.palette.text.primary,
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.text.primary,
      },
    },
  },
}));
export default RootStyled;
