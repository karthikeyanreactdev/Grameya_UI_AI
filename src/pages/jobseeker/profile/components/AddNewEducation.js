import {
  Autocomplete,
  Box,
  Drawer,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { LoadingButton } from "@mui/lab";

const AddNewEducation = ({ isOpen, onClose }) => {
  const [categoryList, setCategoryList] = useState([
    { id: 1, jobCategory: "IT" },
    { id: 2, jobCategory: "BPO" },
    { id: 3, jobCategory: "Banking" },
    { id: 4, jobCategory: "HR" },
  ]);

  const handleClose = () => {
    onClose("isAddNewEducation");
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
              Add Education
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
                  // required
                  fullWidth
                  multiline
                  minRows={2}
                  name="aboutMe"
                  error={false}
                  //   value={formik.values.aboutMe
                  //     .trimStart()
                  //     .replace(/\s\s+/g, "")
                  //     .replace(/\p{Emoji_Presentation}/gu, "")}
                  //   onChange={(e) => formik.handleChange(e)}
                  //   helperText={}
                />
              </Grid>
              <Grid container spacing={2} py={2}>
                <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                  <TextField
                    sx={{ mb: 2 }}
                    label={"Full Name"}
                    required
                    fullWidth
                    name="fullname"
                    error={false}
                    // value={formik.values.fullname
                    //   .trimStart()
                    //   .replace(/\s\s+/g, "")
                    //   .replace(/\p{Emoji_Presentation}/gu, "")}
                    // onChange={(e) => formik.handleChange(e)}
                    // helperText={
                    //   formik.touched.fullname &&
                    //   formik.errors.fullname &&
                    //   formik.errors.fullname
                    // }
                  />
                </Grid>
                <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                  <TextField
                    sx={{ mb: 2 }}
                    label={"Designation"}
                    required
                    fullWidth
                    name="designation"
                    // error={false}
                    // value={formik.values.designation
                    //   .trimStart()
                    //   .replace(/\s\s+/g, "")
                    //   .replace(/\p{Emoji_Presentation}/gu, "")}
                    // onChange={(e) => formik.handleChange(e)}
                    // helperText={}
                  />
                </Grid>
              </Grid>
              <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
                <TextField
                  sx={{ mb: 2 }}
                  label={"Email"}
                  required
                  fullWidth
                  name="email"
                  type="email"
                  //   error={formik.touched.email && Boolean(formik.errors.email)}
                  //   value={formik.values.email
                  //     .trimStart()
                  //     .replace(/\s\s+/g, "")
                  //     .replace(/\p{Emoji_Presentation}/gu, "")}
                  //   onChange={(e) => formik.handleChange(e)}
                  //   helperText={
                  //     formik.touched.email &&
                  //     formik.errors.email &&
                  //     formik.errors.email
                  //   }
                />
              </Grid>
              <Grid container spacing={2} py={2}>
                <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                  <TextField
                    sx={{ mb: 2 }}
                    label={"Mobile Number"}
                    required
                    fullWidth
                    name="mobile"
                    // error={
                    //   formik.touched.mobile && Boolean(formik.errors.mobile)
                    // }
                    // value={formik.values.mobile
                    //   .trimStart()
                    //   .replace(/\s\s+/g, "")
                    //   .replace(/\p{Emoji_Presentation}/gu, "")}
                    // onChange={(e) => formik.handleChange(e)}
                    // helperText={
                    //   formik.touched.mobile &&
                    //   formik.errors.mobile &&
                    //   formik.errors.mobile
                    // }
                  />
                </Grid>
                <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
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
                </Grid>
              </Grid>
              <Grid item lg={12} xl={12} md={12} xs={12} sm={12}>
                <Autocomplete
                  required
                  sx={{ my: 2 }}
                  label={"Skills"}
                  name={"skills"}
                  fullWidth
                  //   value={formik.values.skills}
                  multiple
                  onChange={(event, item) => {
                    // formik.setFieldValue("skills", item);
                  }}
                  options={categoryList}
                  getOptionLabel={(option) => option.jobCategory}
                  limitTags={5}
                  freeSolo={false}
                  filterSelectedOptions
                  disableClearable
                  renderInput={(params) => (
                    <TextField
                      required
                      {...params}
                      label={"Skills"}
                      placeholder="Select Skills"
                      //   error={
                      //     formik.touched.skills && Boolean(formik.errors.skills)
                      //   }
                      //   helperText={
                      //     formik.touched.skills &&
                      //     formik.errors.skills &&
                      //     formik.errors.skills
                      //   }
                      variant={"outlined"}
                      InputProps={{
                        ...params.InputProps,
                      }}
                      //   value={formik?.values?.skills}
                    />
                  )}
                />
              </Grid>
              <Grid container spacing={2} py={2}>
                <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
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
                    >
                      <MenuItem value={0}>Chennai</MenuItem>
                      <MenuItem value={15}>Delhi</MenuItem>
                      <MenuItem value={30}>Mumbai</MenuItem>
                      <MenuItem value={90}>Bangalore</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                  <FormControl fullWidth sx={{ my: 2 }}>
                    <InputLabel id="demo-simple-select-label">
                      Prefered Job Location *
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      //   value={formik.values.location}
                      label="Prefered Job Location *"
                      //   onChange={(e) =>
                      //     formik.setFieldValue("location", e.target.value)
                      //   }
                    >
                      <MenuItem value={0}>Chennai</MenuItem>
                      <MenuItem value={15}>Delhi</MenuItem>
                      <MenuItem value={30}>Mumbai</MenuItem>
                      <MenuItem value={90}>Bangalore</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid item lg={12} xl={12} md={12} xs={12} sm={12}>
                <TextField
                  sx={{ my: 2 }}
                  label={"Total Experiance (in Years) "}
                  type="number"
                  fullWidth
                  name="from"
                  //   value={experiance}
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
                        type="number"
                        fullWidth
                        name="from"
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
                        type="number"
                        fullWidth
                        name="to"
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
                  <InputLabel id="demo-simple-select-label">
                    Notice Period *
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    // value={formik.values.noticePeriod}
                    label="Notice Period *"
                    // onChange={(e) =>
                    //   formik.setFieldValue("noticePeriod", e.target.value)
                    // }
                  >
                    <MenuItem value={0}>Immediate</MenuItem>
                    <MenuItem value={15}>15 Days</MenuItem>
                    <MenuItem value={30}>30 Days</MenuItem>
                    <MenuItem value={90}>90 Days</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
                <LoadingButton fullWidth variant="contained">
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

export default AddNewEducation;
