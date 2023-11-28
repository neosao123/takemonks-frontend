// import React, { useState } from "react";
// import {
//   Card,
//   Table,
//   TableBody,
//   TableRow,
//   TableCell,
//   TablePagination,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   TextField,
//   DialogActions,
//   Box,
// } from "@mui/material";
// import Pagination from "src/components/pagination";
// import { useQuery, useQueryClient } from "react-query";
// import { useRouter } from "next/router";
// import * as api from "src/services";
// import useTranslation from "next-translate/useTranslation";
// import { useMutation } from "react-query";
// import { fDateTime } from "src/utils/formatTime";
// import { styled, useTheme } from "@mui/material/styles";
// import useMediaQuery from "@mui/material/useMediaQuery";

// const ApplyAmcs = () => {
//   const { t } = useTranslation("profile");
//   const router = useRouter();
//   const pageParam = router.query.page;
// const theme = useTheme();
// const isMobile = useMediaQuery(theme.breakpoints.down("md"));
//   const queryClient = useQueryClient();

//   const [open, setOpen] = useState(false);
//   const [serialNo, setSerialKey] = useState("");
//   const [selectedAmc, setSelectedAmc] = useState(null);

//   const handleOpen = (amc: any) => {
//     setSelectedAmc(amc);
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setSelectedAmc(null);
//     setSerialKey("");
//   };

//   const mutation = useMutation(api.updateAmcs, {
//     onSuccess: () => {
//       setOpen(false);
//       handleClose();
//       queryClient.invalidateQueries(["user-details", 1]);
//     },
//   });

//   const handleApply = (serialNo: any, amc: any) => {
//     const data = { serialNo: serialNo, amc: amc };
//     mutation.mutate(data);
//   };

//   const {
//     data: amcsData,
//     isLoading,
//     isError,
//   } = useQuery(
//     ["user-details", pageParam],
//     () => api.getAmcsDetails(`?page=${pageParam || 1}`),
//     {
//       retry: false,
//       onError: (error) => {
//         console.error("Error fetching data:", error);
//       },
//     }
//   );

//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   const handleChangePage = (event: any, newPage: any) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event: any) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };
//   console.log(amcsData?.totalOrders, "amcs Data");
//   // if (!Array.isArray(amcsData)) {
//   //   return (
//   //     <TableRow>
//   //       <TableCell colSpan={9} align="center">
//   //         {Array.isArray(amcsData)
//   //           ? "No data available."
//   //           : "Data is loading data."}
//   //       </TableCell>
//   //     </TableRow>
//   //   );
//   // }
//   return (
//     <Card>
//       <h1>Apply AMCS</h1>
// {amcsData?.data ? (
//   <Table>
//     <TableBody>
//       {!isMobile && (
//         <TableRow
//           sx={{
//             background: (theme) => theme.palette.primary.main,
//           }}
//         >
//           <TableCell width="200px" sx={{ color: "common.white" }}>
//             Orderid
//           </TableCell>
//           <TableCell sx={{ color: "common.white" }}>Date</TableCell>
//           <TableCell sx={{ color: "common.white" }}>
//             Product Name
//           </TableCell>
//           <TableCell sx={{ color: "common.white" }}>Amc Title</TableCell>
//           <TableCell sx={{ color: "common.white" }}>Duration</TableCell>
//           <TableCell sx={{ color: "common.white" }}>
//             Serial Number
//           </TableCell>
//           <TableCell sx={{ color: "common.white" }}>
//             Expiry Date
//           </TableCell>
//           <TableCell sx={{ color: "common.white" }}>Status</TableCell>
//           <TableCell sx={{ color: "common.white" }}>Action</TableCell>
//         </TableRow>
//       )}
//       {amcsData &&
//         amcsData?.data?.map((amc: any, index: any) => (
//           <TableRow key={index}>
//             {isMobile ? (
//               <Box
//                 sx={{
//                   overflowX: "auto",
//                   display: "flex",
//                   flexDirection: "column",
//                   borderBottom: "1px solid #ccc",
//                   padding: "10px",
//                   "&:last-child": {
//                     borderBottom: "none",
//                   },
//                 }}
//               >
//                 <TableCell sx={{ fontWeight: 600, marginBottom: "5px" }}>
//                   {amc.orderId}
//                 </TableCell>
//                 <TableCell sx={{ marginBottom: "5px" }}>
//                   {fDateTime(amc?.orderDate)}
//                 </TableCell>
//                 <TableCell sx={{ marginBottom: "5px" }}>
//                   {amc.ProductName}
//                 </TableCell>
//                 <TableCell sx={{ marginBottom: "5px" }}>
//                   {amc.amcsTitel}
//                 </TableCell>
//                 <TableCell sx={{ marginBottom: "5px" }}>
//                   {amc.duration}
//                 </TableCell>
//                 <TableCell sx={{ marginBottom: "5px" }}>
//                   {amc.serialkey}
//                 </TableCell>
//                 <TableCell sx={{ marginBottom: "5px" }}>
//                   {amc?.expryDate ? fDateTime(amc?.expryDate) : null}
//                 </TableCell>
//                 <TableCell sx={{ marginBottom: "5px" }}>
//                   {amc.status}
//                 </TableCell>
//                 <TableCell>
//                   {amc.status === "N/A" && (
//                     <Button
//                       variant="contained"
//                       onClick={() => handleOpen(amc)}
//                     >
//                       Apply
//                     </Button>
//                   )}
//                 </TableCell>
//               </Box>
//             ) : (
//               <>
//                 <TableCell>{amc.orderId}</TableCell>
//                 <TableCell>{fDateTime(amc?.orderDate)}</TableCell>
//                 <TableCell>{amc.ProductName}</TableCell>
//                 <TableCell>{amc.amcsTitel}</TableCell>
//                 <TableCell>{amc.duration}</TableCell>
//                 <TableCell>{amc.serialkey}</TableCell>
//                 <TableCell>
//                   {amc?.expryDate ? fDateTime(amc?.expryDate) : null}
//                 </TableCell>
//                 <TableCell>{amc.status}</TableCell>
//                 <TableCell>
//                   {amc.status === "N/A" && (
//                     <Button
//                       variant="contained"
//                       onClick={() => handleOpen(amc)}
//                     >
//                       Apply
//                     </Button>
//                   )}
//                 </TableCell>
//               </>
//             )}
//           </TableRow>
//         ))}
//     </TableBody>
//   </Table>
// ) : (
//   <div>Data is loading...</div>
// )}
// <Pagination data={amcsData} />;

//       {/* Apply Dialog */}
//       <Dialog open={open} onClose={handleClose}>
//         <DialogTitle>Apply AMC</DialogTitle>
//         <DialogContent>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="Serial Key"
//             fullWidth
//             value={serialNo}
//             onChange={(e) => setSerialKey(e.target.value)}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose} color="primary">
//             Cancel
//           </Button>
//           <Button
//             onClick={() => handleApply(serialNo, selectedAmc)}
//             color="primary"
//           >
//             Apply
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Card>
//   );
// };
//    else {
// export default ApplyAmcs;


  //   return amcsData.map((amc: any, index: any) => (
  //     <Table>
  //       <TableBody>
  //         <TableRow key={index}>
  //           <TableCell>{amc.orderId}</TableCell>
  //           <TableCell>{fDateTime(amc?.orderDate)}</TableCell>
  //           <TableCell>{amc.ProductName}</TableCell>
  //           <TableCell>{amc.amcsTitel}</TableCell>
  //           <TableCell>{amc.duration}</TableCell>
  //           <TableCell>{amc.serialkey}</TableCell>
  //           <TableCell>
  //             {amc?.expryDate ? fDateTime(amc?.expryDate) : null}
  //           </TableCell>

  //           <TableCell>{amc.status}</TableCell>
  //           <TableCell>
  //             {amc.status == "N/A" && (
  //               <Button variant="contained" onClick={() => handleApply(amc)}>
  //                 Apply
  //               </Button>
  //             )}
  //           </TableCell>
  //         </TableRow>
  //       </TableBody>
  //     </Table>

  //     // <Table>
  //     //   <TableBody>
  //     //     {1 == 1 ? (
  //     //       <TableRow key={index}>
  //     //         {isMobile ? (
  //     //           <Box
  //     //             sx={{
  //     //               overflowX: "auto",
  //     //               display: "flex",
  //     //               flexDirection: "column",
  //     //               borderBottom: "1px solid #ccc",
  //     //               padding: "10px",
  //     //               "&:last-child": {
  //     //                 borderBottom: "none",
  //     //               },
  //     //             }}
  //     //           >
  //     //             <TableCell sx={{ fontWeight: 600, marginBottom: "5px" }}>
  //     //               {amc.orderId}
  //     //             </TableCell>
  //     //             <TableCell sx={{ marginBottom: "5px" }}>
  //     //               {fDateTime(amc?.orderDate)}
  //     //             </TableCell>
  //     //             <TableCell sx={{ marginBottom: "5px" }}>
  //     //               {amc.ProductName}
  //     //             </TableCell>
  //     //             <TableCell sx={{ marginBottom: "5px" }}>
  //     //               {amc.amcsTitel}
  //     //             </TableCell>
  //     //             <TableCell sx={{ marginBottom: "5px" }}>
  //     //               {amc.duration}
  //     //             </TableCell>
  //     //             <TableCell sx={{ marginBottom: "5px" }}>
  //     //               {amc.serialkey}
  //     //             </TableCell>
  //     //             <TableCell sx={{ marginBottom: "5px" }}>
  //     //               {amc?.expryDate ? fDateTime(amc?.expryDate) : null}
  //     //             </TableCell>
  //     //             <TableCell sx={{ marginBottom: "5px" }}>{amc.status}</TableCell>
  //     //             <TableCell>
  //     //               {amc.status === "N/A" && (
  //     //                 <Button
  //     //                   variant="contained"
  //     //                   onClick={() => handleApply(amc)}
  //     //                 >
  //     //                   Apply
  //     //                 </Button>
  //     //               )}
  //     //             </TableCell>
  //     //           </Box>
  //     //         ) : (
  //     //           <TableRow>
  //     //             <TableCell sx={{ width: "200px" }}>{amc.orderId}</TableCell>
  //     //             <TableCell sx={{ width: "200px" }}>
  //     //               {fDateTime(amc?.orderDate)}
  //     //             </TableCell>
  //     //             <TableCell sx={{ width: "200px" }}>{amc.ProductName}</TableCell>
  //     //             <TableCell sx={{ width: "200px" }}>{amc.amcsTitel}</TableCell>
  //     //             <TableCell sx={{ width: "200px" }}>{amc.duration}</TableCell>
  //     //             <TableCell sx={{ width: "200px" }}>{amc.serialkey}</TableCell>
  //     //             <TableCell sx={{ width: "200px" }}>
  //     //               {amc?.expryDate ? fDateTime(amc?.expryDate) : null}
  //     //             </TableCell>

  //     //             <TableCell sx={{ width: "100px" }}>{amc.status}</TableCell>
  //     //             <TableCell sx={{ width: "250px" }}>
  //     //               {amc.status == "N/A" && (
  //     //                 <Button
  //     //                   variant="contained"
  //     //                   onClick={() => handleApply(amc)}
  //     //                 >
  //     //                   Apply
  //     //                 </Button>
  //     //               )}
  //     //             </TableCell>
  //     //           </TableRow>
  //     //         )}
  //     //       </TableRow>
  //     //     ) : (
  //     //       ""
  //     //     )}
  //     //   </TableBody>
  //     // </Table>
  //   ));
  // };
import React, { useState } from "react";
import { useTheme, styled } from "@mui/material/styles";
import {
  Card,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Box,
} from "@mui/material";
import Label from "src/components/label";
import Pagination from "src/components/pagination";
// const isMobile = useMediaQuery(theme.breakpoints.down("md"));
import { useQuery, useQueryClient } from "react-query";
import { useRouter } from "next/router";
import * as api from "src/services";
import useTranslation from "next-translate/useTranslation";
import { useMutation } from "react-query";
import { fDateTime } from "src/utils/formatTime";
import { useMediaQuery } from "@mui/material";

const renderTableRows = (amcsData: any, handleApply: any) => {
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width:800px)");
  if (!Array.isArray(amcsData) || amcsData.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={9} align="center">
          {Array.isArray(amcsData)
            ? "No data available."
            : "Data is loading data."}
        </TableCell>
      </TableRow>
    );
  }
  if (isMobile) {
    return amcsData.map((amc: any, index: any) => (
      <Table>
        <TableBody>
          <TableRow key={index}>
            <Box
              sx={{
                overflowX: "auto",
                display: "flex",
                flexDirection: "column",
                borderBottom: "1px solid #ccc",
                padding: "10px",
                "&:last-child": {
                  borderBottom: "none",
                },
              }}
            >
              <TableCell sx={{ fontWeight: 600, marginBottom: "5px" }}>
                {amc.orderId}
              </TableCell>
              <TableCell sx={{ marginBottom: "5px" }}>
                {fDateTime(amc?.orderDate)}
              </TableCell>
              <TableCell sx={{ marginBottom: "5px" }}>
                {amc.ProductName}
              </TableCell>
              <TableCell sx={{ marginBottom: "5px" }}>
                {amc.amcsTitel}
              </TableCell>
              <TableCell sx={{ marginBottom: "5px" }}>{amc.duration}</TableCell>
              <TableCell sx={{ marginBottom: "5px" }}>
                {amc.serialkey}
              </TableCell>
              <TableCell sx={{ marginBottom: "5px" }}>
                {amc?.expryDate ? fDateTime(amc?.expryDate) : null}
              </TableCell>
              <TableCell>
        <Label
          variant={theme.palette.mode === "light" ? "ghost" : "filled"}
          color={
            (amc?.status === "approved" && "success") ||
            (amc?.status === "N/A" && "warning") ||
            (amc?.status === "pending" && "info") ||
            "error"
          }
        >
          {amc?.status}
        </Label>
      </TableCell>
              <TableCell>
                {amc.status === "N/A" && (
                  <Button variant="contained" onClick={() => handleApply(amc)}>
                    Apply
                  </Button>
                )}
              </TableCell>
            </Box>
          </TableRow>
        </TableBody>
      </Table>
    ));
  }
  return amcsData.map((amc: any, index: any) => (
    <TableRow key={index}>
      <TableCell sx={{ fontWeight: 600, marginBottom: "5px" }}>{amc.orderId}</TableCell>
      <TableCell sx={{ fontWeight: 600, marginBottom: "5px" }}>{fDateTime(amc?.orderDate)}</TableCell>
      <TableCell sx={{ fontWeight: 600, marginBottom: "5px" }}>{amc.ProductName}</TableCell>
      <TableCell sx={{ fontWeight: 600, marginBottom: "5px" }}>{amc.amcsTitel}</TableCell>
      <TableCell sx={{ fontWeight: 600, marginBottom: "5px" }}>{amc.duration}</TableCell>
      <TableCell sx={{ fontWeight: 600, marginBottom: "5px" }}>{amc.serialkey}</TableCell>
      <TableCell sx={{ fontWeight: 600, marginBottom: "5px" }}>{amc?.expryDate ? fDateTime(amc?.expryDate) : null}</TableCell>

      <TableCell>
        <Label
          variant={theme.palette.mode === "light" ? "ghost" : "filled"}
          color={
            (amc?.status === "approved" && "success") ||
            (amc?.status === "N/A" && "warning") ||
            (amc?.status === "pending" && "info") ||
            "error"
          }
        >
          {amc?.status}
        </Label>
      </TableCell>
      <TableCell>
        {amc.status == "N/A" && (
          <Button variant="contained" onClick={() => handleApply(amc)}>
            Apply
          </Button>
        )}
      </TableCell>
    </TableRow>
  ));


};

export default function ApplyAmcs() {
  const { t } = useTranslation("profile");
  const router = useRouter();
  const pageParam = router.query.page;

  const [open, setOpen] = useState(false);
  const [serialNo, setSerialKey] = useState("");
  const [selectedAmc, setSelectedAmc] = useState(null);
  const queryClient = useQueryClient();
  const handleOpen = (amc: any) => {
    setSelectedAmc(amc);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedAmc(null);
    setSerialKey("");
  };

  const mutation = useMutation(api.updateAmcs, {
    onSuccess: () => {
      setOpen(false);
      handleClose();
      window.location.reload();
      queryClient.invalidateQueries(["user-details", pageParam]);
    },
  });

  const handleApply = (serialNo: String, amc: any) => {
    const data = { serialNo: serialNo, amc: amc };
    mutation.mutate(data);
  };
  const {
    data: amcsData,
    isLoading,
    isError,
  } = useQuery(
    ["user-details", pageParam],
    () => api.getAmcsDetails(`?page=${pageParam || 1}`),
    {
      retry: false,
      onError: (error: any) => {
        console.error("Error fetching data:", error);
      },
    }
  );

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [serialError, setSerialError] = useState(false);

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Card>
      <h1 style={{ margin: "10px" }}>Apply Amcs</h1>
      <Table>
        <TableRow
          sx={{
            background: (theme) => theme.palette.primary.main,
          }}
        >
          <TableCell width="200px" sx={{ color: "common.white" }}>
            Order ID
          </TableCell>
          <TableCell sx={{ color: "common.white" }}>Date</TableCell>
          <TableCell sx={{ color: "common.white" }}>Product Name</TableCell>
          <TableCell sx={{ color: "common.white" }}>Amc Title</TableCell>
          <TableCell sx={{ color: "common.white" }}>Duration</TableCell>
          <TableCell sx={{ color: "common.white" }}>Serial Number</TableCell>
          <TableCell sx={{ color: "common.white" }}>Expiry Date</TableCell>
          <TableCell sx={{ color: "common.white" }}>Status</TableCell>
          <TableCell sx={{ color: "common.white" }}>Action</TableCell>
        </TableRow>
        <TableBody>{renderTableRows(amcsData?.data, handleOpen)}</TableBody>
      </Table>

      <Pagination data={amcsData} />

      {/* Apply Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle style={{ margin: "1vh" }}>Apply AMC</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Serial Key"
            fullWidth
            value={serialNo}
            onChange={(e) => {
              setSerialKey(e.target.value);
              setSerialError(false); 
            }}
            error={serialError} 
            helperText={serialError ? 'Serial key is required' : ''}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
              onClick={() => {
                if (serialNo.length === 0) {
                  setSerialError(true);
                } else {
                  setSerialError(false);
                  handleApply(serialNo, selectedAmc);
                }
              }}
            color="primary"
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
