import { Grid } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";

const RootStyled = styled(Grid)(({ theme }) => ({
  "& .card": {
    position: "relative",
    height: "100%",
    padding: theme.spacing(2),
    textAlign: "center",

    // backgroundColor: alpha(
    //   theme.palette.primary.main,
    //   theme.palette.mode === "light" ? 0.03 : 0.1
    // ),
  },
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));
export default RootStyled;
