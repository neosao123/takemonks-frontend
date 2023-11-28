import React from "react";
import PropTypes from "prop-types";
import { useEffect } from "react";
// rtl
import rtlPlugin from "stylis-plugin-rtl";
// emotion
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import useSettings from "@settings/useSettings";
import { create } from "jss";
import rtl from "jss-rtl";
import { StylesProvider, jssPreset } from "@mui/styles";
// ----------------------------------------------------------------------

// Configure JSS
const jss = create({
  plugins: [...jssPreset().plugins, rtl()],
});

function RTL() {
  return <StylesProvider jss={jss} />;
}
RtlLayout.propTypes = {
  children: PropTypes.node,
};

export default function RtlLayout({ children }) {
  const { themeDirection } = useSettings();

  useEffect(() => {
    document.dir = themeDirection;
  }, [themeDirection]);

  const cacheRtl = createCache({
    key: themeDirection === "rtl" ? "muirtl" : "css",
    stylisPlugins: themeDirection === "rtl" ? [rtlPlugin] : [],
  });

  cacheRtl.compat = true;
  return themeDirection === "rtl" ? (
    <CacheProvider value={cacheRtl}>
      {/* {themeDirection === "rtl" && <RTL />} */}
      {children}
    </CacheProvider>
  ) : (
    <>{children}</>
  );
}
