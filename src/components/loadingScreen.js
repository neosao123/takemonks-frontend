import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
// material
import { styled, useTheme } from "@mui/material/styles";
import { Typography } from "@mui/material";
import { createGradient } from "src/theme/palette.js";
// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  width: "100%",
  height: "100%",
  position: "fixed",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 100000,
  top: 2,
  backgroundColor: theme.palette.background.paper,
  "& .box": {
    width: 120,
    height: 120,
    borderRadius: "50%",
    background: createGradient(
      theme.palette.primary.main,
      theme.palette.primary.darker
    ),
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
  },
}));

// ----------------------------------------------------------------------

export default function LoadingScreen({ ...other }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);

    const handleComplete = () => setLoading(false);
    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  });

  if (loading) {
    return (
      <RootStyle {...other}>
        <motion.div
          className="box"
          animate={{
            scale: [1.2, 1.8, 1.8, 1.2, 1.2],
            rotate: [0, 0, 180, 180, 0],
            borderRadius: ["2%", "2%", "50%", "50%", "2%"],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            times: [0, 0.2, 0.5, 0.8, 1],
            repeat: Infinity,
            repeatDelay: 1,
          }}
        >
          <Typography variant="h6" color="primary.contrastText">
            LOADING
          </Typography>
        </motion.div>
      </RootStyle>
    );
  }
  return null;
}
