import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

const RootStyled = styled(Paper)(({ theme }) => ({
  display: "none",
  "& .back-button": {
    position: "absolute",
    left: 0,
    svg: {
      transform: theme.direction === "rtl" ? "rotate(180deg)" : "rotate(0deg)",
    },
  },
  "& .stack": {
    position: "relative",
  },
  "& .heading": {
    textAlign: "center",
    marginTop: theme.spacing(4),
  },
  "& .description": {
    textTransform: "capitalize",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(4),
  },
  [theme.breakpoints.down("md")]: {
    display: "block",
  },
}));
export default RootStyled;
