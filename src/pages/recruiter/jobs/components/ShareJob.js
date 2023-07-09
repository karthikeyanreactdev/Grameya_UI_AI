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

// ** Store Imports
import { useDispatch, useSelector } from "react-redux";

// ** Actions Imports
// import { addUser } from "src/store/apps/user";
import {
  // Autocomplete,
  Chip,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputBase,
  InputLabel,
  Paper,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";

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
import GoogleApiWrapper from "../../../../utils/GoogleMap/index";
import useNotification from "src/hooks/useNotification";
// import { validationSchema } from "../validation";
import { makeStyles } from "@mui/styles";
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { useRouter } from "next/router";
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
const SideBarShareJob = (props) => {
  // ** Props
  const { open, toggle, id } = props;
  const router = useRouter();
  const { query } = router;
  console.log("query", query);
  // ** State
  const [plan, setPlan] = useState("basic");
  const [role, setRole] = useState("subscriber");
  const [shareUrl, setShareUrl] = useState("");
  const [OS, setOS] = useState("");
  // ** Hooks
  const dispatch = useDispatch();
  const classes = useStyles();

  const [sendNotification] = useNotification();
  const { userData } = useSelector((state) => state.auth);

  const [salary, setSalary] = useState([0, 0]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const handleClose = () => {
    toggle();
  };
  // console.log(draftToHtml(convertToRaw(jd.getCurrentContent())));
  useEffect(() => {
    // if (router.isReady) {
    // Code using query
    console.log(router.query);
    if (id) {
      const url = `${"https://devgrameyaapi.sarosk.net/share_job/"}${id}`;
      setShareUrl(url);
      // setOpen(false);
    } else {
      // router.back();
      // }
    }
  }, [open]);
  const handleTooltipClose = () => {
    setOpen(false);
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
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <>
              <Typography variant="h5">{"Job Share"}</Typography>
            </>
          </Grid>
        </Grid>
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
        <iframe
          //ref={ref}
          style={{}}
          id="myFrame2"
          src={shareUrl}
          width="100%"
          height="100%"
        ></iframe>
        <Paper
          variant="outlined"
          component="form"
          sx={{
            p: "8px 6px",
            display: "flex",
            mb: 4,
            alignItems: "center",
          }}
        >
          <InputBase
            sx={{
              ml: 1,
              flex: 1,
            }}
            value={shareUrl}
            inputProps={{
              "aria-label": "share",
            }}
          />

          <Divider
            sx={{
              height: 28,
              m: 0.5,
            }}
            orientation="vertical"
          />
          <Tooltip
            PopperProps={{
              disablePortal: true,
            }}
            onClose={handleTooltipClose}
            open={isOpen}
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: "common.black",
                  "& .MuiTooltip-arrow": {
                    color: "common.black",
                  },
                  fontSize: 12,
                },
              },
            }}
            disableFocusListener
            disableHoverListener
            disableTouchListener
            title="Copied!"
          >
            <Button
              color="primary"
              onClick={() => {
                navigator.clipboard.writeText(shareUrl);
                setOpen(true);
                setTimeout(() => {
                  setOpen(false);
                }, 2000);
              }}
              variant="contained"
            >
              {"Copy"}
            </Button>
          </Tooltip>
        </Paper>
        <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
          {shareUrl !== "" && (
            <Grid
              container
              sx={{
                // marginTop: "1px",
                display: {
                  sm: "none",
                  xs: "none",
                  md: "none",
                  lg: "flex",
                },
                // justifyContent: "space-around",
              }}
              gap={2}
            >
              <LinkedinShareButton url={shareUrl}>
                <LinkedinIcon
                  size={"2rem"} // You can use rem value instead of numbers
                  round
                />
              </LinkedinShareButton>
              <TwitterShareButton url={shareUrl}>
                <TwitterIcon
                  size={"2rem"} // You can use rem value instead of numbers
                  round
                />
              </TwitterShareButton>
              <WhatsappShareButton url={shareUrl}>
                <WhatsappIcon
                  size={"2rem"} // You can use rem value instead of numbers
                  round
                />
              </WhatsappShareButton>

              <FacebookShareButton url={shareUrl}>
                <FacebookIcon
                  size={"2rem"} // You can use rem value instead of numbers
                  round
                />
              </FacebookShareButton>
            </Grid>
          )}
          {shareUrl !== "" && (
            <Grid
              container
              sx={{
                // marginTop: "20px",
                display: { lg: "none", xl: "none" },
              }}
              gap={2}
              // lg={0}
              // xl={0}
              // sm={0}
              // xs={0}
              // md={0}
            >
              <LinkedinShareButton url={shareUrl}>
                <LinkedinIcon
                  size={"2rem"} // You can use rem value instead of numbers
                  round
                />
              </LinkedinShareButton>
              <TwitterShareButton url={shareUrl}>
                <TwitterIcon
                  size={"2rem"} // You can use rem value instead of numbers
                  round
                />
              </TwitterShareButton>

              <div
                onClick={() => openWhatsAppShare()}
                style={{
                  cursor: "pointer",
                  margin: "10px 0px 10px 0px",
                }}
              >
                <WhatsappIcon
                  size={"2rem"} // You can use rem value instead of numbers
                  round
                />
              </div>
              {OS == "Android" && (
                <div
                  onClick={() => openFacebookShare()}
                  style={{
                    cursor: "pointer",
                    margin: "10px 0px 10px 0px",
                  }}
                >
                  <FacebookIcon
                    size={"2rem"} // You can use rem value instead of numbers
                    round
                  />
                </div>
              )}
              {OS != "Android" && (
                <FacebookShareButton url={shareUrl}>
                  <FacebookIcon
                    size={"2rem"} // You can use rem value instead of numbers
                    round
                  />
                </FacebookShareButton>
              )}
            </Grid>
          )}
        </Grid>
      </Box>
    </Drawer>
  );
};

export default SideBarShareJob;
