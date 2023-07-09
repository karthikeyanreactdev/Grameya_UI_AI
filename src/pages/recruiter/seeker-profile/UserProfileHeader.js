// ** React Imports
import { useState, useEffect, useRef } from "react";

// ** MUI Components
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";

// ** Third Party Imports
import axios from "axios";

// ** Icon Imports
import Icon from "src/@core/components/icon";
import { updateResume } from "src/api-services/seeker/profile";
import useNotification from "src/hooks/useNotification";
import { useRouter } from "next/router";
import { LoadingButton } from "@mui/lab";
import Swal from "sweetalert2";
import {
  addShortList,
  deleteShortListedCandidate,
} from "src/api-services/recruiter/candidate";

const ProfilePicture = styled("img")(({ theme }) => ({
  width: 108,
  height: 108,
  borderRadius: theme.shape.borderRadius,
  boxShadow: "4px 4px 4px",
  border: `4px solid ${theme.palette.common.white}`,
  [theme.breakpoints.down("md")]: {
    marginBottom: theme.spacing(4),
  },
}));

const UserProfileHeader = ({
  onHandleEdit,
  getProfileDetail,
  onHandleChangeLoading,
  userDetail,
  isEditMode,
  activeTab,
  onHandleDrawerStateChangeOpen,
  handleClick,
}) => {
  const [sendNotification] = useNotification();
  // ** State
  const router = useRouter();
  const [isShortListLoading, setIsShortListLoading] = useState(false);
  const [isShortListLoadingId, setIsShortListLoadingId] = useState("");
  const [data, setData] = useState({
    location: "Chennai",
    joiningDate: "May 2023",
    fullName: "Karthikeyan D",
    designation: "Developer",
    profileImg: "/images/g.jpg",
    designationIcon: "tabler:color-swatch",
    coverImg: "/images/pages/profile-banner.png",
  });
  // setData()
  // useEffect(() => {
  //   axios.get('/pages/profile-header').then(response => {})
  // }, [])
  const designationIcon = data?.designationIcon || "tabler:briefcase";

  const handleChangeDrawer = (value) => {
    onHandleDrawerStateChangeOpen(value);
  };
  const handleAddShortList = async (id) => {
    console.log(id);
    Swal.fire({
      title: "Do you want to save?",
      // showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Yes",
      // denyButtonText: `Don't save`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const params = {
            seeker_ids: [id],
          };
          setIsShortListLoading(true);
          setIsShortListLoadingId(id);

          const response = await addShortList(params);
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
          getProfileDetail();
          setIsShortListLoading(false);
        }
      }
    });
  };

  const removeShortList = async (id) => {
    console.log(id);
    Swal.fire({
      title: "Do you want to remove?",
      // showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Yes",
      // denyButtonText: `Don't save`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // const params = {
          //   seeker_ids: id,
          // };
          setIsShortListLoading(true);
          setIsShortListLoadingId(id);

          let params = {
            seeker_ids: [id],
          };
          // console.log("re", params);
          const response = await deleteShortListedCandidate(params);
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
          getProfileDetail();

          setIsShortListLoading(false);
        }
      }
    });
  };
  return data !== null ? (
    <Card>
      <CardMedia
        component="img"
        alt="profile-header"
        image={userDetail?.cover_image_url || data.coverImg}
        sx={{
          height: { xs: 150, md: 250 },
        }}
      />
      <CardContent
        sx={{
          pt: 0,
          mt: -8,
          display: "flex",
          alignItems: "flex-end",
          flexWrap: { xs: "wrap", md: "nowrap" },
          justifyContent: { xs: "center", md: "flex-start" },
        }}
      >
        <ProfilePicture
          src={userDetail?.profile_image_url || data.profileImg}
          alt="profile-picture"
        />
        <Box
          sx={{
            width: "100%",
            display: "flex",
            ml: { xs: 0, md: 6 },
            alignItems: "flex-end",
            flexWrap: ["wrap", "nowrap"],
            justifyContent: ["center", "space-between"],
          }}
        >
          <Box
            sx={{
              mb: [6, 0],
              display: "flex",
              flexDirection: "column",
              alignItems: ["center", "flex-start"],
            }}
          >
            <Typography variant="h5" sx={{ mb: 2.5 }}>
              {userDetail?.full_name}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: ["center", "flex-start"],
              }}
            >
              {userDetail?.designation && (
                <>
                  <Box
                    sx={{
                      mr: 4,
                      display: "flex",
                      alignItems: "center",
                      "& svg": { mr: 1.5, color: "text.secondary" },
                    }}
                  >
                    <Icon fontSize="1.25rem" icon={designationIcon} />
                    <Typography sx={{ color: "text.secondary" }}>
                      {userDetail?.designation}
                    </Typography>
                  </Box>
                </>
              )}
              {userDetail?.current_location && (
                <>
                  <Box
                    sx={{
                      mr: 4,
                      display: "flex",
                      alignItems: "center",
                      "& svg": { mr: 1.5, color: "text.secondary" },
                    }}
                  >
                    <Icon fontSize="1.25rem" icon="tabler:map-pin" />
                    <Typography sx={{ color: "text.secondary" }}>
                      {userDetail?.current_location}
                    </Typography>
                  </Box>
                </>
              )}

              {/* <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  "& svg": { mr: 1.5, color: "text.secondary" },
                }}
              >
                <Icon fontSize="1.25rem" icon="tabler:calendar" />
                <Typography sx={{ color: "text.secondary" }}>
                  Joined {data.joiningDate}
                </Typography>
              </Box> */}
            </Box>
          </Box>
          <Box>
            <LoadingButton
              loading={isShortListLoading}
              sx={{ mr: 2 }}
              color={
                userDetail?.is_shortlisted_candidate ? "success" : "primary"
              }
              title={
                userDetail?.is_shortlisted_candidate
                  ? "Remove Candidate"
                  : "Save Candidate"
              }
              onClick={() =>
                userDetail?.is_shortlisted_candidate
                  ? removeShortList(userDetail?.applicant_id)
                  : handleAddShortList(userDetail?.applicant_id)
              }
            >
              {userDetail?.is_shortlisted_candidate ? (
                <Icon fontSize="1.5rem" icon="tabler:user-check" />
              ) : (
                <Icon
                  fontSize="1.5rem"
                  icon="tabler:user-plus"
                  sx={{ bacground: "red" }}
                  // color="error"
                />
              )}
            </LoadingButton>
            <Button
              variant={"outlined"}
              color={"primary"}
              sx={{ "& svg": { mr: 2 }, mr: 2 }}
              onClick={() => router.back()}
            >
              {/* <Icon
                // icon={isEditMode ? "tabler:pencil" : "material-symbols:close"}
                fontSize="1.125rem"
              /> */}
              {"Back"}
            </Button>
            {/* {renderRightSectionBtn()} */}
          </Box>
        </Box>
      </CardContent>
    </Card>
  ) : null;
};

export default UserProfileHeader;
