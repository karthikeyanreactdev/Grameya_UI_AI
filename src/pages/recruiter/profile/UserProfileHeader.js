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
import { Fab, IconButton } from "@mui/material";
import {
  CameraAltOutlined,
  CameraAltSharp,
  PhotoCameraFront,
} from "@mui/icons-material";
import ImageUpload from "./ImageUpload";
import { deleteFile, uploadFile } from "src/api-services/recruiter/profile";
import { getUserData } from "src/store/apps/auth";
import { useDispatch } from "react-redux";
import useNotification from "src/hooks/useNotification";
import { LoadingButton } from "@mui/lab";

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
          : userData?.cover_image_url
          ? userData?.cover_image_url
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
          : userData?.profile_image_url
          ? userData?.profile_image_url
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
          title="Change Cover"
          sx={{ color: "black", opacity: 0.8 }}
        >
          {" "}
          <Icon Icon icon="twemoji:camera" fontSize={22} />
        </LoadingButton>
      </Box>
      <CardMedia
        component="img"
        alt="profile-header"
        image={userData?.cover_image_url || data.coverImg}
        sx={{
          height: { xs: 150, md: 250 },
          mt: -10,
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
          src={userData?.profile_image_url || data.profileImg}
          alt="profile-picture"
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
            </Box>
          </Box>
          <Button
            variant={!isEdit ? "contained" : "outlined"}
            color={!isEdit ? "primary" : "error"}
            sx={{ "& svg": { mr: 2 } }}
            onClick={handleEdit}
          >
            <Icon
              icon={isEdit ? "material-symbols:close" : "tabler:pencil"}
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
