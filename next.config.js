/** @type {import('next').NextConfig} */
const { withPlaiceholder } = require("@plaiceholder/next");
// const withPWA = require("next-pwa")({
//   // disable: process.env.NODE_ENV === "development",
//   dest: "public",
// });

const nextTranslate = require("next-translate");
// withPWA(
const nextConfig = nextTranslate(
  withPlaiceholder({
    env: {
      MONGO_URI: process.env.MONGO_URI,
      DOMAIN: process.env.DOMAIN,
      CLOUDINARY_PUBLISHABLE_KEY: process.env.CLOUDINARY_PUBLISHABLE_KEY,
      CLOUDINARY_SECRET_KEY: process.env.CLOUDINARY_SECRET_KEY,
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
      STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      EMAILJS_SERVICE_ID: process.env.EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID: process.env.EMAILJS_TEMPLATE_ID,
      EMAILJS_USER_ID: process.env.EMAILJS_USER_ID,
      WHATSAPP_NUMBER: process.env.WHATSAPP_NUMBER,
      SHIPPING_FEE: process.env.SHIPPING_FEE,
      CURRENCY: process.env.CURRENCY,
    },
    reactStrictMode: true,
    images: {
      formats: ["image/avif", "image/webp"],
      domains: ["res.cloudinary.com"],
    },
  })
);

// );
module.exports = nextConfig;
// https://nextjs.org/docs/api-reference/next/image
