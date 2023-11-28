// next
import useTranslation from "next-translate/useTranslation";

// material
import { Box, Stack, Typography, Avatar } from "@mui/material";

// styles
import RootStyled from "./styled"; 

export default function Brands({ ...props }) {
  const { t } = useTranslation("common");
  const { data } = props;   
  return (
    <RootStyled>
      <Typography mt={8} variant="h2" color="text.primary" textAlign="center">
        {t("header.brands")}
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        textAlign="center"
        className="description"
      >
        {t("header.lorem-ipsum")}
      </Typography>
      {
        <Stack direction="row" mb={5}>
          {data.map((v: any, i: BigInteger) => (
            <Box
              sx={{
                position: "relative",
                height: "100px",
                mx: 0.5,
                width: 200,
                mt: 1,
                svg: {
                  width: 100,
                },
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
              key={"home-brands-" + i}
            >
              <Avatar alt={v.name} src={v.cover.url} />
              <span style={{ marginTop: "1rem" }}>
                {v.name}
              </span>
            </Box>
          ))}
        </Stack>
      }
    </RootStyled>
  );
}
