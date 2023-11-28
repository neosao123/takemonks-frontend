import React from "react";
import dynamic from "next/dynamic";
// material
import { Box, List, Typography } from "@mui/material";
// components
import { useSelector } from "react-redux";
import useTranslation from "next-translate/useTranslation";

const ListWishlist = dynamic(() => import("src/components/lists/wishlist"));

export default function Wishlist() {
  const { t } = useTranslation("common");
  const { wishlist } = useSelector(
    ({ wishlist }: { wishlist: any }) => wishlist
  );
  const isLoading = !wishlist;
  return (
    <div>
      <Box>
        <List disablePadding sx={{ "& .MuiListItemAvatar-root": { mt: 0 } }}>
          {!isLoading &&
            wishlist?.map((item: any, i: number) => (
              <ListWishlist
                isUser
                key={Math.random()}
                isLoading={isLoading}
                item={item}
                isLast={wishlist?.length - 1 === i}
                t={t}
                onClose={(e: any) => e.preventDefault()}
              />
            ))}
        </List>
      </Box>
      {!isLoading && wishlist?.length === 0 && (
        <Typography variant="subtitle1" color="text.primary" sx={{ p: 3 }}>
          {t("header.no-wishlist-found")}
        </Typography>
      )}
    </div>
  );
}
