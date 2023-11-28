import { styled } from "@mui/material/styles";
const RootStyled = styled('div')(({ theme }) => ({
     height: 460,
     overflow: "auto",
     "& .MuiListItemAvatar-root": { marginTop: 0 },
     "& .circular-skeleton": {
          marginRight: theme.spacing(0.5),
     },
     [theme.breakpoints.down("md")]: {
          height: 400,
     },
     [theme.breakpoints.down("sm")]: {
          height: 340,
     },
}));
export default RootStyled;