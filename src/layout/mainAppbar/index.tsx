// react
import React from "react";

// next
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

// material
import { Box, Toolbar, Skeleton, Stack, AppBar } from "@mui/material";
import MaintenanceIcon from "@mui/icons-material/Settings";
// redux
import { useSelector } from "src/redux/store";

// logo
import { LogoIconButton } from "src/components/logo";

// styles
import RootStyled from "./styled";

// config
import config from "../config.json";

const CartWidget = dynamic(() => import("src/components/cartWidget"), {
  loading: () => <Skeleton variant="circular" width={40} height={40} />,
});
const Notifications = dynamic(
  () => import("src/components/popover/notifications"),
  {
    loading: () => <Skeleton variant="circular" width={40} height={40} />,
  }
);
const WishlistPopover = dynamic(
  () => import("../../components/popover/wislist"),
  {
    loading: () => <Skeleton variant="circular" width={40} height={40} />,
  }
);
const Search = dynamic(() => import("src/components/searchDialog"), {
  loading: () => <Skeleton variant="circular" width={40} height={40} />,
});
const MenuDesktop = dynamic(() => import("./menuDesktop"), {
  loading: () => (
    <Stack direction="row">
      <Skeleton
        variant="rectangular"
        width={44}
        height={22}
        sx={{ borderRadius: "4px", mx: "6px" }}
      />
      <Skeleton
        variant="rectangular"
        width={96}
        height={22}
        sx={{ borderRadius: "4px", mx: "6px" }}
      />
      <Skeleton
        variant="rectangular"
        width={34.5}
        height={22}
        sx={{ borderRadius: "4px", mx: "6px" }}
      />
      <Skeleton
        variant="rectangular"
        width={54}
        height={22}
        sx={{ borderRadius: "4px", mx: "6px" }}
      />
      <Skeleton
        variant="rectangular"
        width={34}
        height={22}
        sx={{ borderRadius: "4px", mx: "6px" }}
      />
    </Stack>
  ),
});

// ----------------------------------------------------------------------

export default function MainNavbar() {
  const { menu } = config;
  const { pathname } = useRouter();
  const isHome: boolean = pathname === "/";
  const { checkout } = useSelector(({ product }: { product: any }) => product);
  return (
    <RootStyled position="sticky">
      <Toolbar disableGutters className="toolbar">
        <Stack width={167}>
          <LogoIconButton />
        </Stack>
        <MenuDesktop isHome={isHome} navConfig={menu} />
        <Box sx={{ display: "flex" }}>
          <Search />
          <CartWidget checkout={checkout} />
          <WishlistPopover />
          <Notifications />
        </Box>
      </Toolbar>
    </RootStyled>
  );
}
