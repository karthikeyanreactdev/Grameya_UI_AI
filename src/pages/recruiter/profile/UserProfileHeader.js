// ** React Imports
import { useState, useEffect } from "react";

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
import { Fab, IconButton } from "@mui/material";
import {
  CameraAltOutlined,
  CameraAltSharp,
  PhotoCameraFront,
} from "@mui/icons-material";

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

const UserProfileHeader = ({ userData, handleEdit, isEdit }) => {
  // ** State
  console.log("dddaaaaa", userData);
  const [data, setData] = useState({});
  // setData()
  // useEffect(() => {
  //   axios.get('/pages/profile-header').then(response => {})
  // }, [])
  const designationIcon = data?.designationIcon || "tabler:briefcase";

  useEffect(() => {
    setData({
      location: userData?.recruiterDetails?.city,
      joiningDate: "May 2023",
      fullName: userData?.full_name,
      designation: userData?.recruiterDetails?.designation,
      profileImg: "/images/g.jpg",
      companyName: userData?.recruiterDetails?.company_name,
      designationIcon: "tabler:color-swatch",
      coverImg: "/images/pages/profile-banner.png",
    });
  }, [userData]);
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
        {/* <IconButton
          color="primary"
          aria-label="add an alarm"
          sx={{
            position: "relative",
            right: "24px",
            top: "20px",
            // color: "black",
            opacity: 0.8,
          }}
        >
          <PhotoCameraFront />
        </IconButton> */}
        {/* <Fab
          color="primary"
          sx={{
            position: "relative",
            right: "24px",
            top: "20px",
            height: "24px",
            width: "40px",
            // borderRadius: "24px",
            // color: "black",
            // background: "primary",
            // opacity: 0.8,
          }}
        >
          {" "}
          <Icon icon={"tabler:camera-heart"} fontSize="1.325rem" />
        </Fab> */}

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
              {data.fullName}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: ["center", "flex-start"],
              }}
            >
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
                  {data.designation}
                </Typography>
              </Box>
              <Box
                sx={{
                  mr: 4,
                  display: "flex",
                  alignItems: "center",
                  "& svg": { mr: 1.5, color: "text.secondary" },
                }}
              >
                <Icon fontSize="1.25rem" icon="tabler:building-skyscraper" />
                <Typography sx={{ color: "text.secondary" }}>
                  {data.companyName}
                </Typography>
              </Box>
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
          <Button
            variant="contained"
            sx={{ "& svg": { mr: 2 } }}
            onClick={handleEdit}
          >
            <Icon
              icon={isEdit ? "tabler:arrow-badge-left" : "tabler:pencil"}
              fontSize="1.125rem"
            />
            {isEdit ? "Cancel" : "Edit"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  ) : null;
};

export default UserProfileHeader;
