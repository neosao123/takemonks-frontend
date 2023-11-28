import { Box, Skeleton, Typography } from "@mui/material";
import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function secondarySlider({ ...props }) {
  const { data } = props;
  const isEmpty = !data;

  return (
    <>
      <Box
        key={Math.random()}
        sx={{
          mt: 3,
          // height: { md: 416, xs: 300 },
          borderRadius: "8px",
          border: (theme) => `1px solid ${theme.palette.divider}`,
          position: "relative",
          width: "100%",
          overflow: "hidden",
          bgcolor: "background.neutral",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          img: {
            boxShadow: (theme) => theme.shadows[3],
            transition: "all 0.2s ease-in",
            transform: "scale(1)",
            "&:hover": {
              filter: "blur(2px)",
              transform: "scale(1.07)",
            },
          },
          "&:after": {
            content: `""`,
            display: "block",
            pb: { md: "40%", xs: "50%" },
          },
        }}
      >
        {isEmpty ? (
          <Typography variant="h5" color="text.secondary">
            Banner is not uploaded yet!
          </Typography>
        ) : (
          <Link href={data?.centeredBanner.url || ""}>
            <Image
              src={data?.centeredBanner.cover.src}
              alt="centered-banner"
              layout="fill"
              objectFit="cover"
              placeholder="blur"
              blurDataURL={data?.centeredBanner.cover.blurDataURL}
            />
          </Link>
        )}
      </Box>
    </>
  );
}
