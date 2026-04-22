import { Box, LinearProgress, Typography } from "@mui/material";

export default function ProgressBar({ value }) {

  return (

    <Box sx={{ width: "100%" }}>

      <LinearProgress
        variant="determinate"
        value={value}
        sx={{ height: 10, borderRadius: 5 }}
      />

      <Typography
        variant="body2"
        sx={{ mt: 1 }}
      >
        {value}% complete
      </Typography>

    </Box>

  );

}