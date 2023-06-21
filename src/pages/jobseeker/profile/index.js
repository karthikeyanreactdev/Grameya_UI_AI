// ** React Imports
import { useContext, useEffect, useState } from "react";

// ** Context Imports
import { Grid, Box, Button, CardActionArea, CardActions } from "@mui/material";
import Icon from "src/@core/components/icon";
import { useTheme } from "@mui/material/styles";
import "react-datepicker/dist/react-datepicker.css";
import MuiTabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import { styled } from "@mui/material/styles";
import TabPanel from "@mui/lab/TabPanel";
import useMediaQuery from "@mui/material/useMediaQuery";
import TabContext from "@mui/lab/TabContext";
// ** MUI Imports
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import UserProfileHeader from "./UserProfileHeader";
import AddNewEducation from "./components/AddNewEducation";
import EditEducation from "./components/EditEducation";
import AddNewExperiance from "./components/AddNewExperiance";
import EditExperiance from "./components/EditExperiance";
import {
  getProfile,
  removeJobseekerEducation,
  removeJobseekerExperience,
} from "src/api-services/seeker/profile";
import EditBasicInfo from "./components/EditBasicInfo";
import useNotification from "src/hooks/useNotification";
import BasicInfo from "./components/BasicInfo";

const TabList = styled(MuiTabList)(({ theme }) => ({
  borderBottom: "0 !important",
  "&, & .MuiTabs-scroller": {
    boxSizing: "content-box",
    padding: theme.spacing(1.25, 1.25, 2),
    margin: `${theme.spacing(-1.25, -1.25, -2)} !important`,
  },
  "& .MuiTabs-indicator": {
    display: "none",
  },
  "& .Mui-selected": {
    boxShadow: theme.shadows[2],
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`,
  },
  "& .MuiTab-root": {
    minWidth: 65,
    minHeight: 38,
    lineHeight: 1,
    borderRadius: theme.shape.borderRadius,
    "&:hover": {
      color: theme.palette.primary.main,
    },
    [theme.breakpoints.up("sm")]: {
      minWidth: 130,
    },
  },
}));

const ACLPage = () => {
  const theme = useTheme();
  const { direction } = theme;
  const [activeTab, setActiveTab] = useState("info");
  const hideText = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [selectedExp, setSelectedExp] = useState(null);
  const [selectedEducation, setSelectedEducation] = useState(null);
  const [sendNotification] = useNotification();
  const [isEditMode, setIsEditMode] = useState(true);

  const [drawerState, setDrawerState] = useState({
    isBasicInfoEdit: false,
    isAddNewEducation: false,
    isEditEducation: false,
    isAddNewExperiance: false,
    isEditExperiance: false,
  });

  const [userdetail, setUserDetail] = useState(null);

  const handleSelectExp = (item) => {
    setSelectedExp(item);
  };

  const handleDrawerStateChangeOpen = (parentName) => {
    const newDrawerState = { ...drawerState };
    newDrawerState[parentName] = true;
    setDrawerState(newDrawerState);
  };

  const handleDrawerStateChangeClose = (parentName) => {
    const newDrawerState = { ...drawerState };
    newDrawerState[parentName] = false;
    setDrawerState(newDrawerState);
  };

  const handleTabChange = (event, value) => {
    // setIsLoading(true)
    setActiveTab(value);
  };

  const getProfileDetail = async () => {
    try {
      const response = await getProfile();
      if (response?.data?.data) {
        setUserDetail(response.data.data);
      }
    } catch (e) {
      console.log("e", e);
    } finally {
    }
  };

  useEffect(() => {
    getProfileDetail();
  }, []);

  const handleDeleteEducation = async (formValue) => {
    console.log("check");
    // setSubmitted(true);
    try {
      const apiData = {
        education_id: formValue,
      };
      const response = await removeJobseekerEducation(apiData);
      console.log("response", response);
      if (response.status === 200) {
        sendNotification({
          message: response?.data?.message,
          variant: "success",
        });
        getProfileDetail();
        // handleClose();
      }
    } catch (e) {
      console.log("e", e);
    }
  };

  const handleDeleteExpirince = async (formValue) => {
    console.log("check");
    // setSubmitted(true);
    try {
      const apiData = {
        experience_id: formValue,
      };
      const response = await removeJobseekerExperience(apiData);
      console.log("response", response);
      if (response.status === 200) {
        sendNotification({
          message: response?.data?.message,
          variant: "success",
        });
        getProfileDetail();
        // handleClose();
      }
    } catch (e) {
      console.log("e", e);
    }
  };

  const handleEditChange = () => {
    setIsEditMode(false);
  };

  const handleEditCloseChange = () => {
    setIsEditMode(true);
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserProfileHeader onHandleEdit={handleEditChange} />
      </Grid>
      {activeTab === undefined ? null : (
        <Grid item xs={12}>
          <TabContext value={activeTab}>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <TabList
                  variant="scrollable"
                  scrollButtons="auto"
                  onChange={handleTabChange}
                  aria-label="customized tabs example"
                >
                  <Tab
                    value="info"
                    label={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          ...(!hideText && { "& svg": { mr: 2 } }),
                        }}
                      >
                        <Icon fontSize="1.125rem" icon="tabler:user-check" />
                        {!hideText && "Basic Info"}
                      </Box>
                    }
                  />
                  <Tab
                    value="education"
                    label={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          ...(!hideText && { "& svg": { mr: 2 } }),
                        }}
                      >
                        <Icon fontSize="1.125rem" icon="tabler:books" />
                        {!hideText && "Education"}
                      </Box>
                    }
                  />
                  <Tab
                    value="work"
                    label={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          ...(!hideText && { "& svg": { mr: 2 } }),
                        }}
                      >
                        <Icon fontSize="1.125rem" icon="tabler:layout-grid" />
                        {!hideText && "Work Experiance"}
                      </Box>
                    }
                  />
                </TabList>
              </Grid>
              <Grid item xs={12}>
                {false ? (
                  <Box
                    sx={{
                      mt: 6,
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <CircularProgress sx={{ mb: 4 }} />
                    <Typography>Loading...</Typography>
                  </Box>
                ) : (
                  <TabPanel sx={{ p: 0 }} value={activeTab}>
                    {activeTab === "info" && (
                      <>
                        {userdetail && (
                          <>
                            <BasicInfo
                              userDetail={userdetail}
                              handleDrawerStateChangeOpen={
                                handleDrawerStateChangeOpen
                              }
                              isEditMode={isEditMode}
                              onHandleEditCloseChange={handleEditCloseChange}
                            />
                          </>
                        )}

                        {drawerState.isBasicInfoEdit && (
                          <>
                            <EditBasicInfo
                              getProfileDetail={getProfileDetail}
                              isOpen={drawerState.isBasicInfoEdit}
                              onClose={handleDrawerStateChangeClose}
                              userDetail={userdetail}
                            />
                          </>
                        )}
                      </>
                    )}
                    {activeTab === "education" && (
                      <Grid item md={12} xs={12}>
                        <Card>
                          <CardContent
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              mx: 32,
                              mt: 4,
                            }}
                          >
                            <Grid container spacing={2} py={2}>
                              <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                                {userdetail?.jobseekerDetails?.educations?.map(
                                  (item, key) => {
                                    return (
                                      <Card sx={{ mt: 3 }} key={key}>
                                        <CardActionArea>
                                          <CardContent>
                                            {item?.education_type === "10th" ||
                                            item?.education_type === "12th" ? (
                                              <>
                                                <Typography
                                                  gutterBottom
                                                  variant="h5"
                                                  component="div"
                                                >
                                                  {item?.education_type}{" "}
                                                  {item?.grade_or_marks} %
                                                </Typography>
                                              </>
                                            ) : (
                                              <>
                                                <Typography
                                                  gutterBottom
                                                  variant="h5"
                                                  component="div"
                                                >
                                                  {item?.course}{" "}
                                                  {item?.grade_or_marks} %
                                                </Typography>
                                              </>
                                            )}

                                            <Typography
                                              gutterBottom
                                              variant="h5"
                                              component="div"
                                            >
                                              {item?.institution_name}
                                            </Typography>
                                            <Typography
                                              variant="body2"
                                              color="text.secondary"
                                            >
                                              {item?.institution_address}
                                            </Typography>
                                            <Typography
                                              variant="body2"
                                              color="text.secondary"
                                            >
                                              year of pased out:{" "}
                                              {item?.year_of_passout ||
                                                item?.course_duration_end}
                                            </Typography>
                                          </CardContent>
                                        </CardActionArea>
                                        <CardActions>
                                          <Button
                                            size="small"
                                            color="primary"
                                            onClick={() => {
                                              setSelectedEducation(item);
                                              handleDrawerStateChangeOpen(
                                                "isEditEducation"
                                              );
                                            }}
                                          >
                                            Edit
                                          </Button>
                                          <Button
                                            size="small"
                                            color="error"
                                            onClick={() =>
                                              handleDeleteEducation(item?.id)
                                            }
                                          >
                                            Remove
                                          </Button>
                                        </CardActions>
                                      </Card>
                                    );
                                  }
                                )}
                              </Grid>
                            </Grid>
                          </CardContent>

                          <CardContent
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              mx: 32,
                              mt: 4,
                            }}
                          >
                            <Grid container spacing={2} py={2}>
                              <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                                <Button
                                  variant="contained"
                                  onClick={() =>
                                    handleDrawerStateChangeOpen(
                                      "isAddNewEducation"
                                    )
                                  }
                                >
                                  Add New Education
                                </Button>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                        {drawerState.isEditEducation && (
                          <EditEducation
                            isOpen={drawerState.isEditEducation}
                            onClose={handleDrawerStateChangeClose}
                            getProfileDetail={getProfileDetail}
                            selectedEducation={selectedEducation}
                          />
                        )}

                        {drawerState.isAddNewEducation && (
                          <AddNewEducation
                            isOpen={drawerState.isAddNewEducation}
                            onClose={handleDrawerStateChangeClose}
                            getProfileDetail={getProfileDetail}
                          />
                        )}
                      </Grid>
                    )}
                    {activeTab === "work" && (
                      <Grid item md={12} xs={12}>
                        <Card>
                          <CardContent
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              mx: 32,
                              mt: 4,
                            }}
                          >
                            <Grid container spacing={2} py={2}>
                              <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                                {userdetail?.jobseekerDetails?.experiences?.map(
                                  (item, index) => {
                                    return (
                                      <Card sx={{ mt: 3 }} key={index}>
                                        <CardActionArea>
                                          <CardContent>
                                            <Typography
                                              gutterBottom
                                              variant="h5"
                                              component="div"
                                            >
                                              {item?.company_name}
                                            </Typography>
                                            <Typography
                                              gutterBottom
                                              variant="h5"
                                              component="div"
                                            >
                                              {item?.designation}
                                            </Typography>
                                            <Typography
                                              variant="body2"
                                              color="text.secondary"
                                            >
                                              Skill:{" "}
                                              {item?.skills.map(
                                                (element, index) => (
                                                  <span key={index}>
                                                    {element}
                                                    {index !==
                                                      userdetail
                                                        ?.jobseekerDetails
                                                        ?.skills.length -
                                                        1 && ", "}
                                                  </span>
                                                )
                                              )}
                                            </Typography>
                                          </CardContent>
                                        </CardActionArea>
                                        <CardActions>
                                          <Button
                                            size="small"
                                            color="primary"
                                            onClick={() => {
                                              handleSelectExp(item);
                                              handleDrawerStateChangeOpen(
                                                "isEditExperiance"
                                              );
                                            }}
                                          >
                                            Edit
                                          </Button>
                                          <Button
                                            size="small"
                                            color="error"
                                            onClick={() => {
                                              handleDeleteExpirince(item.id);
                                            }}
                                          >
                                            Remove
                                          </Button>
                                        </CardActions>
                                      </Card>
                                    );
                                  }
                                )}
                              </Grid>
                            </Grid>
                          </CardContent>

                          <CardContent
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              mx: 32,
                              mt: 4,
                            }}
                          >
                            <Grid container spacing={2} py={2}>
                              <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                                <Button
                                  variant="contained"
                                  onClick={() =>
                                    handleDrawerStateChangeOpen(
                                      "isAddNewExperiance"
                                    )
                                  }
                                >
                                  Add New
                                </Button>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                        {drawerState.isEditExperiance && (
                          <EditExperiance
                            isOpen={drawerState.isEditExperiance}
                            onClose={handleDrawerStateChangeClose}
                            getProfileDetail={getProfileDetail}
                            selectedExp={selectedExp}
                          />
                        )}

                        {drawerState.isAddNewExperiance && (
                          <AddNewExperiance
                            isOpen={drawerState.isAddNewExperiance}
                            onClose={handleDrawerStateChangeClose}
                            getProfileDetail={getProfileDetail}
                          />
                        )}
                      </Grid>
                    )}
                  </TabPanel>
                )}
              </Grid>
            </Grid>
          </TabContext>
        </Grid>
      )}
    </Grid>
  );
};
ACLPage.acl = {
  action: "read",
  subject: "jsprofile",
};

export default ACLPage;
