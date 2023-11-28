import { sum, map, filter, uniqBy } from "lodash";
import { createSlice } from "@reduxjs/toolkit";
// utils
import { paramCase } from "change-case";

// ----------------------------------------------------------------------

interface initialStateProps {
  checkout: {
    activeStep: number;
    cart: any;
    discount: number;
    subtotal: number;
    total: number;
    shipping: number | string;
    billing: any;
  };
}
let shippingFee = "0";
const initialState: initialStateProps = {
  checkout: {
    activeStep: 0,
    cart: [],
    subtotal: 0,
    total: 0,
    discount: 0,
    shipping: parseInt(shippingFee as string),
    billing: null,
  },
};

const slice = createSlice({
  name: "product",
  initialState,
  reducers: {
    addShipping(state, action) {
      const shipping = action.payload;
      console.log(shipping, "Shipping charges");
      // shippingFee = shipping.data[0].settingValue;
      return {
        ...state,
        checkout: {
          ...state.checkout,
          shipping: shipping.data[0].settingValue,
        },
      };
    },
    // CHECKOUT
    getCart(state, action) {
      const cart = action.payload;
      console.log(cart, "here in the getting cart");
      const subtotal = cart.reduce((acc: any, prd: any) => {
        const priceSale = prd.priceSale || 0;
        const quantity = prd.quantity || 1;
        // const priceofAmcs = parseFloat(prd.priceofAmcs?.price.toString()) || 0;
        const priceofAmcs = 0;

        // Calculate the subtotal for each product and accumulate it
        const productSubtotal =
          priceSale !== 0 ? priceSale * quantity : priceofAmcs * quantity;

        return acc + productSubtotal;
      }, 0);
      let sub = parseFloat(subtotal);
      console.log(subtotal);
      const discount = cart.length === 0 ? 0 : state.checkout.discount;
      const shipping = cart.length === 0 ? 0 : state.checkout.shipping;
      const billing = cart.length === 0 ? 0 : state.checkout.billing;

      let abc = "";
      abc += shipping;
      console.log(" here in the shipping ", shipping, discount, sub);

      let totalCharge = sub + discount;
      return {
        ...state,
        checkout: {
          ...state.checkout,
          cart,
          discount,
          shipping,
          billing,
          subtotal, // Set the calculated subtotal
          total: sub + discount + parseInt(abc), // Calculate the total based on your logic
        },
      };
    },

    addCart(state, action) {
      const product = action.payload;
      const updatedProduct = {
        ...product,
        sku: paramCase(`${product.name} ${product.size} ${product.color}`),
      };
      const isEmptyCart = state.checkout.cart.length === 0;
      if (isEmptyCart) {
        state.checkout.cart = [...state.checkout.cart, updatedProduct];
      } else {
        state.checkout.cart = map(state.checkout.cart, (_product) => {
          const isExisted = _product.sku === updatedProduct.sku;
          if (isExisted) {
            return {
              ..._product,
              quantity: _product.quantity + 1,
            };
          }
          return _product;
        });
      }
      state.checkout.cart = uniqBy(
        [...state.checkout.cart, updatedProduct],
        "sku"
      );
    },
    addAmcCart(state, action) {
      const product = action.payload;
      const updatedProduct = {
        ...product,
        sku: paramCase(
          `${product.name} ${product.size} ${product.color} ${product.id}`
        ),
      };
      const isEmptyCart = state.checkout.cart.length === 0;
      console.log("Inside in the add amcs in there here I am ", product);
      if (isEmptyCart) {
        state.checkout.cart = [...state.checkout.cart, updatedProduct];
      } else {
        state.checkout.cart = map(state.checkout.cart, (_product) => {
          const isExisted = _product.id == updatedProduct.id;
          if (isExisted) {
            return {
              ..._product,
              quantity: _product.quantity + 1,
            };
          }
          return _product;
        });
      }
      state.checkout.cart = uniqBy(
        [...state.checkout.cart, updatedProduct],
        "sku"
      );
    },

    deleteCart(state, action) {
      console.log("here I am  in redux delete", state);
      const updateCart = filter(
        state.checkout.cart,
        (item) => item.sku !== action.payload
      );

      state.checkout.cart = updateCart;
    },
    removeAmcsfromCart(state, action) {
      const updateCart = filter(
        state.checkout.cart,
        (item) => item.sku !== action.payload
      );

      state.checkout.cart = updateCart;
    },

    resetCart(state) {
      state.checkout.activeStep = 0;
      state.checkout.cart = [];
      state.checkout.total = 0;
      state.checkout.subtotal = 0;
      state.checkout.discount = 0;
      state.checkout.shipping = 0;
      state.checkout.billing = null;
    },

    onBackStep(state) {
      state.checkout.activeStep -= 1;
    },

    onNextStep(state) {
      state.checkout.activeStep += 1;
    },

    onGotoStep(state, action) {
      const goToStep = action.payload;
      state.checkout.activeStep = goToStep;
    },

    increaseQuantity(state, action) {
      const productSku = action.payload;
      const updateCart = map(state.checkout.cart, (product) => {
        if (product.sku === productSku) {
          return {
            ...product,
            quantity: product.quantity + 1,
          };
        }
        return product;
      });

      state.checkout.cart = updateCart;
    },
    increaseAmcsQuantity(state, action) {
      const productSku = action.payload;
      const updateCart = map(state.checkout.cart, (product) => {
        if (product.id === productSku) {
          return {
            ...product,
            quantity: product.quantity + 1,
          };
        }
        return product;
      });

      state.checkout.cart = updateCart;
    },

    decreaseQuantity(state, action) {
      const productSku = action.payload;
      const updateCart = map(state.checkout.cart, (product) => {
        if (product.sku === productSku) {
          return {
            ...product,
            quantity: product.quantity - 1,
          };
        }
        return product;
      });

      state.checkout.cart = updateCart;
    },

    createBilling(state, action) {
      state.checkout.billing = action.payload;
    },

    applyDiscount(state, action) {
      const discount = action.payload;
      state.checkout.discount = discount;
      state.checkout.total = state.checkout.subtotal - discount;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  getCart,
  addCart,
  resetCart,
  onGotoStep,
  onBackStep,
  onNextStep,
  deleteCart,
  createBilling,
  applyDiscount,
  increaseQuantity,
  increaseAmcsQuantity,
  decreaseQuantity,
  addShipping,
  addAmcCart,
} = slice.actions;
