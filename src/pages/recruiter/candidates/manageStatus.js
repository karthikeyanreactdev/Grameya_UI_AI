// ** React Imports
import { forwardRef, useEffect, useState } from "react";

// ** MUI Imports
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

// ** Custom Component Import
import CustomTextField from "src/@core/components/mui/text-field";
import { useFormik } from "formik";
// ** Third Party Imports
import {
  ContentState,
  EditorState,
  convertFromHTML,
  convertFromRaw,
  convertToRaw,
} from "draft-js";
import draftToHtml from "draftjs-to-html";

// ** Component Import
import ReactDraftWysiwyg from "src/@core/components/react-draft-wysiwyg";
// ** Third Party Imports
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import Slider from "@mui/material/Slider";
// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Store Imports
import { useDispatch, useSelector } from "react-redux";

// ** Actions Imports
// import { addUser } from "src/store/apps/user";
import {
  // Autocomplete,
  Chip,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  Select,
  TextField,
} from "@mui/material";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import addDays from "date-fns/addDays";
const filter = createFilterOptions();
import { LoadingButton } from "@mui/lab";
import {
  createJob,
  getJobById,
  getJobSubCategoryById,
  updateJobById,
} from "src/api-services/recruiter/jobs";
import Geocode from "react-geocode";

import useGoogle from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import useNotification from "src/hooks/useNotification";
// import { validationSchema } from "../validation";
import { makeStyles } from "@mui/styles";
import DatePicker from "react-datepicker";
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";
import { ReactMultiEmail, isEmail } from "react-multi-email";
import "react-multi-email/dist/style.css";
import {
  deleteShortListedCandidate,
  sheduleInterview,
  updateShortLisedCandidate,
} from "src/api-services/recruiter/candidate";

const useStyles = makeStyles({
  root: {
    "& .wrapper-class.rdw-editor-wrapper": {
      borderRadius: " 0px 0px 8px 8px",
      border: "1px solid #e0e0e0",
      "& .notranslate.public-DraftEditor-content": {
        padding: "0px 16px 0px 16px",
      },
    },
    "& .MuiFormControl-root.MuiTextField-root": {
      width: "100%",
    },
  },
});
const CustomInput = forwardRef(({ ...props }, ref) => {
  return (
    <CustomTextField
      fullWidth
      inputRef={ref}
      sx={{ width: { sm: "250px", xs: "170px" } }}
      {...props}
    />
  );
});
const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(6),
  justifyContent: "space-between",
}));
const linkRegMatch =
  /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
//;
const validationSchema = yup.object({
  status: yup.string("Status is required").required("Status is required"),
  jobTitle: yup.string().when("status", {
    is: "interview_schedulded",
    then: yup
      .string("Job Title is required")
      .trim()
      .min(13, "Minimum 10 character is required")
      .required("Job Title is required"),
  }),
  interviewDate: yup.date().when("status", {
    is: "interview_schedulded",
    then: yup.date().required("Interview Date is required"),
  }),
  meetingUrl: yup.string().when("status", {
    is: "interview_schedulded",
    then: yup
      .string()
      .trim()
      .matches(linkRegMatch, "Meeting URL should be a valid URL")
      .matches(
        /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
        "Enter correct Meeting URL"
      )
      .required("Meeting URL is required"),
  }),
  meetingDescription: yup.string().when("status", {
    is: "interview_schedulded",
    then: yup
      .string()
      .trim()
      .min(10, "Minimum 10 character required")

      .max(200, " Maximum 200 character required")
      .required("Meeting Description is required"),
  }),
});
const SideBarStatus = (props) => {
  // ** Props
  const { open, toggle, id, RowData } = props;
  console.log("msi", props);
  // ** State
  const [plan, setPlan] = useState("basic");
  const [role, setRole] = useState("subscriber");

  // ** Hooks
  const dispatch = useDispatch();
  const classes = useStyles();

  const [sendNotification] = useNotification();
  const { userData } = useSelector((state) => state.auth);

  const { jobCategory, skills, status, jobType } = useSelector(
    (state) => state.misc
  );
  // console.log("msi", jobCategory, skills, status, jobType);
  // const [emails, setEmails] = useState([]);
  const [focused, setFocused] = useState(false);
  const [salary, setSalary] = useState([0, 0]);
  const [isLoading, setIsLoading] = useState(false);
  const [jobData, setJobData] = useState(null);
  const [experiance, setExperiance] = useState([0, 0]);
  const [jd, setJd] = useState(EditorState.createEmpty());
  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [showInterviewForm, setShowInterviewForm] = useState(false);
  const [removeMessage, setRemoveMessage] = useState(false);

  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const handleChange = (event, newValue) => {
    console.log(newValue);
    setSalary(newValue);
  };
  const handleChangeExp = (event, newValue) => {
    console.log(newValue);
    setExperiance(newValue);
  };

  const formik = useFormik({
    initialValues: {
      fullName: "",
      status: "",
      jobTitle: "",
      interviewDate: new Date(),
      participantsEmail: [],
      meetingUrl: "",
      meetingDescription: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log(values);
      let result = null;

      try {
        setIsLoading(true);
        if (showInterviewForm) {
          // params["shortlist_id"] = id;
          let params = {
            shortlist_id: id,
            job_title: values.jobTitle,
            interview_date: values.interviewDate,
            participants_email: values.participantsEmail,
            meeting_url: values.meetingUrl,
            meeting_description: values.meetingDescription,
          };
          // console.log("in", params);
          result = await sheduleInterview(params);
        } else if (removeMessage) {
          let params = {
            seeker_ids: [id],
          };
          // console.log("re", params);
          result = await deleteShortListedCandidate(params);
        } else {
          let params = {
            shortlist_id: id,
            status: values.status,
            comments: values.status,
          };
          // console.log("asu", params);
          result = await updateShortLisedCandidate(params);
        }

        formik.resetForm();
        toggle();

        sendNotification({
          message: result?.data?.message,
          variant: "success",
        });
      } catch (e) {
        sendNotification({
          message: e,
          variant: "error",
        });
      } finally {
        setIsLoading(false);
      }
    },
  });
  const handleClose = () => {
    toggle();
  };

  useEffect(() => {
    formik.resetForm();
    // console.log(userData);
    formik.setFieldValue("skills", RowData?.skills);
    formik.setFieldValue("participantsEmail", [userData?.email]);
  }, [id, RowData, userData]);

  const handleJobCategory = async (id) => {
    try {
      formik.setFieldValue("jobSubCategory", "");
      const result = await getJobSubCategoryById(id);
      console.log(result?.data?.data?.records);
      setSubCategoryList(result?.data?.data?.records);
    } catch (e) {
      sendNotification({
        message: e,
        variant: "error",
      });
    } finally {
      // setIsLoading(false);
    }
  };

  return (
    <Drawer
      open={open}
      anchor="right"
      variant="temporary"
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      className={classes.root}
      sx={{
        "& .MuiDrawer-paper": { width: { xs: "100%", sm: "100%", lg: "50%" } },
      }}
    >
      <Header>
        <Typography variant="h5">{"Update Status"}</Typography>
        <IconButton
          size="small"
          onClick={handleClose}
          sx={{
            p: "0.438rem",
            borderRadius: 1,
            color: "text.primary",
            backgroundColor: "action.selected",
            "&:hover": {
              backgroundColor: (theme) =>
                `rgba(${theme.palette.customColors.main}, 0.16)`,
            },
          }}
        >
          <Icon icon="tabler:x" fontSize="1.125rem" />
        </IconButton>
      </Header>
      <Box sx={{ p: (theme) => theme.spacing(0, 6, 6) }}>
        <Grid container spacing={2}>
          <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
            <TextField
              sx={{ my: 2 }}
              label={"Candidate Name"}
              size="small"
              fullWidth
              name="companyName"
              InputLabelProps={{ shrink: true }}
              value={RowData?.full_name}
              // onChange={(e) => formik.handleChange(e)}
            />
          </Grid>

          <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
            <FormControl
              size="small"
              fullWidth
              sx={{ my: 2 }}
              error={formik.touched.status && Boolean(formik.errors.status)}
            >
              <InputLabel
                id="demo-simple-select-label "
                error={formik.touched.status && Boolean(formik.errors.status)}
                size="small"
              >
                Select Status *
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formik.values.status}
                label="Select Status *"
                error={formik.touched.status && Boolean(formik.errors.status)}
                helperText={
                  formik.touched.status &&
                  formik.errors.status &&
                  formik.errors.status
                }
                onChange={(e) => {
                  formik.setFieldValue("status", e.target.value);
                  if (e.target.value === "interview_schedulded") {
                    setShowInterviewForm(true);
                  } else {
                    setShowInterviewForm(false);
                  }
                  if (e.target.value === "remove") {
                    setRemoveMessage(true);
                  } else {
                    setRemoveMessage(false);
                  }
                }}
              >
                <MenuItem value={"call_resheduled"}>Call Rescheduled</MenuItem>
                <MenuItem value={"call_not_picked"}>Call not picked</MenuItem>
                <MenuItem value={"inactive_seeker"}>
                  Inactive/Not Intrested
                </MenuItem>
                <MenuItem value={"interview_schedulded"}>
                  Interview scheduled
                </MenuItem>
                <MenuItem value={"interview_canceled"}>
                  Interview canceled
                </MenuItem>

                <MenuItem value={"remove"}>Remove</MenuItem>
              </Select>
              <FormHelperText>
                {formik.touched.status &&
                  formik.errors.status &&
                  formik.errors.status}
              </FormHelperText>
            </FormControl>
          </Grid>

          {showInterviewForm && (
            <Grid container spacing={2} sx={{ mx: 0.2 }}>
              <Grid item lg={12} xl={12} xs={12} md={12} sm={12} sx={{ my: 2 }}>
                <TextField
                  id="jobTitle"
                  name="jobTitle"
                  label="Job Title "
                  required
                  variant={"outlined"}
                  size="small"
                  fullWidth
                  value={formik.values.jobTitle}
                  onChange={(e) => {
                    setLng(e.target.value);
                    formik.setFieldValue(
                      "jobTitle",
                      e.target?.value?.trimStart().replace(/\s\s+/g, "")
                    );
                  }}
                  error={
                    formik.touched.jobTitle && Boolean(formik.errors.jobTitle)
                  }
                  helperText={
                    formik.touched.jobTitle &&
                    formik.errors.jobTitle &&
                    formik.errors.jobTitle
                  }
                />
              </Grid>
              <Grid item lg={12} xl={12} xs={12} md={12} sm={12} sx={{ my: 2 }}>
                <TextField
                  id="meetingUrl"
                  name="meetingUrl"
                  label="Meeting URL "
                  variant={"outlined"}
                  fullWidth
                  size="small"
                  required
                  value={formik.values.meetingUrl}
                  onChange={(e) => {
                    setLng(e.target.value);
                    formik.setFieldValue(
                      "meetingUrl",
                      e.target?.value?.trimStart().replace(/\s\s+/g, "")
                    );
                  }}
                  error={
                    formik.touched.meetingUrl &&
                    Boolean(formik.errors.meetingUrl)
                  }
                  helperText={
                    formik.touched.meetingUrl &&
                    formik.errors.meetingUrl &&
                    formik.errors.meetingUrl
                  }
                />
              </Grid>
              <Grid item lg={12} xl={12} xs={12} md={12} sm={12} sx={{ my: 2 }}>
                <TextField
                  id="meetingDescription"
                  name="meetingDescription"
                  required
                  label="Meeting Description "
                  variant={"outlined"}
                  fullWidth
                  multiline
                  minRows={2}
                  maxRows={4}
                  size="small"
                  value={formik.values.meetingDescription}
                  onChange={(e) => {
                    setLng(e.target.value);
                    formik.setFieldValue(
                      "meetingDescription",
                      e.target?.value?.trimStart().replace(/\s\s+/g, "")
                    );
                  }}
                  error={
                    formik.touched.meetingDescription &&
                    Boolean(formik.errors.meetingDescription)
                  }
                  helperText={
                    formik.touched.meetingDescription &&
                    formik.errors.meetingDescription &&
                    formik.errors.meetingDescription
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
                      showTimeSelect
                      timeFormat="h:mm aa"
                      timeIntervals={30}
                      required
                      minDate={new Date()}
                      maxDate={addDays(new Date(), 90)}
                      selected={formik.values.interviewDate}
                      id="date-time-picker"
                      dateFormat="dd/MM/yyyy h:mm aa"
                      // popperPlacement={popperPlacement}
                      onChange={(date) =>
                        formik.setFieldValue("interviewDate", date)
                      }
                      customInput={
                        <CustomInput
                          fullWidth
                          label="Interview Date & Time"
                          required
                          error={
                            formik.touched.interviewDate &&
                            Boolean(formik.errors.interviewDate)
                          }
                          helperText={
                            formik.touched.interviewDate &&
                            formik.errors.interviewDate &&
                            formik.errors.interviewDate
                          }
                        />
                      }
                    />
                  </DatePickerWrapper>
                </Box>
              </Grid>
              <Grid item lg={12} xl={12} xs={12} md={12} sm={12} sx={{ my: 2 }}>
                {/* <FormControl size="small" fullWidth sx={{ my: 2 }}> */}
                <InputLabel
                  sx={{
                    fontSize: "0.8125rem",
                    marginBottom: "0.25rem",
                    color: "rgba(47, 43, 61, 0.78)",
                  }}
                >
                  Participants Email
                </InputLabel>
                <ReactMultiEmail
                  placeholder="Input your Participant(s) Email"
                  emails={formik.values.participantsEmail}
                  onChange={(_emails) => {
                    formik.setFieldValue("participantsEmail", _emails);
                  }}
                  getLabel={(email, index, removeEmail) => {
                    return (
                      <div data-tag key={index}>
                        {email}
                        {index !== 0 && (
                          <span
                            data-tag-handle
                            onClick={() => removeEmail(index)}
                          >
                            ×
                          </span>
                        )}
                      </div>
                    );
                  }}
                />
                {/* </FormControl> */}
              </Grid>
            </Grid>
          )}
          {removeMessage && (
            <Grid
              container
              rowSpacing={2}
              sx={{
                py: { xs: 1, sm: 1, md: 2, lg: 2, xl: 2 },
                px: { xs: 3, sm: 3, md: 3, lg: 3, xl: 3 },
                fontFamily: "openSans",
                display: "flex",
                flexFlow: "column",
                textAlign: "center",
              }}
            >
              <Grid item>
                {" "}
                <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>
                  {"Comfirm"}
                </Typography>
              </Grid>
              <Grid item>
                <Typography>{`Are you sure you want to remove ${RowData?.full_name} ?`}</Typography>
              </Grid>
            </Grid>
          )}
          <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
            <LoadingButton
              fullWidth
              loading={isLoading}
              variant="contained"
              onClick={() => {
                formik.handleSubmit();
              }}
            >
              {removeMessage
                ? "Remove & Update status"
                : showInterviewForm
                ? "Shedule interview & Update status"
                : "Update status"}
            </LoadingButton>
            {removeMessage ||
              (showInterviewForm && (
                <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{ mt: 2 }}
                    onClick={() => {
                      formik.setFieldValue("status", "");
                      setRemoveMessage(false);
                      setShowInterviewForm(false);
                    }}
                  >
                    {"Cancel"}
                  </Button>
                </Grid>
              ))}
          </Grid>
        </Grid>
      </Box>
    </Drawer>
  );
};

export default SideBarStatus;
