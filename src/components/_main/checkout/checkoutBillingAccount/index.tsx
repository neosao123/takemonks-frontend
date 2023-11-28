import React from "react";
// import { Icon } from "@iconify/react";
import { useState } from "react";
import { useMutation } from "react-query";
// next
import dynamic from "next/dynamic";
import useTranslation from "next-translate/useTranslation";
// icons
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
// material
import {
  Box,
  Card,
  Button,
  Typography,
  IconButton,
  Tooltip,
  Skeleton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
// toast
import { toast } from "react-hot-toast";
// redux
import { useDispatch, useSelector } from "react-redux";
import {
  onBackStep,
  onNextStep,
  createBilling,
} from "src/redux/slices/product";
//
import { NoDataFound } from "src/components/illustrations";
import * as api from "src/services";
const CheckoutNewAddressForm = dynamic(
  () => import("../checkoutNewAddressForm")
);
const CheckoutGuest = dynamic(() => import("../checkoutGuest"));
const Label = dynamic(() => import("src/components/label"));
const RootStyled = dynamic(() => import("./styled"));

// ----------------------------------------------------------------------

function AddressItem({ ...props }) {
  const { address, onNextStep, onCreateBilling, isLoad, apicall, t } = props;
  const { checkout } = useSelector(({ product }: { product: any }) => product);
  const { billing } = checkout;

  const { user } = useSelector(({ user }: { user: any }) => user);
  const { mutate } = useMutation(api.deleteAddress, {
    onSuccess: (data) => {
      const { message } = data;
      toast.success(t(message));
      apicall((prev: string) => !prev);
    },
  });
  const {
    receiver,
    address: fullAddress,
    city,
    country,
    state,
    zip,
    phone,
    active,
    billingAddressField,
    billingZip,
    billingCountry,
    billingCity,
    billingState,
    _id: id,
  } = address;
  const handleCreateBilling = () => {
    onCreateBilling({
      _id: id,
      receiver,
      phone,
      address: fullAddress,
      city,
      billingAddressField,
      state,
      country,
      billingCity,
      billingCountry,
      billingZip,
      billingState,
      zip,
    });
    onNextStep();
  };
  const handleDelete = async () => {
    const data = {
      id: user._id,
      _id: id,
    };
    await mutate(data);
  };

  return (
    <Card className={`card-main ${billing?._id === address?._id && "active"}`}>
      {isLoad ? (
        <Box className="card-label-skeleton">
          <Skeleton variant="text" width={200} height={40} />
        </Box>
      ) : (
        <Box className="card-label">
          <Typography variant="h5">{receiver}</Typography>
          {active && (
            <Label color="info" className="active">
              {t("default")}
            </Label>
          )}
        </Box>
      )}
      {isLoad ? (
        <Box className="card-label-skeleton">
          <Skeleton
            variant="text"
            width={30}
            height={40}
            className="first-skeleton"
          />
          <Skeleton variant="text" width={250} />
        </Box>
      ) : (
        <Typography>
          <div>
            <h5>Shipping Address</h5>
            <LocationOnIcon fontSize="small" />
            {fullAddress}, {city}, {state}, {country}, {zip}
          </div>
          <br />
          <h5>Billing Address</h5>
          <div style={{ margin: "15px" }}>
            <LocationOnIcon fontSize="small" />
            {billingAddressField}, {billingCity}, {billingState},
            {billingCountry}, {billingZip}
          </div>
        </Typography>
      )}
      {isLoad ? (
        <Box className="card-label-skeleton">
          <Skeleton
            variant="text"
            width={30}
            height={40}
            className="first-skeleton"
          />
          <Skeleton variant="text" width={200} />
        </Box>
      ) : (
        <Typography variant="body2" className="body2" color="text.secondary">
          <LocalPhoneIcon fontSize="small" />
          {phone}
        </Typography>
      )}

      <Box className="deliver-address-btn">
        {isLoad ? (
          <Box className="card-label-skeleton">
            <Skeleton
              variant="text"
              width={150}
              height={60}
              className="first-skeleton"
            />
            <Skeleton variant="text" width={30} height={60} />
          </Box>
        ) : (
          <>
            <Button
              variant="outlined"
              size="small"
              onClick={handleCreateBilling}
            >
              {t("deliver-address")}
            </Button>

            {!active && (
              <>
                <Box mx={0.5} />
                <Tooltip title="Delete this address">
                  <IconButton
                    aria-label="delete address"
                    onClick={handleDelete}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </>
        )}
      </Box>
    </Card>
  );
}
export default function CheckoutAccountAndBilling({ ...props }) {
  const { isLoading, addresses, setapicall, handleStepBack, handleAddStep } =
    props;
  const { t } = useTranslation("checkout");
  const { user, isAuthenticated } = useSelector(
    ({ user }: { user: any }) => user
  );
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNextStep = () => {
    dispatch(onNextStep());
    handleAddStep();
  };

  const handleBackStep = () => {
    dispatch(onBackStep());
    handleStepBack();
  };

  const handleCreateBilling = (value: any) => {
    dispatch(createBilling(value));
  };
  return isAuthenticated ? (
    <RootStyled>
      <Button
        size="small"
        variant="outlined"
        onClick={handleClickOpen}
        startIcon={<AddRoundedIcon />}
        className="add-address-btn"
      >
        {t("add-new-address")}
      </Button>
      {!isLoading && addresses?.length < 1 && (
        <NoDataFound className="no-data-found" />
      )}
      {(isLoading ? Array.from(new Array(4)) : addresses).map(
        (address: any, index: number) => {
          address = {
            ...address,
            phone: address?.phone || user?.phone,
            receiver: user?.name,
          };
          return (
            <AddressItem
              t={t}
              key={index}
              address={address}
              onNextStep={handleNextStep}
              onCreateBilling={handleCreateBilling}
              isLoad={isLoading}
              apicall={setapicall}
            />
          );
        }
      )}

      <Button
        size="small"
        color="inherit"
        onClick={handleBackStep}
        startIcon={<ArrowBackRoundedIcon />}
      >
        {t("back")}
      </Button>

      <CheckoutNewAddressForm
        open={open}
        onClose={handleClose}
        onNextStep={handleNextStep}
        onCreateBilling={handleCreateBilling}
        apicall={setapicall}
      />
    </RootStyled>
  ) : (
    <CheckoutGuest
      onNextStep={handleNextStep}
      handleStepBack={() => handleStepBack()}
      onCreateBilling={handleCreateBilling}
    />
  );
}
