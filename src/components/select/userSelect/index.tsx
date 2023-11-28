import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Typography, Divider, Stack } from "@mui/material";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { useSelector } from "react-redux";
import useTranslation from "next-translate/useTranslation";
import MenuPopover from "src/components/popover/popover";
import { useRouter } from "next/router";
import { PATH_PAGE } from "src/routes/paths";
import { UserList } from "src/components/lists";
import RootStyled from "./styled";

function getKeyByValue(object: any, value: any) {
  return Object.keys(object).find((key) => object[key] === value);
}

export default function UserSelect() {
  const router = useRouter();
  const isAuthPath = getKeyByValue(PATH_PAGE.auth, router.pathname);
  const isHomePath = router.pathname === "/";
  const { t } = useTranslation("common");
  const { isAuthenticated, user } = useSelector(
    ({ user }: { user: any }) => user
  );

  const anchorRef = React.useRef(null);
  const [openUser, setOpen] = React.useState(false);
  const [initialize, setInitialize] = useState(false);
  const handleOpenUser = () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    } else {
      setOpen(true);
    }
  };

  const handleCloseUser = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      setInitialize(true);
    } else {
      setInitialize(false);
    }
  }, [isAuthenticated]);

  return (
    <RootStyled>
      {!initialize ? (
        <Stack direction="row" gap={2}>
          <Typography
            href={`/auth/login${
              isAuthPath || isHomePath ? "" : `?redirect=${router.asPath}`
            }`}
            variant="body2"
            color="text.secondary"
            component={Link}
          >
            {t("header.login")}
          </Typography>

          <Divider orientation="vertical" flexItem />

          <Typography
            variant="body2"
            color="text.secondary"
            component={Link}
            href={`/auth/register${
              isAuthPath || isHomePath ? "" : `?redirect=${router.asPath}`
            }`}
          >
            {t("header.register")}
          </Typography>
        </Stack>
      ) : (
        <>
          <Typography
            variant="body2"
            color="text.secondary"
            className={`link-text ${openUser && "active"}`}
            ref={anchorRef}
            onClick={handleOpenUser}
          >
            {t("header.hi")}, {user?.fullName}{" "}
            <KeyboardArrowDownRoundedIcon sx={{ fontSize: 18 }} />
          </Typography>
          <MenuPopover
            open={openUser}
            onClose={handleCloseUser}
            anchorEl={anchorRef.current}
            sx={{
              width: 300,
            }}
          >
            <UserList
              openUser={openUser}
              user={user}
              setOpen={() => setOpen(false)}
              t={t}
            />
          </MenuPopover>
        </>
      )}
    </RootStyled>
  );
}
