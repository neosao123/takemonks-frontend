// import React from "react";
// import {
//   Box,
//   Card,
//   Table,
//   TableBody,
//   TableContainer,
//   Stack,
//   TableRow,
//   Skeleton,
//   TableCell,
//   TableHead,
//   Typography,
//   IconButton,
//   Avatar,
//   Rating,
//   Switch,
//   Tooltip,
//   Link,
//   Button,
// } from "@mui/material";
// import { fDateShort } from "src/utils/formatTime";

// // components
// import { useDispatch, useSelector } from "react-redux";
// import { addAmcCart } from "src/redux/slices/product";
// import { useFormik, Form, FormikProvider } from "formik";
// import toast from "react-hot-toast";
import product from "src/redux/slices/product";
// import { ar, enUS } from "date-fns/locale";
// const amcslist = ({ ...props }) => {
//   const {
//     type,
//     headData,
//     data,
//     isLoading,
//     mobileRow,
//     row,
//     rows,
//     hiddenPagination,
//     ...rest
//   } = props;
//   console.log(props, "123456");
//   const Component = row;
//   const CardComponent = mobileRow;
//   const ThumbImgStyle = (theme: any) => ({
//     width: 50,
//     height: 50,
//     minWidth: 50,
//     objectFit: "cover",
//   });

//   console.log("Component", row?.data);
//   return (
//     <>
//       {!isLoading && data?.data.length === 0 ? null : (
//         <>
//           <Card sx={{ display: { sm: "block", xs: "none" } }}>
//             <TableContainer>
//               <Table sx={{ minWidth: 800, overflow: "auto" }}>
//                 {/* <TableHead headData={headData} /> */}
//                 <TableHead sx={{}}>
//                   <TableRow>
//                     <TableCell>Image</TableCell>
//                     <TableCell>Name</TableCell>
//                     <TableCell>Price</TableCell>
//                     <TableCell>Duration Count</TableCell>
//                     <TableCell>Duration Type</TableCell>
//                     <TableCell>Action</TableCell>
//                   </TableRow>
//                 </TableHead>

//                 <TableBody>
//                   {(isLoading
//                     ? Array.from(new Array(rows || 6))
//                     : row?.data
//                   )?.map((item: any) => {
//                     return (
//                       <TableRow hover key={Math.random()}>
//                         <TableCell
//                           component="th"
//                           scope="row"
//                           style={{ margin: "10px" }}
//                         >
//                           {item?.cover && (
//                             <img
//                               src={item.cover.url}
//                               alt={item.title}
//                               style={{
//                                 width: 50,
//                                 height: 50,
//                                 objectFit: "cover",
//                               }}
//                             />
//                           )}
//                         </TableCell>

//                         <TableCell component="th" scope="row">
//                           {isLoading ? (
//                             <Skeleton variant="text" />
//                           ) : item?.productId?.name?.length > 15 ? (
//                             `${item?.productId?.name?.slice(0, 15)}...`
//                           ) : (
//                             item?.productId?.name
//                           )}
//                         </TableCell>
//                         <TableCell component="th" scope="row">
//                           {isLoading ? (
//                             <Skeleton variant="text" />
//                           ) : (
//                             item?.price
//                           )}
//                         </TableCell>
//                         <TableCell component="th" scope="row">
//                           {isLoading ? (
//                             <Skeleton variant="text" />
//                           ) : (
//                             item?.durationCount
//                           )}
//                         </TableCell>
//                         <TableCell component="th" scope="item">
//                           {isLoading ? (
//                             <Skeleton variant="text" />
//                           ) : (
//                             item?.durationType
//                           )}
//                         </TableCell>
//                         <TableCell component="th" scope="item">
//                           {isLoading ? (
//                             <Skeleton variant="text" />
//                           ) : (
//                             <Button
//                               variant="contained"
//                               color="primary"
//                               //   onClick={() => handleAddToCart(item)}
//                             >
//                               Add to Cart
//                             </Button>
//                           )}
//                         </TableCell>
//                       </TableRow>
//                     );
//                   })}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </Card>

//           {!isLoading && !hiddenPagination && (
//             <Stack alignItems="flex-end" mt={2} pr={2}>
//               {/* <Pagination data={data} /> */}
//             </Stack>
//           )}
//         </>
//       )}
//     </>
//   );
// };

// export default amcslist;
import React from "react";
import {
  Stack,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import { useDispatch } from "react-redux";
import { addAmcCart, resetCart } from "src/redux/slices/product";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { useTheme } from "@mui/material/styles";

const AmcsList = ({ symbol, row }: any) => {
  const { t } = useTranslation("details");
  const dispatch = useDispatch();

  const onhandleSubmit = (productAmcs: any) => (e: any) => {
    e.preventDefault();

    const initialValues = {
      id: productAmcs?._id,
      sku: productAmcs?.title,
      priceSale: productAmcs?.price,
      priceofAmcs: productAmcs,
      quantity: 1,
    };
    console.log(productAmcs);
    // Dispatch to Redux or perform other actions here
    // try {
    toast.success(t("common:added-to-cart"));
    dispatch(addAmcCart(initialValues));
    // } catch (error) {
    //   console.error("Error:", error);
    // }
  };
  const theme = useTheme();
  return (
    <TableContainer>
      <Table>
        <TableBody>
          {row?.data?.map((productAmc: any) => (
            <TableRow
              key={productAmc.id}
              component={Box}
              style={{
                backgroundColor: "white",
                marginBottom: 1 < row.data.length - 1 ? 10 : 0,
                // Add space between rows (adjust the value as needed)
              }}
            >
              <TableCell
                sx={{
                  width: "120px",
                }}
              >
                <img
                  src={productAmc?.cover?.url ?? "fallback_image_url"}
                  alt="Product"
                  style={{ width: "100%", height: "auto" }}
                />
              </TableCell>
              <TableCell
                sx={{
                  width: "150px",
                }}
              >
                {productAmc.productId.name}
              </TableCell>
              <TableCell
                sx={{
                  width: "150px",
                }}
              >
                {productAmc.title && productAmc.title.length > 20
                  ? `${productAmc.title.slice(0, 20)}...`
                  : productAmc.title}
              </TableCell>
              <TableCell
                sx={{
                  width: "200px",
                }}
              >
                {productAmc.description && productAmc.description.length > 120
                  ? `${productAmc.description.slice(0, 120)}...`
                  : productAmc.description}
              </TableCell>
              <TableCell
                sx={{
                  width: "100px",
                }}
              >
                {"Duration: "}
                {productAmc.durationCount} {productAmc.durationType}
              </TableCell>
              <TableCell
                sx={{
                  width: "100px",
                }}
              >
                {symbol} {productAmc.price}
              </TableCell>
              <TableCell
                sx={{
                  width: "200px",
                }}
              >
                <form onSubmit={onhandleSubmit(productAmc)}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      width: "20vh",
                    }}
                  >
                    Add To Cart
                  </Button>
                </form>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AmcsList;
