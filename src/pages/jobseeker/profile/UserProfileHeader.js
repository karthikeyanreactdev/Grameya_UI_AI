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
}) => {
  const [sendNotification] = useNotification();
  // ** State
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

  return data !== null ? (
    <Card>
      <CardMedia
        component="img"
        alt="profile-header"
        image={data.coverImg}
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
        <ProfilePicture src={data.profileImg} alt="profile-picture" />
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
              {userDetail?.jobseekerDetails.designation && (
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
                      {userDetail?.jobseekerDetails.designation}
                    </Typography>
                  </Box>
                </>
              )}
              {userDetail?.jobseekerDetails.current_location && (
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
                      {userDetail?.jobseekerDetails.current_location}
                    </Typography>
                  </Box>
                </>
              )}

              <Box
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
              </Box>
            </Box>
          </Box>
          <Box>
            <Button
              variant="contained"
              sx={{ "& svg": { mr: 2 }, mr: 2 }}
              onClick={onHandleEdit}
            >
              <Icon icon="tabler:pencil" fontSize="1.125rem" />
              Edit
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  ) : null;
};

export default UserProfileHeader;
