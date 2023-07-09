// ** React Imports
import { useContext, useEffect, useRef, useState } from "react";

// ** Context Imports
import {
  Grid,
  Box,
  Button,
  CardActionArea,
  CardActions,
  List,
  ListItem,
  IconButton,
  ListItemText,
  Tooltip,
} from "@mui/material";
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

import {
  getProfile,
  removeJobseekerEducation,
  removeJobseekerExperience,
} from "src/api-services/seeker/profile";

import useNotification from "src/hooks/useNotification";
import BasicInfo from "./components/BasicInfo";

import { DeleteOutline } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getUserData } from "src/store/apps/auth";
import { getAppliedSeekerProfile } from "src/store/apps/recruiter/applied-seeker";
const userStatusObj = {
  active: "success",
  pending: "warning",
  inactive: "secondary",
};

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
  const router = useRouter();

  const { direction } = theme;
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("info");
  const hideText = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [selectedExp, setSelectedExp] = useState(null);
  const [selectedEducation, setSelectedEducation] = useState(null);
  const [sendNotification] = useNotification();
  const [isEditMode, setIsEditMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const { isLoadingFlag, appliedCandidateProfile } = useSelector(
    (state) => state.appliedSeeker
  );
  console.log("applied seeker", appliedCandidateProfile);
  const [drawerState, setDrawerState] = useState({
    isBasicInfoEdit: false,
    isAddNewEducation: false,
    isEditEducation: false,
    isAddNewExperiance: false,
    isEditExperiance: false,
  });

  const [userDetail, setUserDetail] = useState(null);
  const resumeComponentRef = useRef(null);

  const handleChangeLoading = (status) => {
    setIsLoading(status);
  };

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
    // handleChangeLoading(true);
    if (router?.query?.id) {
      dispatch(getAppliedSeekerProfile(router?.query?.id));
    }

    // try {
    //   const response = await getProfile();
    //   if (response?.data?.data) {
    //     setUserDetail(response.data.data);
    //   }
    // } catch (e) {
    //   console.log("e", e);
    // } finally {
    //   handleChangeLoading(false);
    // }
  };

  // useEffect(() => {
  //   console.log(window.location);
  //   console.log(router?.query?.id);
  //   console.log(router);
  //   if (router?.query?.id) {
  //     getProfileDetail();
  //   } else {
  //     router.back();
  //   }
  // }, [router?.query?.id]);

  const handleDeleteEducation = async (formValue) => {
    console.log("check");
    // setSubmitted(true);
    handleChangeLoading(true);
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
      sendNotification({
        message: e,
        variant: "error",
      });
    } finally {
      handleChangeLoading(false);
    }
  };

  const handleDeleteExpirince = async (formValue) => {
    console.log("check");
    // setSubmitted(true);
    handleChangeLoading(true);
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
    } finally {
      handleChangeLoading(false);
    }
  };

  const handleEditChange = () => {
    setIsEditMode(!isEditMode);
  };

  const handleEditCloseChange = () => {
    setIsEditMode(true);
  };

  const formatDate = (dateValue) => {
    const inputDate = new Date(dateValue);
    const formattedDate = inputDate.toLocaleDateString("en-GB");
    return formattedDate;
  };

  const handleSelectCertification = (item) => {
    setSelectedCertificate(item);
  };

  const handleClick = () => {
    // Call the child component's function using the ref
    resumeComponentRef.current.handleFileUpload();
  };
  useEffect(() => {
    if (router.isReady) {
      // Code using query
      console.log(router.query);
      if (router?.query?.id) {
        getProfileDetail();
      } else {
        router.back();
      }
    }
  }, [router.isReady]);

  return (
    <>
      {/* <CommonLoader isLoading={isLoading} /> */}
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <UserProfileHeader
            onHandleEdit={handleEditChange}
            getProfileDetail={getProfileDetail}
            onHandleChangeLoading={handleChangeLoading}
            userDetail={appliedCandidateProfile}
            isEditMode={isEditMode}
            activeTab={activeTab}
            onHandleDrawerStateChangeOpen={handleDrawerStateChangeOpen}
            handleClick={handleClick}
          />
        </Grid>

        <Grid item xs={12}>
          {appliedCandidateProfile && (
            <>
              <BasicInfo />
            </>
          )}
        </Grid>
      </Grid>
    </>
  );
};
ACLPage.acl = {
  action: "read",
  subject: "rcprofile",
};

export default ACLPage;
