import CloseIcon from "@mui/icons-material/Close";
import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import "cropperjs/dist/cropper.css";
import React, { useEffect, useState } from "react";
import Cropper from "react-cropper";
// import { useTranslation } from "react-i18next";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(0),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

const messageConetent = {
  logo: {
    deletemessage:
      "Are you sure? Having a Logo helps others recognize your organization.",
    title: "Delete Logo",
  },
  cover: {
    deletemessage:
      "Are you sure? Having a Cover Photo helps others recognize your organization.",
    title: "Delete Cover",
  },
};
function ImageUpload({
  isOpen,
  handleClose,
  aspectRatio,
  type,
  title,
  isPreview,
  selectedImage,
  handleUpload,
  showSnack,
}) {
  //   const { t } = useTranslation();
  const [image, setImage] = useState();
  const [cropData, setCropData] = useState("#");
  const [cropper, setCropper] = useState();
  const [openConfirm, setConfirm] = useState(false);
  const openConfirmBox = () => {
    setConfirm(true);
  };
  useEffect(() => {
    setImage(selectedImage);
  }, [selectedImage]);
  const handleAction = (isDelete) => {
    setConfirm(false);
    if (isDelete) {
      handleUpload(type, "", true);
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
        setImage(reader.result);
        //setPreviewMode(false);
        e.target.value = null;
      };
      reader.readAsDataURL(files[0]);
    } else {
      showSnack("warning", "File size should be below 5MB. ");
    }
  };

  const applyPhoto = () => {
    if (typeof cropper !== "undefined") {
      cropper.getCroppedCanvas().toBlob((blob) => {
        handleUpload(type, blob);
      });
    }
  };

  return (
    <BootstrapDialog
      fullWidth={true}
      maxWidth={"md"}
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={isOpen}
    >
      <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
        {title}
      </BootstrapDialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        <Box
          noValidate
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            padding: "0",
            margin: "0",
            m: "auto",
            p: 0,
          }}
        >
          <div style={{ width: "100%" }}>
            {isPreview && (
              <div className="preview_holder">
                <img
                  src={selectedImage}
                  alt="selectedImage"
                  className={`preview ${type}`}
                />
              </div>
            )}
            {!isPreview && (
              <div>
                <Cropper
                  style={{ height: 400, width: "100%" }}
                  zoomTo={0}
                  aspectRatio={aspectRatio}
                  preview=".img-preview"
                  src={image}
                  viewMode={1}
                  minCropBoxHeight={10}
                  minCropBoxWidth={10}
                  background={false}
                  responsive={true}
                  autoCropArea={1}
                  checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                  onInitialized={(instance) => {
                    setCropper(instance);
                  }}
                  guides={true}
                />
              </div>
            )}
          </div>
          <Dialog
            maxWidth="xs"
            open={openConfirm}
            aria-labelledby="responsive-dialog-title"
          >
            <DialogTitle id="responsive-dialog-title">
              {messageConetent[type].title}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {messageConetent[type].deletemessage}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleAction(false)}>{"Cancel"}</Button>
              <Button color="error" onClick={() => handleAction(true)}>
                {"Yes, Delete It"}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </DialogContent>
      <DialogActions>
        <Grid container gap={2} justifyContent="center">
          {!isPreview && (
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              display="flex"
              justifyContent="center"
            >
              <FormHelperText sx={{ fontSize: "1.4rem" }}>
                {"Use your mouse wheel/ trackpad/pinch to zoom"}
              </FormHelperText>
            </Grid>
          )}
          <Grid item>
            <Button
              sx={{ mx: 1 }}
              onClick={() => {
                openConfirmBox();
              }}
              variant="outlined"
              color="error"
            >
              {"Remove"}
            </Button>
          </Grid>
          <Grid item>
            <input
              style={{ display: "none" }}
              id="raised-button-file"
              onChange={onChange}
              type="file"
              accept=".jpg,.png,.jpeg,.webpp"
            />
            <label htmlFor="raised-button-file">
              <Button sx={{ mx: 1 }} variant="outlined" component="span">
                {"Change Photo"}
              </Button>
            </label>
          </Grid>
          {!isPreview && (
            <Grid item>
              <Button sx={{ mx: 1 }} variant="contained" onClick={applyPhoto}>
                {"Apply"}
              </Button>
            </Grid>
          )}
        </Grid>
      </DialogActions>
    </BootstrapDialog>
  );
}

export default ImageUpload;
