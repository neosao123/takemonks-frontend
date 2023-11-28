import React from "react";
import { formatDistanceToNow } from "date-fns";
import RouterLink from "src/utils/link";
// material
import {
  Box,
  List,
  Link,
  Stack,
  ListItem,
  Skeleton,
  Divider,
  Typography,
  ListItemText,
  ListItemAvatar,
} from "@mui/material";
import { ar, enUS } from "date-fns/locale";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import RootStyled from "./styled";

const Notification = ({ ...props }) => {
  const { item, t } = props;
  const { locale } = useRouter();
 
  return (
    <>
      <Box p={2.5}>
        <ListItemText
          secondary={
            <React.Fragment>
              <Typography variant="subtitle1" color="text.primary">
                {item?.title}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {item.description}
              </Typography>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="body2" color="text.secondary">
                  {formatDistanceToNow(item.createdAt)}
                </Typography>
                <Link component={RouterLink} href={item.link}>
                  {t("header.read-more")}
                </Link>
              </Stack>
            </React.Fragment>
          }
        />
      </Box>
      <Divider component="li" />
    </>
  );
};

const SkeletonComponent = () => {
  return (
    <>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Skeleton variant="circular" width={40} height={40} />
        </ListItemAvatar>
        <ListItemText
          secondary={
            <React.Fragment>
              <Typography variant="body2" color="text.primary">
                <Skeleton variant="text" />
              </Typography>

              <Stack direction="row" alignItems="center">
                <Skeleton
                  variant="circular"
                  height={14}
                  width={14}
                  className="circular-skeleton"
                />
                <Typography variant="body2" color="text.secondary">
                  <Skeleton variant="text" width={140} />
                </Typography>
              </Stack>
            </React.Fragment>
          }
        />
      </ListItem>
      <Divider component="li" />
    </>
  );
};

export default function Notifications({ ...props }) {
  const { t } = useTranslation("common");
  const { loading, notifications, handleClose } = props;
  return (
    <RootStyled>
      <List disablePadding>
        {!loading &&
          notifications?.map((item: any) => (
            <Notification
              key={Math.random()}
              isLoading={loading}
              item={item}
              t={t}
              onClose={() => handleClose()}
            />
          ))}
        {(loading ? Array.from(new Array(7)) : []).map(() => (
          <SkeletonComponent key={Math.random()} />
        ))}
      </List>
    </RootStyled>
  );
}
