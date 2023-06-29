import {
  Autocomplete,
  Box,
  Checkbox,
  Chip,
  Drawer,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { LoadingButton } from "@mui/lab";
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";
import DatePicker from "react-datepicker";
import { useTheme } from "@mui/material/styles";
import useNotification from "src/hooks/useNotification";
import { addCertificationSeeker } from "src/api-services/seeker/profile";

const AddCertification = ({
  isOpen,
  onClose,
  getProfileDetail,
  onHandleChangeLoading,
}) => {
  const theme = useTheme();
  const { direction } = theme;
  const popperPlacement = direction === "ltr" ? "bottom-start" : "bottom-end";
  const [submitted, setSubmitted] = useState(false);
  const [sendNotification] = useNotification();
  const [formValue, setFormValue] = useState({
    certification_name: "",
    cartification_completion_id: "",
    cartification_url: "",
    certification_valid_from: "",
    certification_valid_to: "",
    no_expiry_time: false,
  });

  const handleClose = () => {
    onClose("isAddCertification");
  };

  const handleFormInputChange = (e) => {
    const newFormValue = { ...formValue };
    const { name, value } = e.target;
    newFormValue[name] = value;
    setFormValue(newFormValue);
  };

  const handleFormSubmit = async () => {
    setSubmitted(true);
    if (
      !formValue?.certification_name ||
      !formValue?.cartification_completion_id ||
      !formValue?.cartification_url ||
      !formValue?.certification_valid_from ||
      !formValue?.certification_valid_to
    ) {
      return;
    }
    onHandleChangeLoading(true);
    try {
      const response = await addCertificationSeeker(formValue);

      console.log("response", response);
      if (response.status === 200) {
        sendNotification({
          message: response?.data?.message,
          variant: "success",
        });
        getProfileDetail();
        handleClose();
      }
    } catch (e) {
      console.log("e", e);
    } finally {
      onHandleChangeLoading(false);
    }
  };

  const handleDateChange = (parentName, value) => {
    const newFormValue = { ...formValue };
    newFormValue[parentName] = value;
    setFormValue(newFormValue);
  };

  const handleCheckBoxChange = (e) => {
    const newFormValue = { ...formValue };
    const { name, checked } = e.target;
    newFormValue[name] = checked;
    setFormValue(newFormValue);
  };

  return (
    <>
      <Drawer anchor="right" open={isOpen} onClose={handleClose}>
        <Box sx={{ maxWidth: 500 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 4,
            }}
          >
            <Typography variant="h3" component="div">
              Add Certification
            </Typography>

            <IconButton aria-label="close" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ p: (theme) => theme.spacing(0, 6, 6) }}>
            <Grid container spacing={0}>
              <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
                <TextField
                  sx={{ mb: 2 }}
                  label={"Certification Name"}
                  fullWidth
                  name="certification_name"
                  onChange={handleFormInputChange}
                  value={formValue.certification_name}
                  error={submitted && !formValue.certification_name}
                  helperText={
                    submitted &&
                    !formValue.certification_name &&
                    "Certification Name is required"
                  }
                />
              </Grid>

              <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
                <TextField
                  sx={{ mb: 2 }}
                  label={"Cartification Completion ID"}
                  fullWidth
                  name="cartification_completion_id"
                  onChange={handleFormInputChange}
                  value={formValue.cartification_completion_id}
                  error={submitted && !formValue.cartification_completion_id}
                  helperText={
                    submitted &&
                    !formValue.cartification_completion_id &&
                    "Cartification Completion ID is required"
                  }
                />
              </Grid>

              <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
                <TextField
                  sx={{ mb: 2 }}
                  label={"Cartification Completion URL"}
                  fullWidth
                  name="cartification_url"
                  onChange={handleFormInputChange}
                  value={formValue.cartification_url}
                  error={submitted && !formValue.cartification_url}
                  helperText={
                    submitted &&
                    !formValue.cartification_url &&
                    "Cartification Completion URL is required"
                  }
                />
              </Grid>

              <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
                <Box
                  sx={{
                    width: "100%",
                    mt: 2,
                  }}
                  className="demo-space-xe"
                >
                  <DatePickerWrapper>
                    <DatePicker
                      id="join-date"
                      fullWidth
                      sx={{ width: 1 }}
                      popperPlacement={popperPlacement}
                      selected={formValue.certification_valid_from}
                      onChange={(date) => {
                        handleDateChange("certification_valid_from", date);
                      }}
                      dateFormat="dd/MM/yyyy"
                      customInput={
                        <TextField
                          sx={{ mb: 2 }}
                          label={"Certification Valid From"}
                          fullWidth
                          error={
                            submitted && !formValue.certification_valid_from
                          }
                          helperText={
                            submitted &&
                            !formValue.start_date &&
                            "Certification Valid From is required"
                          }
                        />
                      }
                    />
                  </DatePickerWrapper>
                </Box>
              </Grid>

              <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
                <Box
                  sx={{
                    width: "100%",
                    mt: 2,
                  }}
                  className="demo-space-xe"
                >
                  <DatePickerWrapper>
                    <DatePicker
                      id="join-date"
                      selected={formValue.certification_valid_to}
                      dateFormat="dd/MM/yyyy"
                      fullWidth
                      sx={{ width: 1 }}
                      popperPlacement={popperPlacement}
                      onChange={(date) => {
                        handleDateChange("certification_valid_to", date);
                      }}
                      customInput={
                        <TextField
                          sx={{ mb: 2 }}
                          label={"Certification Valid To"}
                          // value={formValue.end_date}
                          fullWidth
                          error={submitted && !formValue.certification_valid_to}
                          helperText={
                            submitted &&
                            !formValue.certification_valid_to &&
                            "Certification Valid To is required"
                          }
                        />
                      }
                    />
                  </DatePickerWrapper>
                </Box>
              </Grid>
              <Grid item lg={12} xl={12} xs={12} md={6} sm={12}>
                <FormGroup fullWidth sx={{ my: 2 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={handleCheckBoxChange}
                        name="no_expiry_time"
                        checked={formValue.no_expiry_time}
                      />
                    }
                    label="Is expairy time for Certification"
                  />
                </FormGroup>
              </Grid>

              <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
                <LoadingButton
                  fullWidth
                  variant="contained"
                  onClick={handleFormSubmit}
                >
                  Save
                </LoadingButton>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default AddCertification;
