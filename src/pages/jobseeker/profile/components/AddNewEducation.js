import {
  Autocomplete,
  Box,
  Drawer,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { LoadingButton } from "@mui/lab";
import {
  addJobseekerEducation,
  getEnumByType,
} from "src/api-services/seeker/profile";
import useNotification from "src/hooks/useNotification";

const menuProps = {
  PaperProps: {
    style: {
      maxHeight: 200, // Adjust the height value as per your requirement
    },
  },
};

const AddNewEducation = ({
  isOpen,
  onClose,
  getProfileDetail,
  onHandleChangeLoading,
}) => {
  const [mainCourse, setMainCourse] = useState(null);
  const [subCourse, setSubCourse] = useState(null);
  const [formValue, setFormValue] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [sendNotification] = useNotification();

  const fetchMainCourse = async () => {
    try {
      const queryData = `?type=${"UG_MAIN_COURSES"}`;
      const response = await getEnumByType(queryData);
      if (response.status === 200) {
        setMainCourse(response?.data?.data?.records);
      }
      console.log("response", response);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchSubCourse = async (value) => {
    try {
      const queryData = `?type=UG_SUB_COURSES&ug_course_id=${value}`;
      const response = await getEnumByType(queryData);
      if (response.status === 200) {
        setSubCourse(response?.data?.data?.records);
      }
      console.log("response", response);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchMainCourse();
  }, []);

  const handleClose = () => {
    onClose("isAddNewEducation");
  };

  const handleMainCourseChange = (e) => {
    fetchSubCourse(e.target.value);
    const newStateValue = { ...formValue };
    newStateValue[e.target.name] = e.target.value;
    setFormValue(newStateValue);
  };

  const handleInputChange = (e) => {
    const newStateValue = { ...formValue };
    newStateValue[e.target.name] = e.target.value;
    setFormValue(newStateValue);
  };

  const handleFormSubmit = async () => {
    setSubmitted(true);
    onHandleChangeLoading(true);
    try {
      const response = await addJobseekerEducation(formValue);
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
      sendNotification({
        message: e,
        variant: "error",
      });
    } finally {
      onHandleChangeLoading(false);
    }
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
              <Grid container spacing={2} py={2}>
                <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
                  <FormControl fullWidth sx={{ my: 2 }}>
                    <InputLabel
                      id="demo-simple-select-label"
                      error={submitted && !formValue?.education_type}
                    >
                      Education *
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Education *"
                      name="education_type"
                      onChange={handleInputChange}
                      error={submitted && !formValue?.education_type}
                    >
                      <MenuItem value={"10th"}>10th</MenuItem>
                      <MenuItem value={"12th"}>12th</MenuItem>
                      <MenuItem value={"diploma"}>Diploma</MenuItem>
                      <MenuItem value={"under_graduate"}>
                        Under Graduate
                      </MenuItem>
                      <MenuItem value={"post_graduate"}>Post Graduate</MenuItem>
                      <MenuItem value={"doctrate"}>Doctrate</MenuItem>
                    </Select>
                    {submitted && !formValue?.education_type && (
                      <FormHelperText error={true}>
                        Education is required
                      </FormHelperText>
                    )}
                    <FormHelperText></FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>

              {formValue?.education_type === "10th" ||
              formValue?.education_type === "12th" ? (
                <>
                  <Grid container spacing={2} py={2}>
                    <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
                      <FormControl fullWidth sx={{ my: 2 }}>
                        <InputLabel
                          id="demo-simple-select-label"
                          error={submitted && !formValue?.board}
                        >
                          Board *
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Board *"
                          MenuProps={menuProps}
                          onChange={handleMainCourseChange}
                          name="board"
                          error={submitted && !formValue?.board}
                        >
                          <MenuItem value="State Board" sx={{ width: 200 }}>
                            State Board
                          </MenuItem>
                          <MenuItem
                            value="Central Board"
                            sx={{ width: "10rem" }}
                          >
                            Central Board
                          </MenuItem>
                        </Select>
                        {submitted && !formValue?.board && (
                          <FormHelperText error={true}>
                            Board is required
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2} py={2}>
                    <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
                      <FormControl fullWidth sx={{ my: 2 }}>
                        <TextField
                          sx={{ mb: 2 }}
                          label={"Address"}
                          // required
                          fullWidth
                          onChange={handleInputChange}
                          name="university_or_institute_address"
                          helperText={
                            submitted &&
                            !formValue?.university_or_institute_address && (
                              <>Address is required</>
                            )
                          }
                          error={
                            submitted &&
                            !formValue?.university_or_institute_address
                          }
                          // error={false}
                          //   value={formik.values.aboutMe
                          //     .trimStart()
                          //     .replace(/\s\s+/g, "")
                          //     .replace(/\p{Emoji_Presentation}/gu, "")}
                          //   onChange={(e) => formik.handleChange(e)}
                          //   helperText={}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2} py={2}>
                    <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
                      <FormControl fullWidth sx={{ my: 2 }}>
                        <InputLabel
                          id="demo-simple-select-label"
                          error={submitted && !formValue?.school_medium}
                        >
                          Medium *
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Medium *"
                          MenuProps={menuProps}
                          onChange={handleMainCourseChange}
                          name="school_medium"
                          error={submitted && !formValue?.school_medium}
                        >
                          <MenuItem value="English" sx={{ width: "10rem" }}>
                            English
                          </MenuItem>
                          <MenuItem value="Tamil" sx={{ width: "10rem" }}>
                            Tamil
                          </MenuItem>
                        </Select>
                        {submitted && !formValue?.school_medium && (
                          <FormHelperText error={true}>
                            Board is required
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} py={2}>
                    <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
                      <FormControl fullWidth sx={{ my: 2 }}>
                        <TextField
                          sx={{ mb: 2 }}
                          label={"Percentage"}
                          // required
                          fullWidth
                          name="grade_or_marks"
                          onChange={handleInputChange}
                          helperText={
                            submitted &&
                            !formValue?.grade_or_marks && (
                              <>Percentage is required</>
                            )
                          }
                          error={submitted && !formValue?.grade_or_marks}
                          //   value={formik.values.aboutMe
                          //     .trimStart()
                          //     .replace(/\s\s+/g, "")
                          //     .replace(/\p{Emoji_Presentation}/gu, "")}
                          //   onChange={(e) => formik.handleChange(e)}
                          //   helperText={}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2} py={2}>
                    <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
                      <FormControl fullWidth sx={{ my: 2 }}>
                        <TextField
                          sx={{ mb: 2 }}
                          label={"Year of passout"}
                          // required
                          fullWidth
                          onChange={handleInputChange}
                          name="year_of_passout"
                          helperText={
                            submitted &&
                            !formValue?.year_of_passout && <>Year of passout</>
                          }
                          error={submitted && !formValue?.year_of_passout}
                          //   value={formik.values.aboutMe
                          //     .trimStart()
                          //     .replace(/\s\s+/g, "")
                          //     .replace(/\p{Emoji_Presentation}/gu, "")}
                          //   onChange={(e) => formik.handleChange(e)}
                          //   helperText={}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>

                  {/* <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
                    <TextField
                      sx={{ mb: 2 }}
                      label={"End Year"}
                      // required
                      fullWidth
                      onChange={handleInputChange}
                      name="course_duration_end"
                      helperText={
                        submitted &&
                        !formValue?.course_duration_end && (
                          <>End Year is required</>
                        )
                      }
                      error={submitted && !formValue?.course_duration_end}
                      //   value={formik.values.aboutMe
                      //     .trimStart()
                      //     .replace(/\s\s+/g, "")
                      //     .replace(/\p{Emoji_Presentation}/gu, "")}
                      //   onChange={(e) => formik.handleChange(e)}
                      //   helperText={}
                    />
                  </Grid> */}
                </>
              ) : (
                <>
                  <Grid container spacing={2} py={2}>
                    <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
                      <FormControl fullWidth sx={{ my: 2 }}>
                        <InputLabel
                          id="demo-simple-select-label"
                          error={submitted && !formValue?.course}
                        >
                          Course *
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Course *"
                          MenuProps={menuProps}
                          onChange={handleMainCourseChange}
                          name="course"
                          error={submitted && !formValue?.course}
                        >
                          {mainCourse?.map((option, index) => {
                            return (
                              <MenuItem
                                key={index}
                                value={option.id}
                                sx={{ width: "10rem" }}
                              >
                                {option.name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                        {submitted && !formValue?.course && (
                          <FormHelperText error={true}>
                            Course is required
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2} py={2}>
                    <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
                      <FormControl fullWidth sx={{ my: 2 }}>
                        <InputLabel
                          id="demo-simple-select-label"
                          error={submitted && !formValue?.specialization}
                        >
                          Specialization *
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Specialization *"
                          MenuProps={menuProps}
                          onChange={handleInputChange}
                          name="specialization"
                          error={submitted && !formValue?.specialization}
                        >
                          {subCourse?.map((option, index) => {
                            return (
                              <MenuItem
                                key={index}
                                value={option.id}
                                sx={{ width: "10rem" }}
                              >
                                {option.name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                        {submitted && !formValue?.specialization && (
                          <FormHelperText error={true}>
                            Specialization is required
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2} py={2}>
                    <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
                      <FormControl fullWidth sx={{ my: 2 }}>
                        <TextField
                          sx={{ mb: 2 }}
                          label={"University / Institute"}
                          // required
                          fullWidth
                          onChange={handleInputChange}
                          name="university_or_institute_name"
                          helperText={
                            submitted &&
                            !formValue?.university_or_institute_name && (
                              <>University / Institute is required</>
                            )
                          }
                          error={
                            submitted &&
                            !formValue?.university_or_institute_name
                          }
                          // error={false}
                          //   value={formik.values.aboutMe
                          //     .trimStart()
                          //     .replace(/\s\s+/g, "")
                          //     .replace(/\p{Emoji_Presentation}/gu, "")}
                          //   onChange={(e) => formik.handleChange(e)}
                          //   helperText={}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2} py={2}>
                    <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
                      <FormControl fullWidth sx={{ my: 2 }}>
                        <TextField
                          sx={{ mb: 2 }}
                          label={"University / Institute Address"}
                          // required
                          fullWidth
                          onChange={handleInputChange}
                          name="university_or_institute_address"
                          helperText={
                            submitted &&
                            !formValue?.university_or_institute_address && (
                              <>University / Institute Address is required</>
                            )
                          }
                          error={
                            submitted &&
                            !formValue?.university_or_institute_address
                          }
                          // error={false}
                          //   value={formik.values.aboutMe
                          //     .trimStart()
                          //     .replace(/\s\s+/g, "")
                          //     .replace(/\p{Emoji_Presentation}/gu, "")}
                          //   onChange={(e) => formik.handleChange(e)}
                          //   helperText={}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2} py={2}>
                    <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
                      <FormControl fullWidth sx={{ my: 2 }}>
                        <FormControl>
                          <FormLabel id="demo-radio-buttons-group-label">
                            Course type
                          </FormLabel>
                          <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue="full_time"
                            name="course_type"
                            onChange={handleInputChange}
                            helperText={
                              submitted &&
                              !formValue?.course_type && (
                                <>Course type is required</>
                              )
                            }
                            error={submitted && !formValue?.course_type}
                          >
                            <FormControlLabel
                              value="full_time"
                              control={<Radio />}
                              label="Full time"
                            />
                            <FormControlLabel
                              value="part_time"
                              control={<Radio />}
                              label="Part time"
                            />
                            <FormControlLabel
                              value="correspondance"
                              control={<Radio />}
                              label="Correspondance/Distance learning"
                            />
                          </RadioGroup>
                        </FormControl>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2} py={2}>
                    <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
                      <FormControl fullWidth sx={{ my: 2 }}>
                        <TextField
                          sx={{ mb: 2 }}
                          label={"Percentage"}
                          // required
                          fullWidth
                          name="grade_or_marks"
                          onChange={handleInputChange}
                          helperText={
                            submitted &&
                            !formValue?.grade_or_marks && (
                              <>Percentage is required</>
                            )
                          }
                          error={submitted && !formValue?.grade_or_marks}
                          //   value={formik.values.aboutMe
                          //     .trimStart()
                          //     .replace(/\s\s+/g, "")
                          //     .replace(/\p{Emoji_Presentation}/gu, "")}
                          //   onChange={(e) => formik.handleChange(e)}
                          //   helperText={}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2} py={2}>
                    <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
                      <FormControl fullWidth sx={{ my: 2 }}>
                        <TextField
                          sx={{ mb: 2 }}
                          label={"Start Year"}
                          // required
                          fullWidth
                          onChange={handleInputChange}
                          name="course_duration_start"
                          helperText={
                            submitted &&
                            !formValue?.course_duration_start && (
                              <>Start Year is required</>
                            )
                          }
                          error={submitted && !formValue?.course_duration_start}
                          //   value={formik.values.aboutMe
                          //     .trimStart()
                          //     .replace(/\s\s+/g, "")
                          //     .replace(/\p{Emoji_Presentation}/gu, "")}
                          //   onChange={(e) => formik.handleChange(e)}
                          //   helperText={}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
                    <TextField
                      sx={{ mb: 2 }}
                      label={"End Year"}
                      // required
                      fullWidth
                      onChange={handleInputChange}
                      name="course_duration_end"
                      helperText={
                        submitted &&
                        !formValue?.course_duration_end && (
                          <>End Year is required</>
                        )
                      }
                      error={submitted && !formValue?.course_duration_end}
                      //   value={formik.values.aboutMe
                      //     .trimStart()
                      //     .replace(/\s\s+/g, "")
                      //     .replace(/\p{Emoji_Presentation}/gu, "")}
                      //   onChange={(e) => formik.handleChange(e)}
                      //   helperText={}
                    />
                  </Grid>
                </>
              )}

              <Grid item lg={12} xl={12} xs={12} md={12} sm={12} sx={{ mt: 4 }}>
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

export default AddNewEducation;
