// next
import Image from "next/image";
import { useRouter } from "next/router";

// material
import {
  Card,
  Typography,
  CardActionArea,
  Skeleton,
  Box,
  Badge,
} from "@mui/material";

//  change case
import { paramCase } from "change-case";

// styles
import RootStyled from "./styled";
// ----------------------------------------------------------------------

export default function CategoriesCard({ ...props }) {
  const { category, isLoading, onClickCard, state, totalItems } = props;
  const baseUrl = "/products?category=";
  const router = useRouter();

  return (
    <RootStyled>
      <CardActionArea
        className="card-action-area"
        onClick={() => {
          state !== null
            ? router.push(`${baseUrl + paramCase(category.name)}`)
            : onClickCard();
        }}
      >
        <Box>
          {!isLoading && (
            <Badge
              className="badge"
              badgeContent={totalItems || category.totalItems || 0}
              color="primary"
            />
          )}
          {isLoading ? (
            <Skeleton variant="circular" width={70} height={70} />
          ) : (
            <Box className="image-wrapper">
              <Image
                alt="category"
                src={category?.cover?.url}
                layout="fill"
                objectFit="contain"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8r9a8CgAGKAJUJ+krTwAAAABJRU5ErkJggg=="
              />
            </Box>
          )}
        </Box>

        <Typography variant="subtitle1" noWrap className="title">
          {isLoading ? (
            <Skeleton variant="text" width={100} />
          ) : state !== null ? (
            category.name
          ) : (
            category?.parentCategory
          )}
        </Typography>
      </CardActionArea>
    </RootStyled>
  );
}
