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
  updateJobseekerEducation,
} from "src/api-services/seeker/profile";
import useNotification from "src/hooks/useNotification";
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";
import DatePicker from "react-datepicker";
import { useTheme } from "@mui/material/styles";

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
  selectedEducation,
}) => {
  const theme = useTheme();
  const { direction } = theme;
  const popperPlacement = direction === "ltr" ? "bottom-start" : "bottom-end";
  const [mainCourse, setMainCourse] = useState(null);
  const [subCourse, setSubCourse] = useState(null);
  const [formValue, setFormValue] = useState({
    education_type: "",
    board: "",
    course: "",
    course_duration_start: "",
    course_type: "full_time",
    education_type: "",
    grade_or_marks: "",
    school_medium: "",
    specialization: "",
    university_or_institute_address: "",
    university_or_institute_name: "",
    year_of_passout: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [sendNotification] = useNotification();
  const [isLoading, setIsLoading] = useState();

  useEffect(() => {
    console.log("selectedEducation", selectedEducation);
    if (!selectedEducation) {
      return;
    }
    const newStateValue = { ...formValue };
    newStateValue.board = selectedEducation.board || "";
    newStateValue.course = selectedEducation.course_id || "";
    newStateValue.course_duration_end = selectedEducation.course_duration_end
      ? new Date(selectedEducation.course_duration_end)
      : "";
    newStateValue.course_duration_start =
      selectedEducation.course_duration_start
        ? new Date(selectedEducation.course_duration_start)
        : "";
    newStateValue.course_type = selectedEducation.course_type || "";
    newStateValue.education_type = selectedEducation.education_type || "";
    newStateValue.grade_or_marks = selectedEducation.grade_or_marks || "";
    newStateValue.school_medium = selectedEducation.school_medium || "";
    newStateValue.specialization = selectedEducation.specialization_id || "";
    newStateValue.university_or_institute_address =
      selectedEducation.university_or_institute_address || "";
    newStateValue.university_or_institute_name =
      selectedEducation.university_or_institute_name || "";
    newStateValue.year_of_passout = selectedEducation.year_of_passout
      ? new Date(selectedEducation.year_of_passout)
      : "";
    console.log("newStateValue", newStateValue);
    setFormValue(newStateValue);
    if (selectedEducation.course_id) {
      fetchSubCourse(selectedEducation.course_id);
    }
    fetchMainCourse();
  }, []);

  const handleDateChange = (parentName, value) => {
    const newFormValue = { ...formValue };
    console.log("parentName", parentName);
    if (parentName === "course_duration_start") {
      newFormValue["course_duration_start"] = value;
      newFormValue["course_duration_end"] = "";
      setFormValue(newFormValue);
      return;
    }
    newFormValue[parentName] = value;
    setFormValue(newFormValue);
  };

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

  const handleInputYearChange = (event) => {
    const enteredValue = event.target.value;
    console.log("check");

    // Allow only numbers
    const numbersOnly = /^[0-9\b]+$/;
    console.log("sd", enteredValue);

    if (enteredValue === "" || numbersOnly.test(enteredValue)) {
      const newStateValue = { ...formValue };
      newStateValue[event.target.name] = event.target.value;
      setFormValue(newStateValue);
    }
  };

  const callSubmitApi = async (apiData) => {
    try {
      setIsLoading(true);
      const response = await addJobseekerEducation(apiData);
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
      setIsLoading(false);
      // onHandleChangeLoading(false);
    }
  };

  const callEditSubmitApi = async (apiData) => {
    try {
      setIsLoading(true);
      const response = await updateJobseekerEducation(apiData);
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
      setIsLoading(false);
      // onHandleChangeLoading(false);
    }
  };

  const handleFormSubmit = async () => {
    setSubmitted(true);
    let apiData = null;
    if (!formValue.education_type) {
      return;
    }
    if (
      formValue.education_type === "10th" ||
      formValue.education_type === "12th"
    ) {
      if (
        !formValue.board ||
        !formValue.year_of_passout ||
        !formValue.school_medium ||
        !formValue.grade_or_marks ||
        !formValue.university_or_institute_address
      ) {
        return;
      }
      apiData = {
        education_type: formValue.education_type,
        board: formValue.board,
        year_of_passout: formValue.year_of_passout,
        school_medium: formValue.school_medium,
        grade_or_marks: formValue.grade_or_marks,
        university_or_institute_address:
          formValue.university_or_institute_address,
      };
    } else {
      if (
        !formValue.university_or_institute_name ||
        !formValue.course ||
        !formValue.grade_or_marks ||
        !formValue.university_or_institute_address ||
        !formValue.course_duration_start ||
        !formValue.specialization ||
        !formValue.course_duration_end ||
        !formValue.course_type
      ) {
        return;
      }
      if (
        parseInt(formValue?.course_duration_end, 10) >
        parseInt(formValue?.course_duration_start, 10)
      ) {
        return;
      }

      apiData = {
        education_type: formValue.education_type,
        university_or_institute_name: formValue.university_or_institute_name,
        university_or_institute_address:
          formValue.university_or_institute_address,
        course: formValue.course,
        specialization: formValue.specialization,
        course_type: formValue.course_type,
        course_duration_start: formValue.course_duration_start,
        course_duration_end: formValue.course_duration_end,
        grade_or_marks: formValue.grade_or_marks,
      };
    }

    if (selectedEducation) {
      apiData.education_id = selectedEducation?.id;
      // onHandleChangeLoading(true);

      callEditSubmitApi(apiData);
    } else {
      // onHandleChangeLoading(true);

      callSubmitApi(apiData);
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
              ml: 2,
            }}
          >
            <Typography variant="h5" component="div">
              {selectedEducation ? "Edit Education" : "Add Education"}
            </Typography>

            <IconButton aria-label="close" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ p: (theme) => theme.spacing(0, 6, 6) }}>
            <Grid container spacing={0}>
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
                    value={formValue?.education_type}
                    error={submitted && !formValue?.education_type}
                  >
                    <MenuItem value={"10th"}>10th</MenuItem>
                    <MenuItem value={"12th"}>12th</MenuItem>
                    <MenuItem value={"diploma"}>Diploma</MenuItem>
                    <MenuItem value={"under_graduate"}>Under Graduate</MenuItem>
                    <MenuItem value={"post_graduate"}>Post Graduate</MenuItem>
                    <MenuItem value={"doctorate"}>Doctorate</MenuItem>
                  </Select>
                  {submitted && !formValue?.education_type && (
                    <FormHelperText error={true}>
                      Education is required
                    </FormHelperText>
                  )}
                  <FormHelperText></FormHelperText>
                </FormControl>
              </Grid>

              {formValue?.education_type === "10th" ||
              formValue?.education_type === "12th" ? (
                <>
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
                        value={formValue?.board}
                        error={submitted && !formValue?.board}
                      >
                        <MenuItem value="State Board" sx={{ width: "10rem" }}>
                          State Board
                        </MenuItem>
                        <MenuItem value="Central Board" sx={{ width: "10rem" }}>
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

                  <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
                    <FormControl fullWidth sx={{ my: 2 }}>
                      <TextField
                        sx={{ mb: 2 }}
                        label={"Address *"}
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
                        value={formValue?.school_medium || ""}
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
                          Medium is required
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
                    <FormControl fullWidth sx={{ my: 2 }}>
                      <TextField
                        sx={{ mb: 2 }}
                        label={"Percentage *"}
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
                        value={formValue?.grade_or_marks}
                        //   value={formik.values.aboutMe
                        //     .trimStart()
                        //     .replace(/\s\s+/g, "")
                        //     .replace(/\p{Emoji_Presentation}/gu, "")}
                        //   onChange={(e) => formik.handleChange(e)}
                        //   helperText={}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
                    <FormControl fullWidth sx={{ my: 2 }}>
                      {/* <TextField
                          sx={{ mb: 2 }}
                          label={"Year of passout"}
                          // required
                          fullWidth
                          onChange={handleInputChange}
                          name="year_of_passout"
                          helperText={
                            submitted &&
                            !formValue?.year_of_passout && (
                              <>Year of passout is required</>
                            )
                          }
                          error={submitted && !formValue?.year_of_passout}
                          value={formValue?.year_of_passout}
                          //   value={formik.values.aboutMe
                          //     .trimStart()
                          //     .replace(/\s\s+/g, "")
                          //     .replace(/\p{Emoji_Presentation}/gu, "")}
                          //   onChange={(e) => formik.handleChange(e)}
                          //   helperText={}
                        /> */}

                      <DatePickerWrapper>
                        <DatePicker
                          id="join-date"
                          showYearPicker
                          selected={formValue.year_of_passout}
                          dateFormat="yyyy"
                          fullWidth
                          minDate={formValue.year_of_passout}
                          sx={{ width: 1 }}
                          popperPlacement={popperPlacement}
                          onChange={(date) => {
                            handleDateChange("year_of_passout", date);
                          }}
                          customInput={
                            <TextField
                              sx={{ mb: 2 }}
                              label={"Year of passout *"}
                              value={formValue.year_of_passout}
                              fullWidth
                              error={submitted && !formValue.year_of_passout}
                              helperText={
                                submitted &&
                                !formValue.year_of_passout &&
                                "Year of passout is required"
                              }
                            />
                          }
                        />
                      </DatePickerWrapper>
                    </FormControl>
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
                        value={formValue?.course}
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
                        value={formValue?.specialization}
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

                  <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
                    <FormControl fullWidth sx={{ my: 2 }}>
                      <TextField
                        sx={{ mb: 2 }}
                        label={"University / Institute *"}
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
                          submitted && !formValue?.university_or_institute_name
                        }
                        value={formValue?.university_or_institute_name}
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

                  <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
                    <FormControl fullWidth sx={{ my: 2 }}>
                      <TextField
                        sx={{ mb: 2 }}
                        label={"University / Institute Address *"}
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
                        value={formValue?.university_or_institute_address}
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

                  <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
                    <FormControl fullWidth sx={{ my: 2 }}>
                      <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label">
                          Course type *
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
                          value={formValue?.course_type}
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

                  <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
                    <FormControl fullWidth sx={{ my: 2 }}>
                      <TextField
                        sx={{ mb: 2 }}
                        label={"Percentage *"}
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
                        value={formValue?.grade_or_marks}
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

                  <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
                    <FormControl fullWidth sx={{ my: 2 }}>
                      <DatePickerWrapper>
                        <DatePicker
                          id="join-date"
                          showYearPicker
                          selected={formValue.course_duration_start}
                          dateFormat="yyyy"
                          fullWidth
                          minDate={formValue.certification_valid_from}
                          sx={{ width: 1 }}
                          popperPlacement={popperPlacement}
                          onChange={(date) => {
                            handleDateChange("course_duration_start", date);
                          }}
                          customInput={
                            <TextField
                              sx={{ mb: 2 }}
                              label={"Start Year *"}
                              value={formValue.course_duration_start}
                              fullWidth
                              error={
                                submitted && !formValue.course_duration_start
                              }
                              helperText={
                                submitted &&
                                !formValue.course_duration_start &&
                                "End Year is required"
                              }
                            />
                          }
                        />
                      </DatePickerWrapper>
                      {/* <TextField
                          sx={{ mb: 2 }}
                          label={"Start Year"}
                          // required
                          fullWidth
                          onChange={handleInputChange}
                          onKeyPress={(event) => {
                            if (!/[0-9]/.test(event.key)) {
                              event.preventDefault();
                            }
                          }}
                          inputProps={{
                            maxlength: 4,
                          }}
                          name="course_duration_start"
                          helperText={
                            submitted &&
                            !formValue?.course_duration_start && (
                              <>Start Year is required</>
                            )
                          }
                          value={formValue?.course_duration_start}
                          error={submitted && !formValue?.course_duration_start}
                          //   value={formik.values.aboutMe
                          //     .trimStart()
                          //     .replace(/\s\s+/g, "")
                          //     .replace(/\p{Emoji_Presentation}/gu, "")}
                          //   onChange={(e) => formik.handleChange(e)}
                          //   helperText={}
                        /> */}
                    </FormControl>
                  </Grid>

                  <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
                    <DatePickerWrapper>
                      <DatePicker
                        id="join-date"
                        showYearPicker
                        selected={formValue.course_duration_end}
                        dateFormat="yyyy"
                        fullWidth
                        minDate={formValue.course_duration_start}
                        sx={{ width: 1 }}
                        popperPlacement={popperPlacement}
                        onChange={(date) => {
                          handleDateChange("course_duration_end", date);
                        }}
                        customInput={
                          <TextField
                            sx={{ mb: 2 }}
                            label={"End Year *"}
                            value={formValue.course_duration_end}
                            fullWidth
                            error={submitted && !formValue.course_duration_end}
                            helperText={
                              submitted &&
                              !formValue.course_duration_end &&
                              "End Year is required"
                            }
                          />
                        }
                      />
                    </DatePickerWrapper>

                    {/* <TextField
                      sx={{ mb: 2 }}
                      label={"End Year"}
                      // required
                      fullWidth
                      inputProps={{
                        maxlength: 4,
                      }}
                      onChange={handleInputChange}
                      onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                      name="course_duration_end"
                      helperText={
                        submitted &&
                        !formValue?.course_duration_end && (
                          <>End Year is required</>
                        )
                      }
                      value={formValue?.course_duration_end}
                      error={submitted && !formValue?.course_duration_end}
                    /> */}
                    {/* {submitted &&
                      formValue?.course_duration_end &&
                      formValue?.course_duration_start &&
                      parseInt(formValue?.course_duration_end, 10) >
                        parseInt(formValue?.course_duration_start, 10) && (
                        <>
                          <FormHelperText error={true} sx={{ ml: 2 }}>
                            Invalid year selection
                          </FormHelperText>
                        </>
                      )} */}
                  </Grid>
                </>
              )}

              <Grid item lg={12} xl={12} xs={12} md={12} sm={12} sx={{ mt: 4 }}>
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

export default AddNewEducation;
