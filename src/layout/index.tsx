import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
// material
import { Fab, Box } from "@mui/material";

import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import SettingsIcon from "@mui/icons-material/Settings";
// redux
// ----------------------------------------------------------------------

const Settings = dynamic(() => import("src/components/settings"), {
  ssr: false,
});

// import NoInternet from "src/components/noInternet";
import MainNavbar from "./mainAppbar";
import TopNavbar from "./topNavbar";
import NewsLetter from "./footer/newsletter";
// import { getDirection } from "src/hooks/getDirection";
import { useRouter } from "next/router";
import RootStyled from "./styled";
import { useCycle } from "framer-motion";

const MobileAppbar = dynamic(() => import("./mobileAppbar"));
const Footer = dynamic(() => import("./footer"));
export default function MainLayout({ ...props }) {
  const { children } = props;
  const [isOnline, setIsOnline] = useState(true);
  const { locale } = useRouter();

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const checkIsOnline =
    typeof window !== "undefined" ? !window.navigator.onLine : null;
  useEffect(() => {
    if (checkIsOnline) {
      setIsOnline(false);
    } else {
      setIsOnline(true);
    }
  }, [checkIsOnline]);

  // if (!isOnline) {
  //   return <NoInternet />;
  // }
  const [isOpen, toggleOpen] = useCycle(false, true);

  return (
    <RootStyled>
      <TopNavbar />
      <MainNavbar />
      <MobileAppbar />
      {
        /* 
        dt.20-june-23 
        commented because not in scope
        <Box className="layout-main">
        <Fab
          onClick={() => toggleOpen()}
          color="primary"
          size="small"
          aria-label="language"
        >
          <SettingsIcon />
        </Fab>
      </Box> 
      */}
      <Settings isOpen={isOpen} toggleOpen={() => toggleOpen()} />
      <Box className="layout-children">{children}</Box>
      <Box className="children-height" />
      <Link
        href={`https://wa.me/${process.env.WHATSAPP_NUMBER}`}
        target="_blank"
      >
        <Fab className={`fab-btn`} color="default" aria-label="whats-app">
          <WhatsAppIcon />
        </Fab>
      </Link>
      <Box
        sx={{
          display: {
            md: "block",
            xs: "none",
          },
        }}
      >
        {
          /*
            dt.19-jun-2023 commented  
            <NewsLetter />
          */
        }
        <Footer />
      </Box>
    </RootStyled>
  );
}
