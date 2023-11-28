// react
import React from "react";

// next
import Image from "next/image";
import Link from "next/link";

// material
import { Container, Stack, Box, Typography } from "@mui/material";

// style overrides
import RootStyled from "./styled";

export default function secondarySlider({ ...props }) {
  const { data } = props;
  const isEmpty = !data;

  return (
    <RootStyled>
      <Container>
        <Stack direction="row" gap={2} className="wrapper">
          <Box className="banner-wrapper first">
            {isEmpty ? (
              <Typography variant="h5" color="text.secondary">
                Banner is not uploaded yet!
              </Typography>
            ) : (
              <Link href={data?.bannerAfterSlider1 || ""}>
                <Image
                  src={data?.bannerAfterSlider1.cover.src}
                  alt="banner-1"
                  layout="fill"
                  objectFit="cover"
                  placeholder="blur"
                  blurDataURL={data?.bannerAfterSlider1.cover.blurDataURL}
                />
              </Link>
            )}
          </Box>
          <Box className="second-wrapper">
            <Box className="banner-wrapper second">
              {isEmpty ? (
                <Typography variant="h5" color="text.secondary">
                  Banner is not uploaded yet!
                </Typography>
              ) : (
                <Link href={data?.bannerAfterSlider2.url || ""}>
                  <Image
                    src={data?.bannerAfterSlider2.cover.src}
                    alt="banner-2"
                    layout="fill"
                    objectFit="cover"
                    placeholder="blur"
                    blurDataURL={data?.bannerAfterSlider2.cover.blurDataURL}
                  />
                </Link>
              )}
            </Box>
            <Box className="banner-wrapper third">
              {isEmpty ? (
                <Typography variant="h5" color="text.secondary">
                  Banner is not uploaded yet!
                </Typography>
              ) : (
                <Link href={data?.bannerAfterSlider3.url || ""}>
                  <Image
                    src={data?.bannerAfterSlider3.cover.src}
                    alt="banner-3"
                    layout="fill"
                    objectFit="cover"
                    placeholder="blur"
                    blurDataURL={data?.bannerAfterSlider3.cover.blurDataURL}
                  />
                </Link>
              )}
            </Box>
          </Box>
        </Stack>
      </Container>
    </RootStyled>
  );
}
