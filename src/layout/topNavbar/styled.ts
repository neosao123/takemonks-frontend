import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
const RootStyled = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(0.5, 3),

  display: "flex",
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));
export default RootStyled;
