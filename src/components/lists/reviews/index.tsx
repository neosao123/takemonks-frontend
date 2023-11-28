import Image from "next/image";
import dynamic from "next/dynamic";
import PropTypes from "prop-types";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import EditIcon from "@mui/icons-material/Edit";
const ReviewForm = dynamic(
  () => import("src/components/_main/productDetails/form/formEdit")
);
// material
import {
  Box,
  List,
  Skeleton,
  Avatar,
  ListItem,
  // Pagination,
  Button,
  Typography,
  Divider,
  Grid,
} from "@mui/material";
// utils
import { fDate } from "src/utils/formatTime";
import Rating from "@mui/material/Rating";
import useTranslation from "next-translate/useTranslation";
import { useState, useEffect } from "react";
const NoDataIllustration = dynamic(
  () => import("src/components/illustrations/noDataFound/noDataFound")
);

// ----------------------------------------------------------------------

ReviewItem.propTypes = {
  review: PropTypes.object,
};

function ReviewItem({ ...props }) {
  const { review, isLoading, reviews } = props;
  const { onClose, productId, onClickCancel, users, ...other } = props;
  console.log(
    review,

    "here in the data getting from the parent component"
  );
  const [checkUsergiver, setCheckusergiver] = useState(false);
  useEffect(() => {
    console.log("here the mark ", checkUsergiver, users?.email, review?.email);
    if (review != undefined) {
      const isPreview = review?.email === users?.email;

      if (isPreview) {
        setCheckusergiver(true);
      }
    }
  }, [users, reviews]);
  console.log(productId, isLoading, "123456789");
  const { t } = useTranslation("details");
  const [editReviewId, setEeditReviewId] = useState({});
  const [editRev, setEditReve] = useState(false);
  console.log(editRev, "edit Review");
  const handleReviewForm = () => {
    setEeditReviewId(true);
    setEditReve(true);
  };
  return (
    <>
      {isLoading ? (
        // Content to show when loading
        <Box pt={2}>
          <ListItem
            disableGutters
            sx={{
              alignItems: "flex-start",
              px: 2,
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Box
              sx={{
                mr: 1,
                display: "flex",
                alignItems: "center",
                mb: { xs: 2, sm: 0 },
                textAlign: { sm: "center" },
                flexDirection: { sm: "column" },
              }}
            >
              <Skeleton
                variant="circular"
                width={64}
                height={64}
                sx={{
                  mr: { xs: 2, sm: 0 },
                  mb: { sm: 2 },
                }}
              />
            </Box>
            <Box width={1}>
              <Box sx={{ float: "right" }}>
                <Skeleton variant="text" width={100} />
                <Skeleton variant="text" width={60} />
              </Box>
              <Skeleton variant="text" sx={{ maxWidth: 160 }} />
              <Skeleton variant="text" sx={{ maxWidth: 300 }} />
              <Skeleton variant="text" sx={{ maxWidth: 300 }} />
            </Box>
          </ListItem>
          <Box p={3}>
            <Grid container spacing={2} sx={{ img: { borderRadius: "8px" } }}>
              {[1, 2, 3].map((image) => (
                <Grid item xs={6} md={3} lg={2} key={image}>
                  <Box
                    sx={{
                      position: "relative",
                      height: 100,
                    }}
                  >
                    {" "}
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height="100%"
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
          <Divider />
        </Box>
      ) : !editRev ? (
        <Box pt={2}>
          <ListItem
            disableGutters
            sx={{
              alignItems: "flex-start",
              px: 2,
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Box
              sx={{
                mr: 1,
                display: "flex",
                alignItems: "center",
                mb: { xs: 2, sm: 0 },
                textAlign: { sm: "center" },
                flexDirection: { sm: "column" },
              }}
            >
              <Avatar
                src={review.avatar}
                sx={{
                  mr: { xs: 2, sm: 0 },
                  mb: { sm: 2 },
                  width: 64,
                  height: 64,
                }}
              />
            </Box>
            <Box width={1}>
              <Box sx={{ float: "right" }}>
                <Typography
                  variant="caption"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: "primary.main",
                  }}
                >
                  <VerifiedRoundedIcon sx={{ fontSize: 16 }} />
                  &nbsp;{t("verified-purchase")}
                </Typography>
                {checkUsergiver ? (
                  <Typography>
                    <Box mt={1} textAlign="right" pr={1}>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<EditIcon sx={{ fontSize: 16 }} />}
                        onClick={handleReviewForm}
                      >
                        Edit
                      </Button>
                    </Box>
                  </Typography>
                ) : null}
                <Typography
                  variant="caption"
                  sx={{ color: "text.secondary", float: "right" }}
                  noWrap
                >
                  {fDate(review.createdAt)}
                </Typography>
              </Box>
              <Typography
                variant="subtitle1"
                noWrap
                sx={{ textTransform: "capitalize" }}
              >
                {review.fullName}
              </Typography>
              <Typography variant="subtitle2" mb={1} mt={0.5} fontWeight={400}>
                {review.review}
              </Typography>
              <Rating
                size="small"
                value={review.rating}
                precision={0.1}
                readOnly
              />
            </Box>
          </ListItem>
          <Box p={3}>
            <Grid container spacing={2} sx={{ img: { borderRadius: "8px" } }}>
              {review?.images?.map((image: any, index: any) => (
                <Grid item xs={6} md={3} lg={2} key={index}>
                  <Box
                    sx={{
                      position: "relative",
                      height: 100,
                    }}
                  >
                    {" "}
                    <Image
                      src={image}
                      alt={`${review.name}'s review`}
                      layout="fill"
                      objectFit="cover"
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8r9a8CgAGKAJUJ+krTwAAAABJRU5ErkJggg=="
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
          <Divider />
        </Box>
      ) : (
        // Content to show for other cases
        <Box>
          <ReviewForm
            id={review.id}
            setEditReve={setEditReve}
            review={review}
          />
        </Box>
      )}
    </>
  );
}

ProductDetailsReviewList.propTypes = {
  product: PropTypes.object,
};

export default function ProductDetailsReviewList({ ...props }) {
  const { reviews, isLoading, users } = props;

  return (
    <Box>
      {!isLoading && reviews?.length < 1 && (
        <Grid item md={12}>
          <NoDataIllustration
            sx={{
              maxWidth: 300,
              svg: {
                width: 300,
                height: 300,
              },
            }}
          />
        </Grid>
      )}
      <List disablePadding>
        {(isLoading ? Array.from(new Array(3)) : reviews).map((review: any) => (
          <ReviewItem
            key={Math.random()}
            review={review}
            isLoading={isLoading}
            reviews={reviews}
            users={users}
          />
        ))}
      </List>
    </Box>
  );
}
