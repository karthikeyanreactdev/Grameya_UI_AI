// ** React Imports
import {
  useCallback,
  useContext,
  useState,
  forwardRef,
  useEffect,
} from "react";

// ** Context Imports
import { AbilityContext } from "src/layouts/components/acl/Can";

// ** MUI Imports
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderIcon from "@mui/icons-material/Folder";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import GoogleApiWrapper from "../../../utils/GoogleMap/index";

// ** Icon Imports
import Icon from "src/@core/components/icon";

import "react-datepicker/dist/react-datepicker.css";
import { makeStyles } from "@mui/styles";
import {
  Avatar,
  Button,
  Chip,
  CircularProgress,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { useRouter } from "next/router";
import { Stack } from "@mui/system";
import { getJobById } from "src/api-services/recruiter/jobs";
import useNotification from "src/hooks/useNotification";
import {
  addSaveJob,
  applyJobById,
  getSeekerJobDetailsById,
} from "src/api-services/seeker/jobsdetails";
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
import { LoadingButton } from "@mui/lab";
import SideBarJob from "../jobs/components/ManageJobDrawer";
import moment from "moment";
const useStyles = makeStyles({
  root: {
    "& .MuiDataGrid-root.MuiDataGrid-cell": {
      border: "none",
      borderColor: "transparent",
    },
  },
});
const CandidateJobDetail = () => {
  const router = useRouter();
  const { query } = router;
  console.log("query", query);
  const classes = useStyles();
  // const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isApplyLoading, setIsApplyLoading] = useState(false);
  const [jobDetails, setJobDetails] = useState([]);
  const [open, setOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [id, setId] = useState("");
  const [OS, setOS] = useState("");
  const [sendNotification] = useNotification();
  const [addUserOpen, setAddUserOpen] = useState(false);
  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen);
  const viewJob = async () => {
    try {
      setIsLoading(true);

      const result = await getSeekerJobDetailsById(query?.id);
      // toggle();
      console.log(result?.data?.data);
      setJobDetails(result?.data?.data);
      // sendNotification({
      //   message: result?.data?.message,
      //   variant: "success",
      // });
    } catch (e) {
      sendNotification({
        message: e,
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyJob = async () => {
    try {
      setIsApplyLoading(true);

      const result = await applyJobById({ job_id: query?.id });
      // // toggle();
      // console.log(result?.data?.data);
      // setJobDetails(result?.data?.data);
      viewJob();
      sendNotification({
        message: result?.message,
        variant: "success",
      });
    } catch (e) {
      sendNotification({
        message: e,
        variant: "error",
      });
    } finally {
      setIsApplyLoading(false);
    }
  };
  // useEffect(() => {
  //   viewJob();
  // }, []);

  useEffect(() => {
    if (router.isReady) {
      // Code using query
      console.log(router.query);
      if (query?.id) {
        setId(id);
        viewJob();
        const url = `${"https://devgrameyaapi.sarosk.net/share_job/"}${
          query?.id
        }`;
        setShareUrl(url);
      } else {
        router.back();
      }
    }
  }, [router.isReady]);

  const handleAddSavedJob = async () => {
    try {
      setIsLoading(true);
      const param = {
        job_id: query?.id,
      };

      const result = await addSaveJob(param);
      // toggle();
      console.log(result?.data?.data);
      // setJobDetails(result?.data?.data);
      viewJob();
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
  };

  const openFacebookShare = () => {
    window.open(
      `fb://faceweb/f?href=https://m.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      "_blank"
    );
  };

  const openWhatsAppShare = () => {
    window.open(`whatsapp://send?text=${shareUrl}`, "_blank");
  };

  const openTwitterShare = () => {
    window.open(`twitter://intent/tweet?url=${shareUrl}`, "_blank");
  };

  const openLinkedInShare = () => {
    window.open(`linkedin://sharing/share-offsite/?url=${shareUrl}`, "_blank");
  };

  const getOS = () => {
    var userAgent = window.navigator.userAgent,
      platform =
        window.navigator?.userAgentData?.platform || window.navigator.platform,
      macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"],
      windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"],
      iosPlatforms = ["iPhone", "iPad", "iPod"],
      os = null;

    if (macosPlatforms.indexOf(platform) !== -1) {
      os = "Mac-OS";
    } else if (iosPlatforms.indexOf(platform) !== -1) {
      os = "iOS";
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
      os = "Windows";
    } else if (/Android/.test(userAgent)) {
      os = "Android";
    } else if (/Linux/.test(platform)) {
      os = "Linux";
    }

    setOS(os);
  };

  useEffect(() => {
    getOS();
    // getShareUrl();
  }, []);
  return (
    <Grid container spacing={6} className={classes.root}>
      <SideBarJob open={addUserOpen} toggle={toggleAddUserDrawer} id={id} />
      <Grid item xs={12}>
        <Card>
          <Grid container spacing={2}>
            <Grid item xs={10}>
              <CardHeader title="Job Detail " />
            </Grid>
            {!isLoading && (
              <Grid item xs={2}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mt: 6,
                    mr: 2,
                  }}
                >
                  <Button
                    color={"primary"}
                    title="Back"
                    variant="outlined"
                    size="small"
                    onClick={() => router.back()}
                  >
                    Back
                  </Button>
                </Box>
              </Grid>
            )}
          </Grid>

          <Divider sx={{ m: "0 !important" }} />

          <CardContent>
            {isLoading && (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </Box>
            )}
            {!isLoading && (
              <Grid container spacing={4}>
                <Grid item sm={12} xs={12} md={8} lg={8} mt={0}>
                  <Typography sx={{ fontSize: "1.3rem", fontWeight: 500 }}>
                    {jobDetails?.job_title}
                  </Typography>
                  {/* <Typography>8 Vacancy </Typography> */}
                  <Typography sx={{ mt: 4 }}>
                    <Typography
                      //  sx={{ fontSize: "1.125rem" }}

                      variant="body2"
                      sx={{
                        my: 3,
                        color: "text.primary",
                        fontSize: "0.825rem",
                        textTransform: "uppercase",
                        fontWeight: 500,
                      }}
                    >
                      Job Description
                    </Typography>
                    <Typography sx={{ mt: 2, fontSize: "0.825rem" }}>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: jobDetails?.short_description,
                        }}
                      />
                    </Typography>
                    <div>
                      <Typography
                        variant="body2"
                        sx={{
                          my: 3,
                          color: "text.primary",
                          fontSize: "12px",
                          textTransform: "uppercase",
                          fontWeight: 500,
                        }}
                      >
                        Key Skills
                      </Typography>
                      {/* {renderTeams(teams)} */}
                      {jobDetails?.skills?.map((option, index) => (
                        <Chip
                          variant="outlined"
                          color="primary"
                          // color="black"
                          sx={{ mx: 1, my: 1, fontSize: "12px" }}
                          // sx={{ color: "#" }}
                          label={
                            option?.name === null || option?.name === undefined
                              ? option
                              : option?.name
                          }
                        />
                      ))}
                    </div>
                    <Typography
                      //  sx={{ fontSize: "1.125rem" }}

                      variant="body2"
                      sx={{
                        my: 3,
                        color: "text.primary",
                        fontSize: "0.825rem",
                        textTransform: "uppercase",
                        fontWeight: 500,
                      }}
                    >
                      Share
                    </Typography>
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
                  </Typography>
                </Grid>
                <Grid item sm={12} xs={12} md={4} lg={4} mt={0}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "0.825rem",
                      mb: 2,
                      mt: 4,
                      color: "text.primary",
                      textTransform: "uppercase",
                    }}
                  >
                    Job Overview
                  </Typography>
                  <Box
                    sx={{
                      border: "1px solid #52404040",
                      borderRadius: "8px",
                      // p: 4,
                    }}
                  >
                    <List sx={{ px: 4 }}>
                      <ListItem sx={{ p: 0, mt: 3 }}>
                        <ListItemAvatar>
                          <Avatar>
                            <Icon fontSize="1.25rem" icon="carbon:location" />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="Location"
                          secondary={jobDetails?.city}
                        />
                      </ListItem>

                      <ListItem sx={{ p: 0, mt: 3 }}>
                        <ListItemAvatar>
                          <Avatar>
                            <Icon fontSize="1.25rem" icon="bx:rupee" />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="Offered Salary"
                          secondary={`₹${jobDetails?.salary_from} - ₹${jobDetails?.salary_to} LPA`}
                        />
                      </ListItem>
                      <ListItem sx={{ p: 0, mt: 3 }}>
                        <ListItemAvatar>
                          <Avatar>
                            <Icon fontSize="1.25rem" icon="cil:chart-line" />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="Experiance"
                          secondary={`${jobDetails?.experience_from} - ${jobDetails?.experience_to} Years`}
                        />
                      </ListItem>
                      {/* <ListItem sx={{ p: 0, mt: 3 }}>
                      <ListItemAvatar>
                        <Avatar>
                          <Icon
                            fontSize="1.25rem"
                            icon="icon-park-outline:degree-hat"
                          />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary="Qualification"
                        secondary="Bachelor Degree"
                      />
                    </ListItem> */}
                      <ListItem sx={{ p: 0, mt: 3 }}>
                        <ListItemAvatar>
                          <Avatar>
                            <Icon
                              fontSize="1.25rem"
                              icon="medical-icon:i-waiting-area"
                            />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="Notice Period"
                          secondary={jobDetails?.notice_period}
                        />
                      </ListItem>
                      <ListItem sx={{ p: 0, mt: 3 }}>
                        <ListItemAvatar>
                          <Avatar>
                            <Icon fontSize="1.25rem" icon="mdi:company" />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="Industry"
                          secondary={jobDetails?.job_category}
                        />
                      </ListItem>
                      <ListItem sx={{ p: 0, mt: 3 }}>
                        <ListItemAvatar>
                          <Avatar>
                            <Icon
                              fontSize="1.25rem"
                              icon="carbon:category-new-each"
                            />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="Category"
                          secondary={jobDetails?.job_sub_category}
                        />
                      </ListItem>

                      <ListItem sx={{ p: 0, mt: 3 }}>
                        <ListItemAvatar>
                          <Avatar>
                            <Icon fontSize="1.25rem" icon="ri:time-line" />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="Date Posted"
                          secondary={moment
                            .utc(jobDetails?.created)
                            .local()
                            .startOf("seconds")
                            .fromNow()}
                        />
                      </ListItem>
                    </List>

                    {/* <Button variant="outlined" fullWidth sx={{ my: 5 }}>
                    Save Job
                  </Button> */}
                    <Box
                      sx={{
                        my: 3,

                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <LoadingButton
                        variant="contained"
                        fullWidth
                        loading={isApplyLoading}
                        // disabled={isApplyLoading}
                        // disabled={true}
                        sx={{
                          width: 0.8,
                        }}
                        onClick={() => {
                          toggleAddUserDrawer();
                        }}
                      >
                        {/* {jobDetails?.is_applied ? "Applied" : "Apply Job"} */}
                        {"Edit Job"}
                      </LoadingButton>
                    </Box>
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "0.825rem",
                      mb: 2,
                      mt: 4,
                      color: "text.primary",
                      textTransform: "uppercase",
                    }}
                  >
                    Company info
                  </Typography>
                  <Box
                    sx={{
                      border: "1px solid #52404040",
                      borderRadius: "8px",
                      // p: 4,
                    }}
                  >
                    <List sx={{ px: 4 }}>
                      <ListItem sx={{ p: 0, mt: 3 }}>
                        <ListItemAvatar>
                          <Avatar>
                            <Icon
                              fontSize="1.25rem"
                              icon="heroicons:building-office-2"
                            />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="Company Name"
                          secondary={jobDetails?.company_name}
                        />
                      </ListItem>
                      <ListItem sx={{ p: 0, mt: 3 }}>
                        <ListItemAvatar>
                          <Avatar>
                            <Icon
                              fontSize="1.25rem"
                              icon="carbon:location-company"
                            />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="Location"
                          secondary={jobDetails?.city}
                        />
                      </ListItem>
                      <ListItem sx={{ p: 0, mt: 3 }}>
                        <ListItemAvatar>
                          <Avatar>
                            <Icon
                              fontSize="1.25rem"
                              icon="fa-regular:address-card"
                            />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="Address"
                          secondary={`${jobDetails?.address_line_one}, ${jobDetails?.address_line_two}`}
                        />
                      </ListItem>
                      <ListItem
                        sx={{ p: 0, mt: 3, cursor: "pointer" }}
                        onClick={() => {
                          if (jobDetails?.recruiterDetails?.website) {
                            window.open("", "_self");
                            window.open(
                              jobDetails?.recruiterDetails?.website,
                              "_blank"
                            );
                          }
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar>
                            <Icon fontSize="1.25rem" icon="mdi:web" />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="Website"
                          secondary={`${jobDetails?.recruiterDetails?.website}`}
                        />
                      </ListItem>

                      <Box
                        className="form-map form-item"
                        sx={{ height: "221px", position: "relative", mt: 5 }}
                      >
                        <GoogleApiWrapper />
                      </Box>
                    </List>
                  </Box>
                </Grid>
              </Grid>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
CandidateJobDetail.acl = {
  action: "read",
  subject: "jobPreview",
};

export default CandidateJobDetail;
