import { forwardRef } from "react";
import PropTypes from "prop-types";
// material
import Image from 'next/image';
import { useTheme } from "@mui/material/styles";
import { Box, Typography, Button, IconButton } from "@mui/material";
import { useRouter } from "next/router";
import takemonksLogo from "../assets/logo.png"

// ----------------------------------------------------------------------
// eslint-disable-next-line react/display-name
export const LogoIconButton = () => {
  const theme = useTheme();
  const { push } = useRouter();
  const PRIMARY_MAIN = theme.palette.primary.main;
  const TEXT_PRIMARY = theme.palette.text.primary;
  
  
  
  return (
    <Box
      sx={{
        tspan: {
          whiteSpace: "pre",
        },
        height: "auto",
        cursor: "pointer",
      }}
      onClick={() => push("/")}
    >
      <Image
        src={takemonksLogo}     
        alt={"Takemonks"}
        loading="lazy"
        style={{
          width: "100%",
          objectFit: "contain"
        }}
      />
    </Box>
  );
};

// eslint-disable-next-line react/display-name
const Logo = forwardRef(
  (
    { sx, isMobile, noText }: { sx?: any; isMobile?: any; noText?: any },
    ref: any
  ) => {
    const theme = useTheme();
    const { push } = useRouter();
    const PRIMARY_MAIN = theme.palette.primary.main;
    const TEXT_PRIMARY = theme.palette.text.primary;

    return (
      <Button variant="text" sx={{ ml: "-8px" }} onClick={() => push("/")}>
        <Box
          ref={ref}
          sx={{
            cursor: "pointer",
            tspan: {
              whiteSpace: "pre",
            },
            width: "150px",
            height: "auto",
            ...sx,
          }}
        >
          <Image
            src={takemonksLogo} 
            alt={"Takemonks"}
            loading="lazy"
            style={{
              width: "100%",
              objectFit: "contain"
            }}
          />
        </Box>
        
      </Button>
    );
  }
);
// eslint-disable-next-line react/display-name
Logo.propTypes = {
  sx: PropTypes.object,
};

export default Logo;
