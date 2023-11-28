import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
// material
import { Divider, Collapse, Grid } from "@mui/material";
//
// import ProductDetailsReviewForm from "./ProductDetailsReviewForm";
import { useRouter } from "next/router";
// api
import * as api from "src/services";
// react-query
import { useQuery } from "react-query";
// redux
import { useSelector } from "react-redux";

const ReviewForm = dynamic(
  () => import("src/components/_main/productDetails/form")
);ReviewForm
const ReviewOverview = dynamic(
  () => import("src/components/_main/productDetails/overview")
);
const ReviewsList = dynamic(() => import("src/components/lists/reviews"));

ProductDetailsReview.propTypes = {
  product: PropTypes.object,
};
export default function ProductDetailsReview({ ...props }) {
  const { total, id } = props;
  const router = useRouter();
  const [count, setCount] = useState(0);
  const [openReview, setOpenReview] = useState([]);
  const { data, isLoading } = useQuery(
    ["review data", count],
    () => api.getProductReviews(id),
    {
      enabled: Boolean(id),
    }
  );
  const { reviews } = data?.data || {};
  const [reviewBox, setReviewBox] = useState(false);
  const { isAuthenticated } = useSelector(({ user }: { user: any }) => user);
  const { user } = useSelector(({ user }: { user: any }) => user);
  console.log(isAuthenticated, user?._id, "i am in the users authontication");
  const pageParam = router.query.page;
  // if (user?._id) {
  //   fetchData();
  // }

  const fetchData = async () => {
    try {
      if (user?._id) {
        const gettingData = await api.orderDetails({
          _id: user?._id,
        });
        console.log("here is getting a data ", gettingData);
        if (gettingData) {
          setOpenReview(gettingData);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    if (user?._id) {
      fetchData();
    }
  }, []);
  console.log(openReview, "here overview ");

  const handleOpenReviewBox = () => {
    isAuthenticated
      ? setReviewBox((prev) => !prev)
      : router.push("/auth/login?redirect=" + router.asPath);
  };
  const handleCloseReviewBox = () => {
    setReviewBox(false);
    setTimeout(() => {
      setCount(count + 1);
    }, 500);
  };
  console.log(id, " here is a id");
  return (
    <>
      <Grid container>
        <Grid item xs={12} md={4}>
          <ReviewOverview
            data={total}
            user={user}
            reviews={reviews}
            onOpen={handleOpenReviewBox}
            openReview={openReview}
            id={id}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Collapse in={reviewBox}>
            <ReviewForm
              productId={id}
              onClose={handleCloseReviewBox}
              id="move_add_review"
              onClickCancel={() => setReviewBox(false)}
            />
            <Divider />
          </Collapse>
          <ReviewsList
            productId={id}
            onClose={handleCloseReviewBox}
            id="move_add_review"
            onClickCancel={() => setReviewBox(false)}
            isLoading={isLoading}
            reviews={reviews}
            users={user}
          />
        </Grid>
      </Grid>
    </>
  );
}
