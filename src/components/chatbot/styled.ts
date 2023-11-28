import { Stack } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
const RootStyled = styled(Stack)(({ theme }) => ({
  display: "block",
  width: "100%",
  maxWidth: 300,
  position: "fixed",
  bottom: 0,
  right: 12,
  backgroundColor: theme.palette.background.paper,
  zIndex: 1000,
  //   padding: theme.spacing(2),
  borderRadius: "8px 8px 0 0",
  borderWidth: `1px 1px 0 1px`,
  borderStyle: "solid",
  borderColor: theme.palette.primary.main,
  "& .header": {
    padding: theme.spacing(1),
    borderBottom: "1px solid " + theme.palette.primary.main,
    background: theme.palette.primary.main,
    borderRadius: "6px 6px 0 0",
    "& .MuiTypography-root": {
      cursor: "pointer",
    },
    svg: {
      color: "#fff",
    },
  },
  "& .body": {
    padding: theme.spacing(1),
    height: 320,
    overflow: "auto",
    "& .pre-question": {
      background: alpha(theme.palette.primary.main, 0.4),
      padding: "4px 8px",
      borderRadius: 8,
      cursor: "pointer",
      "&:hover": {
        opacity: "0.8",
      },
    },
  },
  "& .action": {
    padding: theme.spacing(1),
    "& .MuiInputBase-root": {
      paddingRight: 4,
    },
  },
  "& .cursor-blink": {
    opacity: 1,
    color: theme.palette.text.primary,
    animation: "cursor-blink 1s steps(2) infinite",
  },
  "@keyframes cursor-blink": {
    "0%": {
      opacity: 0,
    },
  },
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));
export default RootStyled;
