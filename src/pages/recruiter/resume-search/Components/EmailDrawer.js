// ** React Imports
import { useEffect, useState } from "react";

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
import { ReactMultiEmail, isEmail } from "react-multi-email";
import "react-multi-email/dist/style.css";
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

const filter = createFilterOptions();
import { LoadingButton } from "@mui/lab";
import {
  createJob,
  getJobById,
  getJobSubCategoryById,
  sendEmailNotification,
  updateJobById,
} from "src/api-services/recruiter/jobs";

import Swal from "sweetalert2";
import useNotification from "src/hooks/useNotification";
// import { validationSchema } from "../validation";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  root: {
    "& .wrapper-class.rdw-editor-wrapper": {
      borderRadius: " 0px 0px 8px 8px",
      border: "1px solid #e0e0e0",
      "& .notranslate.public-DraftEditor-content": {
        padding: "0px 16px 0px 16px",
      },
    },
  },
});

const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(6),
  justifyContent: "space-between",
}));
const validationSchema = yup.object({
  jobTitle: yup
    .string("Job Title is required")
    .trim()
    .required("Job Title is required")
    .min(10, "Minimum 10 character required"),
  companyName: yup
    .string("Company Name is required")
    .trim()
    .required("Company Name is required"),
  email: yup
    .string("Email is Required")
    .email("Enter the valid email")
    .trim()
    .required("Email is Required"),
  jobCategory: yup
    .string("Industry is required")
    .required("Industry is required"),
  jobSubCategory: yup
    .string("Job Category is required")

    .required("Job Category is required"),
  location: yup
    .string("Job Location is required")
    .required("Job Location is required"),

  noticePeriod: yup
    .string("Notice Period is required")
    .required("Notice Period is required"),
  jobType: yup.string("Job Type is required").required("Job Type is required"),
  skills: yup
    .array()
    // .of(
    //   yup.object().shape({
    //     id: yup.string(),
    //     jobCategory: yup.string(),
    //   })
    // )
    .min(1, "Minimum 1 skill is required")
    .max(10, "Maximum 10 skills is allowed"),
});
const SideBarEmail = (props) => {
  // ** Props
  const { open, toggle, id, selectedId } = props;

  // ** State
  const [plan, setPlan] = useState("basic");
  const [role, setRole] = useState("subscriber");

  // ** Hooks
  const dispatch = useDispatch();
  const classes = useStyles();

  const [sendNotification] = useNotification();
  const { userData } = useSelector((state) => state.auth);

  // const { jobCategory, skills, noticePeriod, jobType } = useSelector(
  //   (state) => state.misc
  // );
  // console.log("msi", jobCategory, skills, noticePeriod, jobType);
  const [salary, setSalary] = useState([0, 0]);
  const [isLoading, setIsLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const [jobData, setJobData] = useState(null);
  const [experiance, setExperiance] = useState([0, 0]);
  const [jd, setJd] = useState(EditorState.createEmpty());
  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");

  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const handleChange = (event, newValue) => {
    console.log(newValue);
    setSalary(newValue);
  };
  const formik = useFormik({
    initialValues: {
      participantsEmail: [],
    },
    onSubmit: async (values) => {
      if (values.participantsEmail.length > 0) {
        console.log(values);
      } else {
        sendNotification({
          message: "Please enter email address",
          variant: "success",
        });
      }
    },
  });
  const handleClose = () => {
    toggle();
  };

  const handleSendMail = async () => {
    const contentLength = convertToRaw(jd.getCurrentContent());

    console.log(contentLength);
    console.log(contentLength.blocks[0].text.trim() === "");
    // console.log(draftToMarkdown(convertToRaw(jd.getCurrentContent())));
    console.log();

    if (contentLength.blocks[0].text.trim() !== "" || showWarning) {
      try {
        setShowWarning(false);
        setIsLoading(true);
        const params = {
          seeker_ids: selectedId,
          content: `${draftToHtml(
            convertToRaw(jd.getCurrentContent())
          )}`.replace(/\"/g, '"'),
        };
        // console.log("params", params);
        const response = await sendEmailNotification(params);
        handleClose();
        sendNotification({
          message: response?.data?.message,
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
    } else {
      setShowWarning(true);
    }
    // if (contentLength !== "<p></p>") {
    //   console.log(contentLength);
    // } else {
    //   sendNotification({
    //     message: "Please enter email address",
    //     variant: "warning",
    //   });
    // }
    // return;
    // try {
    //   setIsLoading(true);
    //   const params = {
    //     seeker_ids: selectedIds,
    //     content: `${draftToHtml(convertToRaw(jd.getCurrentContent()))}`
    //       // .replace(/\"/g, '"')
    //       .replace(/\"/g, '"'),
    //   };
    //   const response = await sendEmailNotification(params);
    //   sendNotification({
    //     message: response?.message,
    //     variant: "success",
    //   });
    // } catch (e) {
    //   sendNotification({
    //     message: e,
    //     variant: "error",
    //   });
    // } finally {
    //   setIsLoading(false);
    // }
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
        <Typography variant="h5">{"Send Email"}</Typography>
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
          {/* <Grid item lg={12} xl={12} xs={12} md={12} sm={12} sx={{ my: 2 }}>
            {/* <FormControl size="small" fullWidth sx={{ my: 2 }}> *
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
                      <span data-tag-handle onClick={() => removeEmail(index)}>
                        ×
                      </span>
                    )}
                  </div>
                );
              }}
            />
            {/* </FormControl> *
          </Grid> */}
          <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
            <InputLabel id="jd" sx={{ my: 2 }}>
              {" "}
              {/* Job Short Description */}
            </InputLabel>
            <ReactDraftWysiwyg
              wrapperClassName="wrapper-class"
              editorClassName="editor-class"
              toolbarClassName="toolbar-class"
              editorState={jd}
              onEditorStateChange={(data) => {
                setShowWarning(false);
                setJd(data);
              }}
              labelId="jd"
              // toolbar={{
              //   inline: { inDropdown: true },
              //   list: { inDropdown: true },
              //   // textAlign: { inDropdown: true },
              //   // link: { inDropdown: true },
              //   history: { inDropdown: true },
              // }}
            />
          </Grid>
          {showWarning && (
            <Box
              sx={{
                py: 4,
                width: 1,
                display: "flex",
                justifyContent: "center",
                color: "orangeRed",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  // p: 4,
                  // display: "flex",
                  // justifyContent: "center",
                  color: "orangeRed",
                }}
              >
                Email content is empty. Do you want to proceed with pre-defined
                content?
              </Typography>
            </Box>
          )}

          <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
            <LoadingButton
              fullWidth
              loading={isLoading}
              variant="contained"
              onClick={() => handleSendMail()}
            >
              {showWarning ? "Proceed" : "Send"}
            </LoadingButton>
            {showWarning && (
              <Button
                fullWidth
                onClick={() => setShowWarning(false)}
                variant="outlined"
                sx={{ mt: 2 }}
              >
                Cancel
              </Button>
            )}
          </Grid>
        </Grid>
      </Box>
    </Drawer>
  );
};

export default SideBarEmail;
