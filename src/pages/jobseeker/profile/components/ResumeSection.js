import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useRef } from "react";
import { removeResume, updateResume } from "src/api-services/seeker/profile";
import useNotification from "src/hooks/useNotification";

const ResumeSection = ({
  userDetail,
  onHandleChangeLoading,
  getProfileDetail,
}) => {
  const [sendNotification] = useNotification();
  const fileInputRef = useRef(null);

  const handleFileUpload = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    console.log("file", file);
    // Handle the file upload logic here
    console.log("Selected file:", file);
    if (file) {
      onHandleChangeLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      try {
        const response = await updateResume(formData);

        console.log("response", response);
        if (response.status === 200) {
          sendNotification({
            message: response?.data?.message,
            variant: "success",
          });
          await getProfileDetail();
        }
      } catch (e) {
        console.log("e", e);
        sendNotification({
          message: e,
          variant: "error",
        });
      } finally {
        onHandleChangeLoading(false);
      }
    }
  };

  const handleResumeDownload = (url) => {
    let link = document.createElement("a");
    link.download = "resume";
    link.target = "_blank";
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResumeRemove = async () => {
    onHandleChangeLoading(true);
    try {
      const response = await removeResume();

      console.log("response", response);
      if (response.status === 200) {
        sendNotification({
          message: response?.data?.message,
          variant: "success",
        });
        // onHandleEditCloseChange();
        await getProfileDetail();
      }
    } catch (e) {
      console.log("e", e);
    } finally {
      onHandleChangeLoading(false);
    }
  };

  return (
    <>
      <Grid item md={12} xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h4" component="h4">
              Resume
            </Typography>

            <Typography variant="h5" component="h5" sx={{ mt: 2 }}>
              Resume is the most important document recruiters look for.
              Recruiters generally do not look at profiles without resumes.
            </Typography>

            {userDetail?.jobseekerDetails?.resume_url && (
              <>
                <List>
                  <ListItem
                    secondaryAction={
                      <>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          sx={{ mr: 2 }}
                          onClick={() =>
                            handleResumeDownload(
                              userDetail?.jobseekerDetails?.resume_url
                            )
                          }
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={handleResumeRemove}
                        >
                          <ClearIcon />
                        </IconButton>
                      </>
                    }
                  >
                    <ListItemText
                      // onClick={() =>
                      //   handleResumeDownload(
                      //     userDetail?.jobseekerDetails
                      //       ?.resume_url
                      //   )
                      // }
                      sx={{ cursor: "pointer" }}
                      primary={userDetail?.jobseekerDetails?.resume_name}
                    />
                  </ListItem>
                </List>
              </>
            )}

            <Box
              sx={{
                border: "1px dashed gray",
                borderRadius: "6px",
                textAlign: "center",
                padding: "30px",
                mt: 8,
              }}
            >
              <input
                type="file"
                accept=".doc,.pdf"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <Button variant="contained" onClick={handleFileUpload}>
                Upload
              </Button>
              <Typography sx={{ mt: 2 }}>
                Supported Formats: doc, docx, rtf, pdf, upto 2 MB
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default ResumeSection;
