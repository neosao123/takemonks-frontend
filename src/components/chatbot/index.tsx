import React from "react";
import RootStyled from "./styled";
import { Configuration, OpenAIApi } from "openai";
// next
import useTranslation from "next-translate/useTranslation";
import {
  Typography,
  Stack,
  IconButton,
  TextField,
  InputAdornment,
  Box,
  Collapse,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import Typewriter from "typewriter-effect";
import { useQuery } from "react-query";
import * as api from "src/services";
import config from "src/layout/config.json";
const questions = [
  "What is Commercehope?",
  "what is the list of currencies integrated in Commercehope?",
  "What locales are used in Commercehope?",
  "What is the total number of products?",
  "What colors and sizes are available?",
  "What brands does Commercehope carry?",
];
const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);
export default function Chatbot() {
  const { t } = useTranslation("common");
  const { data: allProducts, isLoading } = useQuery("all products", () =>
    api.getAllProducts()
  );

  const [state, setState] = React.useState<any>({
    data: [],
    search: "",
    loading: false,
    open: false,
  });
  const [isTyping, setTyping] = React.useState(false);

  const onClick = async (val: any) => {
    const { data } = state;
    const questionAdded = {
      question: val || state.search,
      answer: null,
      id: Math.random(),
    };
    setState({
      ...state,
      loading: true,
      search: "",
      data: [...data, questionAdded],
    });
    // const mappedIntoPrice = allProducts?.data.map(({ priceSale, ...v }) => ({
    //   ...v,
    //   price: priceSale,
    // }));

    setTyping(true);
    const prompt = `${val || state.search}\n${JSON.stringify({
      products: allProducts?.data,
      totalProducts: allProducts?.total,
      current_currency: "US$",
      commercehope:
        "COMMERCEHOPE is a complete script for eCommerce solutions that gives you the power to create your eCommerce web application. COMMERCEHOPE is developed with the latest technologies such as ReactJS, NextJS, Material UI, MongoDB & Mongoose. Users can buy it directly from Codecanyon.",
      Multilingual: "(English & Arabic) with RTL",
      Multi_currency: `${config.currencies.map((v: any) => ({
        currency: t(v.name),
      }))}`,
    })}`;
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.3,
      max_tokens: 200,
      top_p: 1.0,
      frequency_penalty: 0.5,
      presence_penalty: 0.0,
      stop: "/n",
    });

    setState({
      ...state,
      search: "",
      loading: false,
      data: [
        ...data,
        { ...questionAdded, answer: response.data.choices[0].text },
      ],
    });
  };

  return (
    <RootStyled>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        className="header"
      >
        <Typography
          variant="subtitle2"
          color="common.white"
          onClick={() => setState({ ...state, open: !state.open })}
        >
          AI Chatbot
        </Typography>
        {state.open ? (
          <IconButton
            aria-label="close"
            size="small"
            onClick={() => setState({ ...state, open: false })}
          >
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        ) : (
          <IconButton
            aria-label="open"
            size="small"
            onClick={() => setState({ ...state, open: true })}
          >
            <ExpandLessRoundedIcon fontSize="small" />
          </IconButton>
        )}
      </Stack>
      <Collapse in={state.open}>
        <>
          <Stack className="body">
            {!state.data.length && (
              <Stack gap={1}>
                {questions.map((item) => (
                  <Typography
                    mb={0}
                    variant="subtitle2"
                    fontSize={13}
                    color="common.white"
                    className="pre-question"
                    onClick={() => {
                      setState({ ...state, search: item });
                      onClick(item);
                    }}
                  >
                    {item}
                  </Typography>
                ))}
              </Stack>
            )}
            {state.data.map((item: any, index: number) => (
              <Box key={Math.random()} mb={1}>
                <Typography variant="subtitle1" color="text.primary">
                  {index + 1}. {item.question}
                </Typography>

                {state.data.length - 1 === index && isTyping ? (
                  <>
                    {!state.loading ? (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontSize={14}
                      >
                        <Typewriter
                          options={{
                            autoStart: true,
                            delay: 20,
                          }}
                          onInit={(typewriter) => {
                            typewriter
                              .typeString(item.answer)
                              .callFunction(() => {
                                setTyping(false);
                              })
                              .start();
                          }}
                        />
                      </Typography>
                    ) : (
                      <Typography
                        component="span"
                        color="text.primary"
                        className="cursor-blink"
                      >
                        |
                      </Typography>
                    )}
                  </>
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontSize={14}
                  >
                    {item.answer}
                  </Typography>
                )}
              </Box>
            ))}
          </Stack>
          <Stack className="action">
            <TextField
              id="search"
              // value={}
              // onChange={}
              placeholder="Enter a query"
              size="small"
              multiline
              maxRows={4}
              fullWidth
              variant="outlined"
              value={state.search}
              onChange={(e) =>
                setState({
                  ...state,
                  search: e.target.value,
                })
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="send"
                      size="small"
                      disabled={!Boolean(state.search)}
                      onClick={() => onClick(null)}
                    >
                      <SendRoundedIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </>
      </Collapse>
    </RootStyled>
  );
}
