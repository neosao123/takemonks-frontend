import React from "react";
// material
import { Badge, IconButton, Divider, Typography } from "@mui/material";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";

// components
import NotificationsList from "src/components/lists/notifications";
import MenuPopover from "src/components/popover/popover";
import useTranslation from "next-translate/useTranslation";
import { useSelector } from "react-redux";

// ----------------------------------------------------------------------
interface StateProps {
  notifications: null | [];
  loading: boolean;
}
export default function NotificationsPopover() {
  const anchorRef = React.useRef(null);
  const { t } = useTranslation("common");
  const { notifications } = useSelector(
    ({ notification }: { notification: any }) => notification
  );

  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState<StateProps>({
    notifications: null,
    loading: true,
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    setState({ notifications, loading: false });
  }, [notifications]);

  return (
    <>
      <IconButton
        ref={anchorRef}
        color={open ? "primary" : "default"}
        onClick={handleOpen}
      >
        <Badge
          showZero={false}
          badgeContent={(!state.loading && state.notifications?.length) || 0}
          color="error"
        >
          <NotificationsNoneRoundedIcon />
        </Badge>
      </IconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{
          width: 360,
        }}
      >
        <Typography variant="subtitle1" p={2}>
          {t("header.notifications")}
        </Typography>

        <Divider />
        {!state.loading && notifications?.length === 0 ? (
          <Typography variant="subtitle1" color="text.secondary" sx={{ p: 3 }}>
            {t("header.no-notificaton-found")}
          </Typography>
        ) : (
          <NotificationsList
            loading={state.loading}
            notifications={state.notifications}
            handleClose={handleClose}
          />
        )}
      </MenuPopover>
    </>
  );
}
