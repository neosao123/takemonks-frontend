import {
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Table,
  TableHead,
  Avatar,
  Button,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { Grid, Paper, Typography, Skeleton, Box, Stack } from "@mui/material";
const RootStyle = styled(Paper)(({ theme }) => ({
  padding: "10px 10px 10px 16px",
  marginBottom: "0.5rem",
  backgroundColor: theme.palette.background.paper,
  border: "1px solid " + theme.palette.divider,
  borderRadius: 4,
  "& .name": {
    fontWeight: 600,
    color: theme.palette.info.main,
  },
  "& .time svg": {
    width: 10,
    height: 10,
    "& path": {
      fill: theme.palette.text.primary,
    },
  },
  "& .date": {
    fontSize: "0.75rem",
    fontWeight: 500,
  },
  "& .callander": {
    "& svg": {
      width: 10,
      height: 10,
    },
  },
  "& .time-slot": {
    fontWeight: 500,
    fontSize: "0.75rem",
  },
  "& .phone-container": {
    display: "flex",
    alignItems: "center",
    justifyContent: "end",
    gap: "0.5rem",
    "& .phone": {
      color: theme.palette.text.secondary,
      fontWeight: 400,
      fontSize: 11,
    },
    "& .btn-phone": {
      fontSize: "1px",
    },
  },
}));
export default function CodeforMobile({ ...props }) {



    
}
