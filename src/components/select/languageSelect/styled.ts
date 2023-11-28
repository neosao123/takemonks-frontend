import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
const RootStyled = styled(Paper)(({ theme }) => ({
  "& .select-text": {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    transition: "color 0.2s ease-in-out",
    "&:hover": {
      color: theme.palette.primary.main,
    },
    "&.active": {
      color: theme.palette.primary.main,
    },
  },
  "& .heading": {
    padding: theme.spacing(2, 2.5),
  },
  [theme.breakpoints.up("md")]: {
    "& .is-mobile": {
      display: "none",
    },
  },
  [theme.breakpoints.down("md")]: {
    "& .is-desktop": {
      display: "none",
    },
  },
}));
export default RootStyled;
