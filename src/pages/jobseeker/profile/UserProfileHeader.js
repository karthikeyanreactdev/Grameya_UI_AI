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
import ImageUpload from "src/pages/recruiter/profile/ImageUpload";
import { deleteFile, uploadFile } from "src/api-services/recruiter/profile";
import { getUserData } from "src/store/apps/auth";
import { useDispatch } from "react-redux";
import { LoadingButton } from "@mui/lab";
import { IconButton } from "@mui/material";
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
  // const [sendNotification] = useNotification();
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
  const dispatch = useDispatch();
  const [sendNotification] = useNotification();
  const filer = useRef();
  const [bannerImage, setBannerImage] = useState("");
  const [logo, setLogo] = useState("");
  const [openImageEdit, setImageEdit] = useState(false);

  const [coverLoading, setCoverLoading] = useState(false);
  const [logoLoading, setLogoLoading] = useState(false);
  const [isPreview, setPreviewMode] = useState(true);
  const [isLogoTemp, setLogoTemp] = useState(false);
  const [isCoverTemp, setCoverTemp] = useState(false);

  const [cropImage, setCropImage] = useState();
  const [cropType, setCropType] = useState("logo");
  const [cropAspectRatio, setCropAspectRatio] = useState(1 / 1);
  const handleChangeDrawer = (value) => {
    onHandleDrawerStateChangeOpen(value);
  };
  const uploadImage = async (type, file, isDelete = false) => {
    setImageEdit(false);
    if (!isDelete) {
      const formData = new FormData();
      let randomName = (Math.random() + 1).toString(36).substring(7);
      formData.append("file", file, randomName + ".png");
      console.log(formData);
      var options = { content: formData };

      console.log(options);

      if (type == "logo") {
        setLogoLoading(true);
        formData.append("service_type", "profile_image");
        let res = await uploadFile(formData);
        res = res?.data;
        if (res.status == "success") {
          // setLogo(res?.data?.profile_image_url);
          setLogoTemp(false);
          sendNotification({
            message: res?.message,
            variant: "success",
          });
        } else {
          sendNotification({
            message: "Something went wrong",
            variant: "error",
          });
          // dispatch(
          //   snackbarsData({
          //     snackbarIsOpen: true,
          //     snackbarType: "warning",

          //     snackbarMessage: `${"Something went wrong"}`,
          //   })
          // );
        }
        dispatch(getUserData({}));
        setLogoLoading(false);
      } else if (type == "cover") {
        setCoverLoading(true);
        formData.append("service_type", "cover_image");
        console.log(formData);

        let res = await uploadFile(formData);
        res = res?.data;
        if (res.status == "success") {
          setCoverTemp(false);
          // setBannerImage(res?.data?.cover_image_url);
          // dispatch(
          //   snackbarsData({
          //     snackbarIsOpen: true,
          //     snackbarType: "success",
          //     snackbarMessage: res?.message,
          //   })
          // );
          sendNotification({
            message: res?.message,
            variant: "success",
          });
        } else {
          sendNotification({
            message: "Something went wrong",
            variant: "error",
          });
        }
        dispatch(getUserData({}));
        setCoverLoading(false);
      }
    } else {
      if (type == "logo") {
        setLogoLoading(true);
        let res = await deleteFile({
          service_type: "profile_image",
        });
        res = res?.data;
        if (res.status == "success") {
          setLogo(LogoPlaceHolder);
          setLogoTemp(true);

          sendNotification({
            message: res?.message,
            variant: "success",
          });
        } else {
          sendNotification({
            message: "Something went wrong",
            variant: "error",
          });
        }
        dispatch(getUserData({}));
        setLogoLoading(false);
      } else {
        setCoverLoading(true);
        let res = await deleteFile({
          service_type: "cover_image",
        });
        res = res?.data;
        if (res.status == "success") {
          setCoverTemp(true);
          // setBannerImage(BannerPlaceHolder);

          sendNotification({
            message: res?.message,
            variant: "success",
          });
        } else {
          sendNotification({
            message: "Something went wrong",
            variant: "error",
          });
        }
        dispatch(getUserData({}));
        setCoverLoading(false);
      }
    }
  };

  const editImage = (type) => {
    setPreviewMode(true);
    if (type == "cover") {
      setCropAspectRatio(3.29 / 1);

      let banner =
        bannerImage !== ""
          ? bannerImage
          : userDetail?.cover_image_url
          ? userDetail?.cover_image_url
          : "placeholder";
      if (isCoverTemp) {
        filer.current.click();
        setCropType(type);
      } else {
        if (banner == "placeholder") {
          filer.current.click();
          setCropType(type);
        } else {
          setCropImage(banner);
          setCropType(type);
          setImageEdit(true);
        }
      }
    } else {
      setCropAspectRatio(1 / 1);
      let logoImage =
        logo !== ""
          ? logo
          : userDetail?.profile_image_url
          ? userDetail?.profile_image_url
          : "placeholder";

      if (isLogoTemp) {
        filer.current.click();
        setCropType(type);
      } else {
        if (logoImage == "placeholder") {
          filer.current.click();
          setCropType(type);
        } else {
          setCropImage(logoImage);
          setCropType(type);
          setImageEdit(true);
        }
      }
    }
  };

  const onChange = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    if (files[0].size < 5000000) {
      const reader = new FileReader();
      reader.onload = () => {
        setCropImage(reader.result);
        setPreviewMode(false);
        setImageEdit(true);
        e.target.value = null;
      };
      reader.readAsDataURL(files[0]);
    } else {
      dispatch(
        snackbarsData({
          snackbarIsOpen: true,
          snackbarType: "warning",
          snackbarMessage: `${"File size should be below 5MB."}`,
        })
      );
    }
  };
  const renderRightSectionBtn = () => {
    switch (activeTab) {
      case "info":
        return (
          <>
            <Button
              variant={isEditMode ? "contained" : "outlined"}
              color={isEditMode ? "primary" : "error"}
              sx={{ "& svg": { mr: 2 }, mr: 2 }}
              onClick={onHandleEdit}
            >
              <Icon
                icon={isEditMode ? "tabler:pencil" : "material-symbols:close"}
                fontSize="1.125rem"
              />
              {isEditMode ? "Edit" : "Cancel"}
            </Button>
          </>
        );
      case "education":
        return (
          <>
            <Button
              variant="contained"
              color="primary"
              sx={{ "& svg": { mr: 2 }, mr: 2 }}
              onClick={() => handleChangeDrawer("isAddNewEducation")}
            >
              Add Education
            </Button>
          </>
        );
      case "work":
        return (
          <>
            <Button
              variant="contained"
              color="primary"
              sx={{ "& svg": { mr: 2 }, mr: 2 }}
              onClick={() => handleChangeDrawer("isAddNewExperiance")}
            >
              Add Experiance
            </Button>
          </>
        );
      case "resume":
        return (
          <>
            <Button
              variant="contained"
              color="primary"
              sx={{ "& svg": { mr: 2 }, mr: 2 }}
              onClick={handleClick}
            >
              Upload Resume
            </Button>
          </>
        );

      case "certification":
        return (
          <>
            <Button
              variant="contained"
              color="primary"
              sx={{ "& svg": { mr: 2 }, mr: 2 }}
              onClick={() => handleChangeDrawer("isAddCertification")}
            >
              Add Certification
            </Button>
          </>
        );
      default:
        return <></>;
    }
  };

  return data !== null ? (
    <Card>
      <input
        style={{ display: "none" }}
        id="raised-button-file"
        onChange={onChange}
        ref={filer}
        type="file"
        accept=".jpg,.png,.jpeg,.webpp"
      />
      <ImageUpload
        isOpen={openImageEdit}
        handleUpload={uploadImage}
        type={cropType}
        isPreview={isPreview}
        title={cropType == "logo" ? "Change Logo" : "Change Cover Photo"}
        aspectRatio={cropAspectRatio}
        selectedImage={cropImage}
        handleClose={(e, reason) => {
          if (reason && reason == "backdropClick") {
            return;
          }
          setImageEdit(false);
        }}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          position: "relative",
          top: 10,
          right: 10,
        }}
      >
        <LoadingButton
          onClick={() => editImage("cover")}
          loading={coverLoading}
          disabled={coverLoading}
          // title="Change Cover"
          sx={{ color: "black", opacity: 0.8 }}
        >
          {" "}
          <Icon Icon icon="twemoji:camera" fontSize={22} />
        </LoadingButton>
      </Box>
      <CardMedia
        component="img"
        alt="profile-header"
        image={userDetail?.cover_image_url || data.coverImg}
        sx={{
          height: { xs: 150, md: 250 },
          mt: -10,
        }}
        // onClick={() => editImage("cover")}
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
          // onClick={() => editImage("logo")}
        />
        <LoadingButton
          color="primary"
          loading={logoLoading}
          disabled={logoLoading}
          aria-label="add an alarm"
          onClick={() => editImage("logo")}
          sx={{
            position: "relative",
            right: "24px",
            top: { md: "20px", sm: "6px", lg: "20px" },
          }}
        >
          <Icon icon="twemoji:camera" fontSize={22} />
        </LoadingButton>
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
            {/* <Button
              variant={isEditMode ? "contained" : "outlined"}
              color={isEditMode ? "primary" : "error"}
              sx={{ "& svg": { mr: 2 }, mr: 2 }}
              onClick={onHandleEdit}
            >
              <Icon
                icon={isEditMode ? "tabler:pencil" : "material-symbols:close"}
                fontSize="1.125rem"
              />
              {isEditMode ? "Edit" : "Cancel"}
            </Button> */}
            {renderRightSectionBtn()}
          </Box>
        </Box>
      </CardContent>
    </Card>
  ) : null;
};

export default UserProfileHeader;
