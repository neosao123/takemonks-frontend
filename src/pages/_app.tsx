import React from "react";
import type { AppProps } from "next/app";

// next seo
import { DefaultSeo } from "next-seo";
import SEO from "next-seo.config";
import { useRouter } from "next/router";

// theme provider
import ThemeProvider from "src/theme";
import GlobalStyles from "src/theme/globalStyles";
import ThemePrimaryColor from "src/components/themePrimaryColor";

// contexts
import { AuthProvider } from "src/contexts/JWTContext";

// redux
import { Provider as ReduxProvider } from "react-redux";
import { store } from "src/redux/store";

// react-qurery
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";

// notification toaster
import { Toaster } from "react-hot-toast";

// layout
import Layout from "src/layout";
import { motion, useScroll, useSpring } from "framer-motion";

// ProgressBar
import ProgressBar from "src/components/progressBar";

// axios
import axios from "axios";

// chatbot
import Chatbot from "src/components/chatbot";

export async function getServerSideProps({ ...props }) {
  const { req, res } = props;
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );

  return {
    props: {},
  };
}

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      })
  );
  const { pathname } = useRouter();
  const isDemo = pathname === "/demo";
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  React.useEffect(() => {
    const fetchApi = async () => {
      await axios.get("/api/empty");
    };
    fetchApi();
  }, []);

  return (
    <>
      <motion.div className="progress-bar" style={{ scaleX }} />
      <DefaultSeo {...SEO} />
      <Toaster position="top-center" reverseOrder={false} />
      <ReduxProvider store={store}>
        <ThemeProvider>
          <AuthProvider>
            <ThemePrimaryColor>
              <QueryClientProvider client={queryClient}>
                <Hydrate state={pageProps.dehydratedState}>
                  {/*
                      dt.19-jun-2023 commented 
                     <Chatbot />
                     */}
                  {isDemo ? (
                    <>
                      <GlobalStyles />
                      <ProgressBar />
                      <Component {...pageProps} />
                    </>
                  ) : (
                    <Layout>
                      <GlobalStyles />
                      <ProgressBar />
                      <Component {...pageProps} />
                    </Layout>
                  )}
                </Hydrate>
              </QueryClientProvider>
            </ThemePrimaryColor>
          </AuthProvider>
        </ThemeProvider>
      </ReduxProvider>
    </>
  );
}
