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
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { LoadingButton } from "@mui/lab";
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";
import DatePicker from "react-datepicker";
import { useTheme } from "@mui/material/styles";
import useNotification from "src/hooks/useNotification";
import {
  addCertificationSeeker,
  editCertificationSeeker,
} from "src/api-services/seeker/profile";

const AddCertification = ({
  isOpen,
  onClose,
  getProfileDetail,
  selectedCertificate,
}) => {
  const theme = useTheme();
  const { direction } = theme;
  const popperPlacement = direction === "ltr" ? "bottom-start" : "bottom-end";
  const [submitted, setSubmitted] = useState(false);
  const [sendNotification] = useNotification();
  const [formValue, setFormValue] = useState({
    certification_name: "",
    certification_completion_id: "",
    certification_url: "",
    certification_valid_from: "",
    certification_valid_to: "",
    no_expiry_time: false,
  });
  const [isLoading, setIsLoading] = useState();

  useEffect(() => {
    if (!selectedCertificate) {
      return;
    }
    const newFormValue = { ...formValue };
    newFormValue.certification_name = selectedCertificate.certification_name;
    newFormValue.certification_completion_id =
      selectedCertificate.certification_completion_id;
    newFormValue.certification_url = selectedCertificate.certification_url;
    newFormValue.certification_valid_from = new Date(
      selectedCertificate.certification_valid_from
    );
    newFormValue.certification_valid_to = new Date(
      selectedCertificate.certification_valid_to
    );
    newFormValue.no_expiry_time = selectedCertificate.no_expiry_time;
    console.log("selectedCertificate", selectedCertificate);
    setFormValue(newFormValue);
  }, []);

  function validateURL(url) {
    // Regular expression pattern for URL validation
    // var urlPattern = /^(https?:\/\/)?(www\.)?[a-z0-9\-]+(\.[a-z]{2,})(\/.*)?$/i;
    var pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    return !!pattern.test(url);

    // // Test the URL against the pattern
    // return urlPattern.test(url);
  }

  const handleClose = () => {
    onClose("isAddCertification");
  };

  const handleFormInputChange = (e) => {
    const newFormValue = { ...formValue };
    const { name, value } = e.target;
    newFormValue[name] = value;
    setFormValue(newFormValue);
  };

  const callSubmitApi = async (formValue) => {
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
      setIsLoading(false);
    }
  };

  const callEditSubmitApi = async (apiDate) => {
    try {
      const response = await editCertificationSeeker(apiDate);

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
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async () => {
    setSubmitted(true);
    if (
      !formValue?.certification_name ||
      !formValue?.certification_completion_id ||
      !formValue?.certification_url ||
      !formValue?.certification_valid_from ||
      !formValue?.certification_valid_to
    ) {
      return;
    }
    if (!validateURL(formValue?.certification_url)) {
      return;
    }
    if (selectedCertificate) {
      setIsLoading(true);
      formValue.id = selectedCertificate.id;
      callEditSubmitApi(formValue);
    } else {
      setIsLoading(true);
      callSubmitApi(formValue);
    }
  };

  const handleDateChange = (parentName, value) => {
    const newFormValue = { ...formValue };
    console.log("parentName", parentName);
    if (parentName === "certification_valid_from") {
      newFormValue["certification_valid_from"] = value;
      newFormValue["certification_valid_to"] = "";
      setFormValue(newFormValue);
      return;
    }
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
              {selectedCertificate ? "Edit Certification" : "Add Certification"}
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
                  label={"Certification Completion ID"}
                  fullWidth
                  name="certification_completion_id"
                  onChange={handleFormInputChange}
                  value={formValue.certification_completion_id}
                  error={submitted && !formValue.certification_completion_id}
                  helperText={
                    submitted &&
                    !formValue.certification_completion_id &&
                    "Certification Completion ID is required"
                  }
                />
              </Grid>

              <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
                <TextField
                  sx={{ mb: 2 }}
                  label={"Certification Completion URL"}
                  fullWidth
                  name="certification_url"
                  onChange={handleFormInputChange}
                  value={formValue.certification_url}
                  error={
                    (submitted && !formValue.certification_url) ||
                    (submitted && !validateURL(formValue?.certification_url))
                  }
                  helperText={
                    <>
                      {submitted &&
                        !formValue.certification_url &&
                        "Certification Completion URL is required"}
                      {submitted &&
                        formValue?.certification_url &&
                        !validateURL(formValue?.certification_url) &&
                        "Certification Completion URL is invalid"}
                    </>
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
                      minDate={formValue.certification_valid_from}
                      sx={{ width: 1 }}
                      popperPlacement={popperPlacement}
                      onChange={(date) => {
                        handleDateChange("certification_valid_to", date);
                      }}
                      customInput={
                        <TextField
                          sx={{ mb: 2 }}
                          label={"Certification Valid To"}
                          value={formValue.certification_valid_to}
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
                  loading={isLoading}
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
