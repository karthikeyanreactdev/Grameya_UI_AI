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
import { addJobseekerExperience } from "src/api-services/seeker/profile";

const AddNewExperiance = ({
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
  const [skills, setSkills] = useState([
    { id: 1, name: "Node.js" },
    { id: 2, name: "Flutter" },
    { id: 3, name: "Java" },
  ]);
  const [formValue, setFormValue] = useState({
    company_name: "",
    designation: "",
    skills: [],
    start_date: "",
    end_date: "",
    is_current_company: false,
  });

  const handleClose = () => {
    onClose("isAddNewExperiance");
  };

  const handleFormInputChange = (e) => {
    const newFormValue = { ...formValue };
    const { name, value } = e.target;
    newFormValue[name] = value;
    setFormValue(newFormValue);
  };

  const handleMultiSelectChange = (parentName, value) => {
    const newFormValue = { ...formValue };
    newFormValue[parentName] = value;
    setFormValue(newFormValue);
  };

  const handleFormSubmit = async () => {
    setSubmitted(true);
    if (
      !formValue?.company_name ||
      !formValue?.designation ||
      !formValue?.end_date ||
      formValue?.skills.length === 0 ||
      !formValue.start_date
    ) {
      return;
    }
    onHandleChangeLoading(true);
    try {
      const response = await addJobseekerExperience(formValue);

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
              Add Experiance
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
                  label={"Company Name"}
                  fullWidth
                  name="company_name"
                  onChange={handleFormInputChange}
                  value={formValue.company_name}
                  error={submitted && !formValue.company_name}
                  helperText={
                    submitted &&
                    !formValue.company_name &&
                    "Company Name is required"
                  }
                />
              </Grid>

              <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
                <TextField
                  sx={{ mb: 2 }}
                  label={"Designation"}
                  fullWidth
                  name="designation"
                  onChange={handleFormInputChange}
                  value={formValue.designation}
                  error={submitted && !formValue.designation}
                  helperText={
                    submitted &&
                    !formValue.designation &&
                    "Designation is required"
                  }
                />
              </Grid>
              <Grid item lg={12} xl={12} md={12} xs={12} sm={12}>
                <Autocomplete
                  multiple
                  error={submitted && formValue.skills.length === 0}
                  value={formValue.skills}
                  id="tags-filled"
                  onChange={(event, newValue) => {
                    handleMultiSelectChange("skills", newValue);
                  }}
                  // options={categoryList}
                  options={skills.map((option) => option.name)}
                  freeSolo
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Skills"
                      placeholder="Skills"
                      error={submitted && formValue.skills.length === 0}
                      helperText={
                        submitted &&
                        formValue.skills.length === 0 &&
                        "Skills is required"
                      }
                    />
                  )}
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
                      selected={formValue.start_date}
                      onChange={(date) => {
                        handleDateChange("start_date", date);
                      }}
                      dateFormat="dd/MM/yyyy"
                      customInput={
                        <TextField
                          sx={{ mb: 2 }}
                          label={"Start Date"}
                          fullWidth
                          error={submitted && !formValue.start_date}
                          helperText={
                            submitted &&
                            !formValue.start_date &&
                            "Start Date is required"
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
                      selected={formValue.end_date}
                      dateFormat="dd/MM/yyyy"
                      fullWidth
                      sx={{ width: 1 }}
                      popperPlacement={popperPlacement}
                      onChange={(date) => {
                        handleDateChange("end_date", date);
                      }}
                      customInput={
                        <TextField
                          sx={{ mb: 2 }}
                          label={"End Date"}
                          // value={formValue.end_date}
                          fullWidth
                          error={submitted && !formValue.end_date}
                          helperText={
                            submitted &&
                            !formValue.end_date &&
                            "End Date is required"
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
                        name="is_current_company"
                        checked={formValue.is_current_company}
                      />
                    }
                    label="Is this your current company"
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

export default AddNewExperiance;
