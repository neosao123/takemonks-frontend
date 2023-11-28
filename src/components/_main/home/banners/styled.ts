import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

const RootStyled = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  "& .banner-wrapper": {
    position: "relative",
    overflow: "hidden",
    width: "50%",
    borderRadius: "8px",
    bgcolor: "background.neutral",
    border: `1px solid ${theme.palette.divider}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    img: {
      borderRadius: "8px",
      boxShadow: theme.shadows[3],
      transition: "all 0.2s ease-in",
      transform: "scale(1)",
      "&:hover": {
        filter: "blur(2px)",
        transform: "scale(1.07)",
      },
    },
    "&:after": {
      content: `""`,
      display: "block",
      paddingBottom: "100%",
    },
    "&.second, &.third": {
      width: "100%",
      "&:after": {
        content: `""`,
        display: "block",
        paddingBottom: "48.5%",
      },
    },
    "&.third": {
      marginTop: theme.spacing(2),
    },
  },
  "& .second-wrapper": {
    width: "50%",
  },
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));
export default RootStyled;
