import {
  Avatar,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { removeCertificationSeeker } from "src/api-services/seeker/profile";
import useNotification from "src/hooks/useNotification";

const CertificationDetail = ({
  userDetail,
  handleDrawerStateChangeOpen,
  handleSelectCertification,
  getProfileDetail,
  onHandleChangeLoading,
}) => {
  const [sendNotification] = useNotification();

  const handleDeleteCertification = async (item) => {
    onHandleChangeLoading(true);
    const apiDate = {
      id: item?.id,
    };
    try {
      const response = await removeCertificationSeeker(apiDate);

      console.log("response", response);
      if (response.status === 200) {
        sendNotification({
          message: response?.data?.message,
          variant: "success",
        });
        getProfileDetail();
      }
    } catch (e) {
      console.log("e", e);
    } finally {
      onHandleChangeLoading(false);
    }
  };

  const formatDate = (dateValue) => {
    const inputDate = new Date(dateValue);
    const formattedDate = inputDate.toLocaleDateString("en-GB");
    return formattedDate;
  };

  const renderSecondoryText = (item) => {
    return (
      <>
        <Typography>
          {formatDate(item?.certification_valid_from)} -{" "}
          {formatDate(item?.certification_valid_to)}
        </Typography>
        <Typography>{item?.cartification_url}</Typography>
      </>
    );
  };

  return (
    <>
      <Grid item md={12} xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h4" component="h4">
              Certfication
            </Typography>

            {userDetail?.jobseekerDetails?.certifications.length > 0 ? (
              <>
                <List>
                  {userDetail?.jobseekerDetails?.certifications?.map((item) => {
                    return (
                      <>
                        <ListItem
                          secondaryAction={
                            <>
                              <IconButton
                                edge="end"
                                aria-label="delete"
                                sx={{ mr: 1 }}
                                onClick={() => handleDeleteCertification(item)}
                              >
                                <DeleteIcon />
                              </IconButton>

                              <IconButton
                                edge="end"
                                aria-label="delete"
                                onClick={() => {
                                  handleSelectCertification(item);
                                  handleDrawerStateChangeOpen(
                                    "isEditCertification"
                                  );
                                }}
                              >
                                <EditIcon />
                              </IconButton>
                            </>
                          }
                        >
                          <ListItemAvatar>
                            <Avatar>
                              <WorkspacePremiumIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={`${item?.certification_name} (${item?.cartification_completion_id})`}
                            secondary={renderSecondoryText(item)}
                          />
                        </ListItem>
                      </>
                    );
                  })}
                </List>
              </>
            ) : (
              <>
                <Typography sx={{ mt: 4 }}>No data found</Typography>
              </>
            )}
          </CardContent>

          <CardContent
            sx={{
              display: "flex",
              justifyContent: "center",
              // mx: 32,
              mt: 4,
            }}
          >
            <Grid container spacing={2} py={2}>
              <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                <Button
                  variant="contained"
                  onClick={() =>
                    handleDrawerStateChangeOpen("isAddCertification")
                  }
                >
                  Add New
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default CertificationDetail;
