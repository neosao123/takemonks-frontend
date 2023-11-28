import React from "react";
// next
import { useRouter } from "next/router";
// components
import { paramCase } from "change-case";
import RootStyled from "./styled";
// material
import { Box, ListSubheader, ListItem, Skeleton } from "@mui/material";

function IconBullet({ type = "item" }) {
  return (
    <Box className="icon-bullet-main">
      <Box
        component="span"
        className={`icon-bullet-inner ${type !== "item" && "active"}`}
      />
    </Box>
  );
}

export default function MenuDesktopList({ ...props }) {
  const { isLoading, list, onClose } = props;
  const router = useRouter();
  return (
    <RootStyled disablePadding>
      <ListSubheader
        style={{ marginLeft: "5vh" }}
        disableSticky
        disableGutters
        className="list-subheader"
      >
        {isLoading ? (
          <Skeleton
            variant="circular"
            width={16}
            className="circular-sekelton"
          />
        ) : (
          <IconBullet type="subheader" />
        )}
        {isLoading ? (
          <Skeleton variant="text" width={160} />
        ) : (
          list[0].parentCategory
        )}
      </ListSubheader>

      {(isLoading ? Array.from(new Array(3)) : list).map((item: any) => (
        <ListItem
          style={{ marginLeft: "5vh" }}
          key={Math.random()}
          className="list-item"
          onClick={() => {
            onClose();
            router.push(`/products?category=${paramCase(item?.name)}`);
          }}
        >
          {isLoading ? (
            <Skeleton
              variant="circular"
              width={16}
              className="circular-sekelton"
            />
          ) : (
            <IconBullet />
          )}
          {isLoading ? <Skeleton variant="text" width={160} /> : item?.name}
        </ListItem>
      ))}
    </RootStyled>
  );
}
