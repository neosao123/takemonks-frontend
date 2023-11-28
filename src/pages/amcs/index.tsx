import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import { useSelector } from "react-redux";
import {
  Box,
  Grid,
  Container,
  TextField,
  IconButton,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AmcsList from "src/components/_main/amcs/amcslist";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// const Pagination = dynamic(() => import("src/components/pagination"));
import Pagination from "src/components/pagination";
const api = require("src/services");

function Listing({ ...props }) {
  const filteres = props;
  const { t } = useTranslation("listing");
  const router = useRouter();
  const { page: pageParam } = router.query;
  const [searchQuery, setSearchQuery] = useState(""); // State for the search query
  console.log(pageParam, "page");
  const { data, isLoading } = useQuery(["amcs", searchQuery, pageParam], () =>
    api.getAmcsforUser(pageParam || 1, searchQuery || "")
  );

  const generateRandomFAQs = () => {
    const questions = [
      "What is the AMCS?",
      "How do I apply for AMCS?",
      "What products are eligible for AMCS?",
      "Is there a deadline for applying for AMCS?",
      "How long does the AMCS application process take?",
      "Can I cancel my AMCS application?",
      "Are there any fees associated with AMCS?",
      "What documents do I need to submit with my AMCS application?",
      "How is the AMCS approval process conducted?",
      "What happens after my AMCS application is approved?",
    ];

    const answers = [
      "AMCS stands for Annual Maintenance and Support Contract. It provides ongoing maintenance and support services for products.",
      "To apply for AMCS, you need to fill out the online application form available on our website.",
      "AMCS is available for a wide range of products, including electronics, appliances, and gadgets.",
      "Yes, there is a deadline for AMCS applications. Please check our website for the current application deadline.",
      "The AMCS application process typically takes 5-7 business days.",
      "Yes, you can cancel your AMCS application at any time before approval.",
      "Yes, there are fees associated with AMCS. The fees depend on the type of product and level of support required.",
      "You need to submit proof of purchase and product details along with your AMCS application.",
      "The AMCS approval process includes a thorough review of the submitted documents and product inspection.",
      "After your AMCS application is approved, you will receive a confirmation email, and our support team will be in touch to schedule maintenance appointments.",
    ];

    const faqs = [];
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * questions.length);
      faqs.push({
        question: questions[randomIndex],
        answer: answers[randomIndex],
      });
    }

    return faqs;
  };
  const faqs = generateRandomFAQs();
  return (
    <Box sx={{ bgcolor: "background.default" }}>
      <Box
        sx={{
          mx: [2, 4, 6], // Adjust margin based on screen size
          my: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TextField
          label="Search AMCS For Product"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" size="small" sx={{ p: 0.5 }}>
                  <SearchIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
          fullWidth
          sx={{
            width: "100%", // Default width for small screens
            "@media (min-width: 600px)": {
              width: "80%", // Adjust width for screens larger than 600px
            },
            "@media (min-width: 960px)": {
              width: "60%", // Adjust width for screens larger than 960px
            },
          }}
        />
      </Box>

      <Grid container spacing={2} justifyContent="center">
        <Grid item md={9} xs={12}>
          <AmcsList row={data}></AmcsList>
          {!isLoading && data?.length !== 0 && <Pagination data={data} />}
        </Grid>
      </Grid>

      <Grid container spacing={2} justifyContent="center">
        <Grid item md={9} xs={12}>
          <Accordion
            sx={{
              mt: 2,
              width: "100%",
              backgroundColor: "white", // Set your desired background color
              border: "1px solid #ccc", // Set border style
              borderRadius: "15px", // Set border radius
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" sx={{ color: "#333" }}>
                Frequently Asked Questions
              </Typography>
            </AccordionSummary>
            {faqs.map((faq: any, index: any) => (
              <AccordionDetails key={index}>
                <Typography>
                  <strong>Q: {faq.question}</strong> <br />
                  A: {faq.answer}
                </Typography>
              </AccordionDetails>
            ))}
          </Accordion>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Listing;
// const { data, isLoading, isError } = useQuery(
//   ["user-details", searchQuery],
//   () => api.getAmcsforUser(`?page=${searchQuery || 1}`),
//   {
//     retry: false,
//     onError: (error: any) => {
//       console.error("Error fetching data:", error);
//     },
//   }
// );

//   const isMobile = useMediaQuery("(max-width:900px)");

// const handleSearch = () => {
//   // Update the API call with the search query parameter
//   // The useQuery hook will automatically update the data based on the new query
//   api.getAmcsforUser(+1, searchQuery || "");
// };

// const onPageChange = (page: any) => {
//   // Update the API call with the new page number
//   api.getAmcsforUser(page, searchQuery || "");
// };
