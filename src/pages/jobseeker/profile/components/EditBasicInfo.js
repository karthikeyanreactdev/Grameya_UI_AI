import {
  Autocomplete,
  Box,
  Checkbox,
  Chip,
  Drawer,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { LoadingButton } from "@mui/lab";
import { updateProfile } from "src/api-services/seeker/profile";
import useNotification from "src/hooks/useNotification";

// [
//   "Node.js",
//   "Flutter",
//   "Java",
//   "Angular",
//   "PHP",
//   "My SQL",
//   "MongoDB"
// ]
const EditBasicInfo = ({ isOpen, onClose, userDetail, getProfileDetail }) => {
  const [categoryList, setCategoryList] = useState([
    { id: 1, jobCategory: "IT" },
    { id: 2, jobCategory: "BPO" },
    { id: 3, jobCategory: "Banking" },
    { id: 4, jobCategory: "HR" },
  ]);
  const [location, setLocation] = useState([
    { id: 1, name: "Trichy" },
    { id: 2, name: "Chennai" },
    { id: 3, name: "Coimbatore" },
    { id: 3, name: "Kulithalai" },
  ]);
  const [skills, setSkills] = useState([
    { id: 1, name: "Node.js" },
    { id: 2, name: "Flutter" },
    { id: 3, name: "Java" },
  ]);
  const [submitted, setSubmitted] = useState(false);
  const [formValue, setFormValue] = useState({
    full_name: "",
    alternate_phone: "",
    // first_name: "",
    // last_name: "",
    resume_headline: "",
    designation: "",
    notice_period: "",
    // qualification: "",
    degree: "",
    // institution: "",
    // year_of_passout: "",
    // any_secial_course_completed: "",
    total_years_of_experience: "",
    current_salary: "",
    expected_salary: "",
    current_location: "",
    preferred_job_location: [],
    skills: [],
    actively_looking_for_job: false,
  });
  const [sendNotification] = useNotification();
  console.log("formValue", formValue);

  useEffect(() => {
    console.log("userDetail", userDetail);
    const newFormValue = { ...formValue };
    newFormValue.full_name = userDetail.full_name || "";
    // newFormValue.last_name = userDetail.last_name || "";
    newFormValue.resume_headline =
      userDetail.jobseekerDetails?.resume_headline || "";
    newFormValue.designation = userDetail?.jobseekerDetails?.designation || "";
    newFormValue.alternate_phone = userDetail.alternate_phone || "";
    newFormValue.current_location =
      userDetail?.jobseekerDetails?.current_location || "";
    newFormValue.degree = userDetail?.jobseekerDetails?.degree || "";
    newFormValue.total_years_of_experience =
      userDetail.jobseekerDetails?.total_years_of_experience || "";

    newFormValue.current_salary =
      userDetail.jobseekerDetails?.current_salary.toString() || "";
    newFormValue.expected_salary =
      userDetail.jobseekerDetails?.expected_salary.toString() || "";
    newFormValue.notice_period =
      userDetail.jobseekerDetails?.notice_period || "";
    newFormValue.skills = userDetail.jobseekerDetails?.skills || [];
    newFormValue.preferred_job_location =
      userDetail.jobseekerDetails?.preferred_job_location || [];

    setFormValue(newFormValue);
  }, []);

  const handleClose = () => {
    onClose("isBasicInfoEdit");
  };

  const handleFormSubmit = async () => {
    setSubmitted(true);
    if (
      !formValue?.full_name ||
      !formValue?.alternate_phone ||
      !formValue?.resume_headline ||
      !formValue?.notice_period ||
      !formValue?.degree ||
      // !formValue?.year_of_passout ||
      !formValue?.total_years_of_experience ||
      !formValue?.current_salary ||
      !formValue?.expected_salary ||
      formValue?.preferred_job_location === 0 ||
      formValue?.skills === 0 ||
      !formValue?.full_name
    ) {
      return;
    }
    try {
      const response = await updateProfile(formValue);

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
    }
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
              Edit
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
                  label={"Resume Headline"}
                  fullWidth
                  multiline
                  minRows={2}
                  name="resume_headline"
                  onChange={handleFormInputChange}
                  value={formValue.resume_headline}
                  error={submitted && !formValue.resume_headline}
                  helperText={
                    submitted &&
                    !formValue.resume_headline &&
                    "First Name is required"
                  }
                />
              </Grid>
              <Grid container spacing={2} py={2}>
                <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
                  <TextField
                    sx={{ mb: 2 }}
                    label={"Full Name"}
                    required
                    fullWidth
                    name="full_name"
                    onChange={handleFormInputChange}
                    value={formValue.full_name}
                    error={submitted && !formValue.full_name}
                    helperText={
                      submitted &&
                      !formValue.full_name &&
                      "Full Name is required"
                    }
                  />
                </Grid>
                {/* <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                  <TextField
                    sx={{ mb: 2 }}
                    label={"Last Name"}
                    required
                    fullWidth
                    name="last_name"
                    value={formValue.last_name}
                    onChange={handleFormInputChange}
                    error={submitted && !formValue.last_name}
                    helperText={
                      submitted &&
                      !formValue.last_name &&
                      "Last Name is required"
                    }
                  />
                </Grid> */}
              </Grid>
              <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
                <TextField
                  sx={{ mb: 2 }}
                  label={"Designation"}
                  required
                  fullWidth
                  value={formValue.designation}
                  name="designation"
                  error={submitted && !formValue.designation}
                  helperText={
                    submitted &&
                    !formValue.designation &&
                    "Designation is required"
                  }
                  onChange={handleFormInputChange}
                />
              </Grid>

              <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
                <TextField
                  sx={{ mb: 2 }}
                  label={"Qulification"}
                  required
                  fullWidth
                  value={formValue.degree}
                  name="degree"
                  error={submitted && !formValue.degree}
                  helperText={
                    submitted && !formValue.degree && "Qulification is required"
                  }
                  onChange={handleFormInputChange}
                />
              </Grid>
              <Grid container spacing={2} py={2}>
                <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
                  <TextField
                    sx={{ mb: 2 }}
                    label={"Alternate Mobile Number"}
                    required
                    fullWidth
                    name="alternate_phone"
                    value={formValue.alternate_phone}
                    error={submitted && !formValue.alternate_phone}
                    helperText={
                      submitted &&
                      !formValue.alternate_phone &&
                      "Alternate Mobile Number is required"
                    }
                    onChange={handleFormInputChange}
                  />
                </Grid>
                {/* <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                  <TextField
                    sx={{ mb: 2 }}
                    label={"Alternate Mobile Number"}
                    fullWidth
                    name="alternateMobile"
                    // error={
                    //   formik.touched.alternateMobile &&
                    //   Boolean(formik.errors.alternateMobile)
                    // }
                    // value={formik.values.alternateMobile
                    //   .trimStart()
                    //   .replace(/\s\s+/g, "")
                    //   .replace(/\p{Emoji_Presentation}/gu, "")}
                    // onChange={(e) => formik.handleChange(e)}
                    // helperText={
                    //   formik.touched.alternateMobile &&
                    //   formik.errors.alternateMobile &&
                    //   formik.errors.alternateMobile
                    // }
                  />
                </Grid> */}
              </Grid>
              <Grid item lg={12} xl={12} md={12} xs={12} sm={12}>
                {/* <Autocomplete
                  required
                  sx={{ my: 2 }}
                  label={"Skills"}
                  name={"skills"}
                  fullWidth
                  // value={formValue.skills}
                  multiple
                  onChange={(event, item) => {
                    // formik.setFieldValue("skills", item);
                  }}
                  options={categoryList}
                  getOptionLabel={(option) => option.jobCategory}
                  limitTags={5}
                  freeSolo={true}
                  filterSelectedOptions
                  disableClearable
                  renderInput={(params) => (
                    <TextField
                      required
                      {...params}
                      label={"Skills"}
                      placeholder="Select Skills"
                      error={submitted && !formValue.skills}
                      helperText={
                        submitted && !formValue.skills && "Skills is required"
                      }
                      variant={"outlined"}
                      InputProps={{
                        ...params.InputProps,
                      }}
                      value={formValue.skills}
                    />
                  )}
                /> */}
                <Autocomplete
                  multiple
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
                      // value={formValue.skills}
                    />
                  )}
                />
              </Grid>
              <Grid container spacing={2} mt={2}>
                <Grid item lg={12} xl={12} md={12} xs={12} sm={12}>
                  {/* <Autocomplete
                  required
                  sx={{ my: 2 }}
                  label={"Skills"}
                  name={"skills"}
                  fullWidth
                  // value={formValue.skills}
                  multiple
                  onChange={(event, item) => {
                    // formik.setFieldValue("skills", item);
                  }}
                  options={categoryList}
                  getOptionLabel={(option) => option.jobCategory}
                  limitTags={5}
                  freeSolo={true}
                  filterSelectedOptions
                  disableClearable
                  renderInput={(params) => (
                    <TextField
                      required
                      {...params}
                      label={"Skills"}
                      placeholder="Select Skills"
                      error={submitted && !formValue.skills}
                      helperText={
                        submitted && !formValue.skills && "Skills is required"
                      }
                      variant={"outlined"}
                      InputProps={{
                        ...params.InputProps,
                      }}
                      value={formValue.skills}
                    />
                  )}
                /> */}
                  <Autocomplete
                    multiple
                    id="tags-filled"
                    // options={categoryList}
                    options={location.map((option) => option.name)}
                    value={formValue.preferred_job_location}
                    onChange={(event, newValue) => {
                      handleMultiSelectChange(
                        "preferred_job_location",
                        newValue
                      );
                    }}
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
                        label="Prefered Job Location *"
                        placeholder="Prefered Job Location"
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2} mt={2}>
                <Grid item lg={12} xl={12} md={12} xs={12} sm={12}>
                  {/* <Autocomplete
                  required
                  sx={{ my: 2 }}
                  label={"Skills"}
                  name={"skills"}
                  fullWidth
                  // value={formValue.skills}
                  multiple
                  onChange={(event, item) => {
                    // formik.setFieldValue("skills", item);
                  }}
                  options={categoryList}
                  getOptionLabel={(option) => option.jobCategory}
                  limitTags={5}
                  freeSolo={true}
                  filterSelectedOptions
                  disableClearable
                  renderInput={(params) => (
                    <TextField
                      required
                      {...params}
                      label={"Skills"}
                      placeholder="Select Skills"
                      error={submitted && !formValue.skills}
                      helperText={
                        submitted && !formValue.skills && "Skills is required"
                      }
                      variant={"outlined"}
                      InputProps={{
                        ...params.InputProps,
                      }}
                      value={formValue.skills}
                    />
                  )}
                /> */}
                  {/* <Autocomplete
                    multiple
                    id="tags-filled"
                    // options={categoryList}
                    options={location.map((option) => option.name)}
                    value={formValue.current_location}
                    onChange={(event, newValue) => {
                      handleMultiSelectChange("current_location", newValue);
                    }}
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
                        label="Current Location *"
                        placeholder="Current Location"
                      />
                    )}
                  /> */}
                </Grid>
              </Grid>

              <Grid container spacing={2} py={2}>
                <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
                  <FormControl fullWidth sx={{ my: 2 }}>
                    <InputLabel id="demo-simple-select-label">
                      Current Location *
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      //   value={formik.values.currentLocation}
                      label="Current Location *"
                      //   onChange={(e) =>
                      //     formik.setFieldValue("location", e.target.value)
                      //   }
                      name="current_location"
                      value={formValue.current_location}
                      error={submitted && !formValue.current_location}
                      helperText={
                        submitted &&
                        !formValue.current_location &&
                        "Current Location is required"
                      }
                      onChange={handleFormInputChange}
                    >
                      <MenuItem value={"Chennai"}>Chennai</MenuItem>
                      <MenuItem value={"Delhi"}>Delhi</MenuItem>
                      <MenuItem value={"Mumbai"}>Mumbai</MenuItem>
                      <MenuItem value={"Bangalore"}>Bangalore</MenuItem>
                      <MenuItem value={"Kulithalai"}>Kulithalai</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid item lg={12} xl={12} md={12} xs={12} sm={12}>
                <TextField
                  sx={{ my: 2 }}
                  label={"Total Experiance (in Years) "}
                  type="text"
                  fullWidth
                  name="total_years_of_experience"
                  value={formValue.total_years_of_experience}
                  error={submitted && !formValue.total_years_of_experience}
                  helperText={
                    submitted &&
                    !formValue.total_years_of_experience &&
                    "Total Experiance (in Years) is required"
                  }
                  onChange={handleFormInputChange}
                  //   onChange={(e) => {
                  //     setExperiance(e.target.value);
                  //   }}
                />
              </Grid>
              <Grid item lg={12} xl={12} md={12} xs={12} sm={12}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item lg={6} xl={6} md={6} xs={12} sm={12}>
                      <TextField
                        sx={{ my: 2 }}
                        label={"Current CTC (in LPA)"}
                        type="text"
                        fullWidth
                        name="current_salary"
                        value={formValue.current_salary}
                        error={submitted && !formValue.current_salary}
                        helperText={
                          submitted &&
                          !formValue.current_salary &&
                          "Current CTC (in LPA) is required"
                        }
                        onChange={handleFormInputChange}
                        // value={currentCTC}
                        // onChange={(e) => {
                        //   setCurrentCTC(e.target.value);
                        // }}
                      />
                    </Grid>
                    <Grid item lg={6} xl={6} md={6} xs={12} sm={12}>
                      <TextField
                        sx={{ my: 2 }}
                        label={" Expected CTC (in LPA)"}
                        type="text"
                        fullWidth
                        name="expected_salary"
                        value={formValue.expected_salary}
                        error={submitted && !formValue.expected_salary}
                        helperText={
                          submitted &&
                          !formValue.expected_salary &&
                          "Expected CTC (in LPA) is required"
                        }
                        onChange={handleFormInputChange}
                        // value={expectedCTC}
                        // onChange={(e) => {
                        //   setExpectedCTC(e.target.value);
                        // }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              <Grid item lg={12} xl={12} xs={12} md={6} sm={12}>
                <FormControl fullWidth sx={{ my: 2 }}>
                  <TextField
                    sx={{ my: 2 }}
                    label={"Notice Period"}
                    type="text"
                    fullWidth
                    name="notice_period"
                    value={formValue.notice_period}
                    error={submitted && !formValue.notice_period}
                    helperText={
                      submitted &&
                      !formValue.notice_period &&
                      "Notice Period is required"
                    }
                    onChange={handleFormInputChange}
                    // value={expectedCTC}
                    // onChange={(e) => {
                    //   setExpectedCTC(e.target.value);
                    // }}
                  />
                </FormControl>
              </Grid>
              <Grid item lg={12} xl={12} xs={12} md={6} sm={12}>
                <FormGroup fullWidth sx={{ my: 2 }}>
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Curently looking for job"
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

export default EditBasicInfo;
