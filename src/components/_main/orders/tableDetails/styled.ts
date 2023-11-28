import { styled, alpha } from "@mui/material/styles";
import { createGradient } from "src/theme/palette";
const RootStyled = styled('div')(({ theme }) => ({
     "& .table-main": {
          minWidth: 800,
          "& .head-row": {
               background: createGradient(
                    theme.palette.primary.main,
                    theme.palette.primary.dark
               ),
               "& .head-row-cell": {
                    color: theme.palette.common.white
               }
          },
          "& .body-row-cell": {
               display: "flex",
               alignItems: "center",
          }
     }
}));
export default RootStyled;