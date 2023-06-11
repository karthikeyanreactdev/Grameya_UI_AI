// ** MUI Imports
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

const FallbackSpinner = ({ sx }) => {
  // ** Hook
  const theme = useTheme();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        ...sx,
      }}
    >
      <img height={100} width={100} alt="add-role" src="/images/g.jpg" />
      <CircularProgress disableShrink sx={{ mt: 8 }} />
    </Box>
  );
};

export default FallbackSpinner;
