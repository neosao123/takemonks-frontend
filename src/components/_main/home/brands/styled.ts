import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

const RootStyled = styled(Box)(({ theme }) => ({
  "& .description": {
    textTransform: "capitalize",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(5),
  },
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));
export default RootStyled;
