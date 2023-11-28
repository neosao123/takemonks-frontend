import React from "react";
import PropTypes from "prop-types";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
// material
import {
  Box,
  Card,
  Button,
  Typography,
  Stack,
  Paper,
  Dialog,
  Slide,
  useMediaQuery,
  Skeleton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { useSelector } from "react-redux";
import * as api from "src/services";
import { useQuery } from "react-query";
import DeleteDialog from "./deleteDialog";
import AccountAddressForm from "./accountAddressForm";
import NotFound from "src/components/illustrations/noDataFound/noDataFound";
import Label from "src/components/label";

// ----------------------------------------------------------------------

AccountBillingAddressBook.propTypes = {
  addressBook: PropTypes.array,
};
export default function AccountBillingAddressBook() {
  const { user } = useSelector(({ user }: { user: any }) => user);
  const [state, setstate] = React.useState<any>({
    open: false,
    openDialog: "",
    address: null,
    apicall: false,
    id: null,
  });
  const { data, isLoading: isLoad } = useQuery(
    ["address", user, state.apicall],
    () => api.getAddress(user._id)
  );
  const addresses = data?.addresses;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const handleClickOpen = (prop: any) => () => {
    if (typeof prop === "object") {
      if (prop.value === "edit") {
        setstate({
          open: true,
          openDialog: "edit",
          address: prop.address,
        });
      } else {
        setstate({
          open: true,
          openDialog: "delete",
          id: prop.id,
        });
      }
    } else {
      setstate({
        ...state,
        open: true,
        openDialog: prop,
        address: null,
      });
    }
  };
  const handleClose = () => {
    setstate({ ...state, open: false, openDialog: "", address: null });
  };
  return (
    <>
      <Card sx={{ p: 3 }}>
        {!isLoad && addresses?.length < 1 && (
          <NotFound title="No Address Found" />
        )}
        <Stack spacing={3} alignItems="flex-start">
          {!isLoad && addresses?.length > 0 && (
            <Typography variant="overline" sx={{ color: "text.secondary" }}>
              Billing Info
            </Typography>
          )}

          {(isLoad ? Array.from(new Array(4)) : addresses).map(
            (address: any, index: number) => (
              <Paper
                key={index}
                sx={{
                  p: 3,
                  width: 1,
                  position: "relative",
                  border: `1px solid ${theme.palette.background.default}`,
                }}
              >
                {address ? (
                  <Typography variant="body2" gutterBottom>
                    <Typography
                      variant="body2"
                      component="span"
                      sx={{ color: "text.secondary" }}
                    >
                      Shipping Address: &nbsp;
                    </Typography>
                    {`${address.address}, ${address.city}, ${address.state}, ${address.country} ${address.zip}`}
                    <br />
                    <br />
                    <Typography
                      variant="body2"
                      component="span"
                      sx={{ color: "text.secondary" }}
                    >
                      Billing Address: &nbsp;
                    </Typography>
                    {`${address.billingAddressField}, ${address.billingCity}, ${address.billingState}, ${address.billingCountry} ${address.billingZip}`}
                  </Typography>
                ) : (
                  <Stack spacing={2} direction="row" alignItems="center">
                    <Skeleton variant="text" width={70} sx={{ mr: 1 }} />
                    <Skeleton variant="text" width="100%" />
                  </Stack>
                )}

                <Box sx={{ mt: 1 }}>
                  {address ? (
                    <>
                      <Button
                        color="error"
                        size="small"
                        startIcon={<DeleteOutlineRoundedIcon />}
                        onClick={handleClickOpen({
                          value: "delete",
                          id: address._id,
                        })}
                        sx={{ mr: 1 }}
                      >
                        Delete
                      </Button>
                      <Button
                        size="small"
                        startIcon={<EditRoundedIcon />}
                        onClick={handleClickOpen({ value: "edit", address })}
                      >
                        Edit
                      </Button>
                      {address.active ? (
                        <Label color="info" sx={{ ml: 1 }}>
                          Default
                        </Label>
                      ) : null}
                    </>
                  ) : (
                    <Stack spacing={2} direction="row" alignItems="center">
                      <Stack spacing={2} direction="row" alignItems="center">
                        <Skeleton variant="text" width={25} height={40} />
                        <Skeleton variant="text" width={70} />
                      </Stack>
                      <Stack spacing={2} direction="row" alignItems="center">
                        <Skeleton variant="text" width={25} height={40} />
                        <Skeleton variant="text" width={70} />
                      </Stack>
                    </Stack>
                  )}
                </Box>
              </Paper>
            )
          )}

          <Button
            onClick={handleClickOpen("new")}
            size="small"
            startIcon={<AddRoundedIcon />}
          >
            Add new address
          </Button>
        </Stack>
      </Card>
      <Dialog
        fullScreen={fullScreen}
        open={state.open}
        sx={{ "& .MuiDialog-paper": { m: 0 } }}
      >
        {state.openDialog === "delete" && (
          <DeleteDialog
            id={state.id}
            onClose={handleClose}
            apicall={setstate}
          />
        )}
        {(state.openDialog === "edit" || state.openDialog === "new") && (
          <AccountAddressForm
            address={state.address}
            onClose={handleClose}
            apicall={setstate}
          />
        )}
      </Dialog>
    </>
  );
}
