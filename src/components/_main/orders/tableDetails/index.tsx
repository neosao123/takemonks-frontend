import React from "react";
// material
import {
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
  Box,
  Skeleton,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import useTranslation from "next-translate/useTranslation";
import RootStyled from "./styled";

const headData = ["Product", "Duration", "Color", "Quantity", "Size", "Price"];
const ThumbImgStyle = styled("img")(({ theme }) => ({
  width: 64,
  height: 64,
  objectFit: "cover",
  margin: theme.spacing(0, 2),
  borderRadius: theme.shape.borderRadius,
}));

// ... (import statements)

export default function ItemsTable({
  data,
  isLoading,
  currency,
  amcsData,
}: {
  data: any;
  isLoading: any;
  currency: any;
  amcsData: any;
}) {
  const { t } = useTranslation("order");
  const abc = data?.items || [];
  const ab = data?.amcsItems || [];
  console.log(data, "data");
  return (
    <RootStyled>
      <TableContainer>
        <Table className="table-main">
          <TableHead>
            <TableRow
              sx={{
                background: (theme) => theme.palette.primary.main,
              }}
            >
              {headData.map((headCell: any) => (
                <TableCell
                  key={Math.random()}
                  align={headCell.alignRight ? "right" : "left"}
                  sx={{
                    color: "common.white",
                    bgcolor: "transparent",
                  }}
                >
                  {headCell}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {(isLoading ? Array.from(new Array(3)) : abc)?.map(
              (row: any, i: any) => (
                <TableRow key={`row-${i}`}>
                  <TableCell>
                    {row ? (
                      <Box className="body-row-cell">
                        <ThumbImgStyle alt={row?.name} src={row?.cover} />
                        <Typography variant="subtitle2" noWrap>
                          {row?.name.slice(0, 50)}
                        </Typography>
                      </Box>
                    ) : (
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Skeleton
                          variant="rectangular"
                          width={64}
                          height={64}
                        />
                        <Skeleton variant="text" width={100} />
                      </Stack>
                    )}
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    {row ? (
                      row.color ? (
                        row.color
                      ) : (
                        "N/A"
                      )
                    ) : (
                      <Skeleton variant="text" width={100} />
                    )}
                  </TableCell>
                  <TableCell>
                    {row ? (
                      row.quantity
                    ) : (
                      <Skeleton variant="text" width={100} />
                    )}
                  </TableCell>
                  <TableCell>
                    {row ? row.size : <Skeleton variant="text" width={100} />}
                  </TableCell>
                  <TableCell>
                    {row ? (
                      `${currency} ${row.priceSale || row.price}`
                    ) : (
                      <Skeleton variant="text" width={100} />
                    )}
                  </TableCell>
                </TableRow>
              )
            )}
            {data?.amcsItems?.map((amcsData: any, i: number) => (
              <TableRow key={`priceofAmc-row-${i}`}>
  
                <TableCell>
                  {amcsData ? (
                    <Box className="body-row-cell">
                      <ThumbImgStyle
                        alt={amcsData?.name}
                        src={amcsData?.cover?.url}
                      />
                      <Typography variant="subtitle2" noWrap>
                        {amcsData?.name.slice(0, 20)}
                      </Typography>
                      {/* <br></br>
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                        >
                          {t("duration")}:&nbsp;
                        </Typography>
                        {amcsData.durationCount} {amcsData.durationType}
                      </> */}
                    </Box>
                  ) : (
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Skeleton variant="rectangular" width={64} height={64} />
                      <Skeleton variant="text" width={100} />
                    </Stack>
                  )}
                </TableCell>

                {/* <TableCell>
                  {isLoading ? (
                    <Skeleton variant="text" width={120} />
                  ) : (
                    amcsData.name
                  )}
                  <br></br>
                  {isLoading ? (
                    <Skeleton variant="text" width={120} />
                  ) : (
                    amcsData.name
                  )}
                </TableCell> */}

                <TableCell>
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                    >
                      {t("duration")}:&nbsp;
                    </Typography>
                    {amcsData.durationCount} {amcsData.durationType}
                  </>
                </TableCell>
                <TableCell></TableCell>
                <TableCell align="left">
                  {isLoading ? (
                    <Skeleton variant="text" width={38} />
                  ) : (
                    amcsData.quantity
                  )}
                </TableCell>
                <TableCell></TableCell>
                <TableCell align="left">
                  {isLoading ? (
                    <Skeleton variant="text" width={38} />
                  ) : (
                    `${currency}${" "}${amcsData.priceSale}`
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </RootStyled>
  );
}
