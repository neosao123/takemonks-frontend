import PropTypes from "prop-types";
import dynamic from "next/dynamic";
import protectionImage from "../../../../assets/protection.png";
import React from "react";
import useTranslation from "next-translate/useTranslation";

import { styled } from "@mui/material/styles";
import {
  Box,
  Table,
  Stack,
  Divider,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  IconButton,
  Skeleton,
} from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import getColorName from "src/utils/getColorName";

const RootStyled = dynamic(() => import("./styled"));
const Incrementer = dynamic(() => import("src/components/incrementer"));

interface ProductProps {
  _id: string;
  sku: string;
  name: string;
  size: string;
  priceSale: string;
  color: string;
  cover: string;
  quantity: number;
  available: string;
  protectProduct: string;
  priceofAmcs: any;
}

const ThumbImgStyle = styled("img")(({ theme }) => ({
  width: 64,
  height: 64,
  objectFit: "cover",
  marginRight: theme.spacing(2),
  borderRadius: "8px",
  border: `1px solid ${theme.palette.divider}`,
}));

ProductList.propTypes = {
  onDelete: PropTypes.func,
  onDecreaseQuantity: PropTypes.func,
  onIncreaseQuantity: PropTypes.func,
};

const formatNumbers = (number: number, unitRate: string | number) => {
  const converted = number.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
  return converted;
};
const priceOfAmcs1 = { price: "0" };
export default function ProductList({ ...props }) {
  const {
    formik,
    onDelete,
    onIncreaseQuantity,
    onDecreaseQuantity,
    symbol,
    unitRate,
    loaded,
    isLoading,
    priceofAmcs,
  } = props;
  const { t } = useTranslation("checkout");
  const { products } = formik.values;
  const currentPriceofAmcs = priceofAmcs || priceOfAmcs1;
  return (
    <RootStyled>
      <Table>
        {currentPriceofAmcs.price == "0" && (
          <TableHead>
            <TableRow className="table-head-row">
              <TableCell>
                {isLoading ? (
                  <Skeleton variant="text" width={47} />
                ) : (
                  t("product")
                )}
              </TableCell>
              <TableCell align="left">
                {isLoading ? (
                  <Skeleton variant="text" width={30} />
                ) : (
                  t("price")
                )}
              </TableCell>
              <TableCell align="left">
                {isLoading ? (
                  <Skeleton variant="text" width={54} />
                ) : (
                  t("quantity")
                )}
              </TableCell>
              <TableCell>
                {isLoading ? (
                  <Skeleton variant="text" width={63} />
                ) : (
                  t("total-price")
                )}
              </TableCell>
              <TableCell>
                {isLoading ? (
                  <Skeleton variant="text" width={120} /> // Adjust width as needed
                ) : (
                  "" // t("Protect Product")""
                )}
              </TableCell>
              <TableCell align="right" />
            </TableRow>
          </TableHead>
        )}

        <TableBody>
          {products.map((product: ProductProps) => {
            const {
              _id,
              sku,
              name,
              size,
              priceSale,
              color,
              cover,
              quantity,
              available,
              priceofAmcs,
            } = product;

            return (
              <React.Fragment key={sku}>
                {/* Upper Table */}
                {available && (
                  <TableRow>
                    <TableCell>
                      <Box className="product-sec">
                        {isLoading ? (
                          <Skeleton
                            variant="rounded"
                            width={64}
                            height={64}
                            sx={{ mr: 2 }}
                          />
                        ) : (
                          <ThumbImgStyle alt="product image" src={cover} />
                        )}
                        <Box>
                          <Typography
                            noWrap
                            variant="subtitle2"
                            className="subtitle"
                            component={"span"}
                          >
                            {isLoading ? (
                              <Skeleton variant="text" width={83} />
                            ) : (
                              name
                            )}
                          </Typography>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            divider={<Divider orientation="vertical" />}
                          >
                            <Typography variant="body2">
                              {isLoading ? (
                                <Skeleton variant="text" width={46} />
                              ) : (
                                <>
                                  <Typography
                                    component="span"
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {t("size")}:&nbsp;
                                  </Typography>
                                  {size}
                                </>
                              )}
                            </Typography>
                            <Typography variant="body2">
                              {isLoading ? (
                                <Skeleton variant="text" width={46} />
                              ) : (
                                <>
                                  <Typography
                                    component="span"
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {t("color")}:&nbsp;
                                  </Typography>
                                  {getColorName(color)}
                                </>
                              )}
                            </Typography>
                          </Stack>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="left">
                      {isLoading ? (
                        <Skeleton variant="text" width={38} />
                      ) : (
                        <>
                          {loaded && symbol}{" "}
                          {loaded && formatNumbers(Number(priceSale), unitRate)}
                        </>
                      )}
                    </TableCell>
                    <TableCell align="left">
                      {isLoading ? (
                        <Skeleton variant="text" width={38} />
                      ) : (
                        <Incrementer
                          quantity={quantity}
                          available={available}
                          onDecrease={() => onDecreaseQuantity(sku)}
                          onIncrease={() => onIncreaseQuantity(sku)}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {isLoading ? (
                        <Skeleton variant="text" width={38} />
                      ) : (
                        <>
                          {loaded && symbol}{" "}
                          {loaded &&
                            formatNumbers(
                              Number(priceSale) * quantity,
                              unitRate
                            )}
                        </>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {isLoading ? (
                        <Skeleton
                          variant="circular"
                          width={40}
                          height={40}
                          sx={{ ml: "auto" }}
                        />
                      ) : (
                        <IconButton
                          aria-label="delete"
                          color="primary"
                          onClick={() => onDelete(sku)}
                        >
                          <DeleteOutlineRoundedIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                )}
                {/* Lower Table */}
                {priceofAmcs && (
                  // <TableRow>
                  //   <TableCell colSpan={8}>
                  //     {/* Colspan should match the number of columns in the main table */}
                  //     <Table>
                  //       <TableBody>
                  //         <TableRow>
                  //           <TableCell>
                  //             <ThumbImgStyle
                  //               alt="product image"
                  //               src={priceofAmcs?.cover?.url ?? protectionImage}
                  //             />
                  //           </TableCell>
                  //           <TableCell align="left">
                  //             {isLoading ? (
                  //               <Skeleton variant="text" width={38} />
                  //             ) : (
                  //               <>
                  //                 {loaded && symbol}{" "}
                  //                 {loaded &&
                  //                   formatNumbers(
                  //                     Number(priceofAmcs.price),
                  //                     unitRate
                  //                   )}
                  //               </>
                  //             )}
                  //           </TableCell>
                  //           {/* <TableCell>
                  //             {isLoading ? (
                  //               <Skeleton variant="text" width={120} />
                  //             ) : (
                  //               priceofAmcs.title
                  //             )}
                  //             <br></br>
                  //             {isLoading ? (
                  //               <Skeleton variant="text" width={120} />
                  //             ) : (
                  //               priceofAmcs.description
                  //             )}
                  //           </TableCell> */}
                  //           <TableCell align="left">
                  //             {isLoading ? (
                  //               <Skeleton variant="text" width={38} />
                  //             ) : (
                  //               <Incrementer
                  //                 quantity={quantity}
                  //                 available={available}
                  //                 onDecrease={() => onDecreaseQuantity(sku)}
                  //                 onIncrease={() => onIncreaseQuantity(sku)}
                  //               />
                  //             )}
                  //           </TableCell>

                  //           {/* <TableCell>
                  //             <>
                  //               <Typography
                  //                 component="span"
                  //                 variant="body2"
                  //                 color="text.secondary"
                  //               >
                  //                 {t("duration")}:&nbsp;
                  //               </Typography>
                  // {priceofAmcs.durationCount}{" "}
                  // {priceofAmcs.durationType}
                  //             </>
                  //           </TableCell> */}
                  //           <TableCell>
                  //             {isLoading ? (
                  //               <Skeleton variant="text" width={38} />
                  //             ) : (
                  //               <>
                  //                 {loaded && symbol}{" "}
                  //                 {loaded &&
                  //                   formatNumbers(
                  //                     Number(priceofAmcs.price) * quantity,
                  //                     unitRate
                  //                   )}
                  //               </>
                  //             )}
                  //           </TableCell>

                  //           <TableCell align="right">
                  //             {isLoading ? (
                  //               <Skeleton
                  //                 variant="circular"
                  //                 width={40}
                  //                 height={40}
                  //                 sx={{ ml: "auto" }}
                  //               />
                  //             ) : (
                  //               <IconButton
                  //                 aria-label="delete"
                  //                 color="primary"
                  //                 onClick={() => onDelete(sku)}
                  //               >
                  //                 <DeleteOutlineRoundedIcon />
                  //               </IconButton>
                  //             )}
                  //           </TableCell>
                  //         </TableRow>
                  //       </TableBody>
                  //     </Table>
                  //   </TableCell>
                  // </TableRow>
                  <TableRow>
                    <TableCell>
                      <Box className="product-sec">
                        {isLoading ? (
                          <Skeleton
                            variant="rounded"
                            width={64}
                            height={64}
                            sx={{ mr: 2 }}
                          />
                        ) : (
                          <ThumbImgStyle
                            alt="product image"
                            src={priceofAmcs?.cover?.url}
                          />
                        )}
                        <Box>
                          <Typography
                            noWrap
                            variant="subtitle2"
                            className="subtitle"
                            component={"span"}
                          >
                            {isLoading ? (
                              <Skeleton variant="text" width={83} />
                            ) : priceofAmcs.title &&
                              priceofAmcs.title.length > 20 ? (
                              `${priceofAmcs.title.slice(0, 20)}...`
                            ) : (
                              priceofAmcs.title
                            )}
                          </Typography>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            divider={<Divider orientation="vertical" />}
                          >
                            <Typography variant="body2">
                              {isLoading ? (
                                <Skeleton variant="text" width={46} />
                              ) : (
                                <>
                                  <Typography
                                    component="span"
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {priceofAmcs.durationCount}{" "}
                                    {priceofAmcs.durationType}
                                  </Typography>
                                </>
                              )}
                            </Typography>
                            <Typography variant="body2">
                              {isLoading ? (
                                <Skeleton variant="text" width={46} />
                              ) : (
                                <>
                                  <Typography
                                    component="span"
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Description :
                                  </Typography>
                                  {priceofAmcs.description
                                    .split(" ") // Split description into words
                                    .slice(0, 10) // Take the first 10 words
                                    .join(" ")}{" "}
                                  {/* Join the words back into a string */}
                                  {priceofAmcs.description.split(" ").length >
                                    10 && "..."}
                                </>
                              )}
                            </Typography>
                          </Stack>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="left">
                      {isLoading ? (
                        <Skeleton variant="text" width={38} />
                      ) : (
                        <>
                          {loaded && symbol}{" "}
                          {loaded &&
                            formatNumbers(Number(priceofAmcs.price), unitRate)}
                        </>
                      )}
                    </TableCell>
                    <TableCell align="left">
                      {isLoading ? (
                        <Skeleton variant="text" width={38} />
                      ) : (
                        <Incrementer
                          quantity={quantity}
                          available={available}
                          onDecrease={() => onDecreaseQuantity(sku)}
                          onIncrease={() => onIncreaseQuantity(sku)}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {isLoading ? (
                        <Skeleton variant="text" width={38} />
                      ) : (
                        <>
                          {loaded && symbol}{" "}
                          {loaded &&
                            formatNumbers(
                              Number(priceofAmcs.price) * quantity,
                              unitRate
                            )}
                        </>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {isLoading ? (
                        <Skeleton
                          variant="circular"
                          width={40}
                          height={40}
                          sx={{ ml: "auto" }}
                        />
                      ) : (
                        <IconButton
                          aria-label="delete"
                          color="primary"
                          onClick={() => onDelete(sku)}
                        >
                          <DeleteOutlineRoundedIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
              // This code includes both the upper and lower tables with balanced columns and no lines between them. The upper table content is in the first <TableRow> section, and the lower table content is in the
            );
          })}
        </TableBody>
      </Table>
    </RootStyled>
  );
}
