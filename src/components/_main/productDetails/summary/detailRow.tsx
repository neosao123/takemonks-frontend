
import {
    Box,
    Grid,
    Typography,
} from "@mui/material";


export default function DetailRow({ ...props }) {
    const { translation, value } = props;
    return (
        <Box>
            <Grid container spacing={2} mb={2}>
                <Grid item xs={4}>
                    <Box>
                        <Typography>
                            {translation}
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={8}>
                    <Box>
                        <Typography sx={{ fontWeight: 600 }}>{value}</Typography>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}