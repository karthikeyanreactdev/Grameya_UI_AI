import {
  Box,
  Drawer,
  FormControl,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { LoadingButton } from "@mui/lab";
import { validateEmail } from "src/utils/commonUtils";
import { useDispatch } from "react-redux";
import { resendEmailVerify } from "src/store/apps/auth";
import useNotification from "src/hooks/useNotification";

const ResendVerificationEmail = (props) => {
  const { isOpen, onClose } = props;
  const [formValue, setFormValue] = useState({
    email: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState();
  const dispatch = useDispatch();
  const [sendNotification] = useNotification();

  const handleClose = () => {
    setFormValue({
      email: "",
    });
    onClose();
  };

  const handleInputChange = (e) => {
    const newStateValue = { ...formValue };
    newStateValue[e.target.name] = e.target.value;
    setFormValue(newStateValue);
  };

  const handleSubmit = async () => {
    setSubmitted(true);

    if (!formValue.email) {
      return;
    }
    if (!validateEmail(formValue.email)) {
      return;
    }
    console.log("formValue", formValue);
    setIsLoading(true);
    const response = await dispatch(
      resendEmailVerify({
        formValue: formValue,
      })
    );
    console.log("response", response);
    if (response.payload?.data) {
      sendNotification({
        message: response.payload?.data?.message,
        variant: "success",
      });
    } else {
      sendNotification({
        message: response.payload?.message,
        variant: "error",
      });
    }
    setIsLoading(false);
  };

  return (
    <div>
      <Drawer anchor="right" open={isOpen} onClose={handleClose}>
        <Box sx={{ width: 500 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 4,
            }}
          >
            <Typography variant="h5" component="div">
              Resend Verification email
            </Typography>

            <IconButton aria-label="close" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ p: (theme) => theme.spacing(0, 6, 6) }}>
            <Grid container spacing={0}>
              <Grid container spacing={2} py={2}>
                <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
                  <FormControl fullWidth sx={{ my: 2 }}>
                    <TextField
                      sx={{ mb: 2 }}
                      label={"Email *"}
                      // required
                      fullWidth
                      onChange={handleInputChange}
                      name="email"
                      helperText={
                        <>
                          {submitted && !formValue?.email && (
                            <>Email is required</>
                          )}
                          {submitted &&
                            formValue.email &&
                            !validateEmail(formValue.email) && (
                              <> Please enter the valid email</>
                            )}
                        </>
                      }
                      error={
                        (submitted && !formValue?.email) ||
                        (submitted &&
                          formValue?.email &&
                          !validateEmail(formValue.email))
                      }
                      value={formValue?.email}
                    />
                  </FormControl>
                </Grid>
              </Grid>

              <Grid item lg={12} xl={12} xs={12} md={12} sm={12} sx={{ mt: 0 }}>
                <LoadingButton
                  fullWidth
                  variant="contained"
                  onClick={handleSubmit}
                  loading={isLoading}
                >
                  Submit
                </LoadingButton>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Drawer>
    </div>
  );
};

export default ResendVerificationEmail;
