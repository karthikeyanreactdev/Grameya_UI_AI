import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { removeCertificationSeeker } from "src/api-services/seeker/profile";
import useNotification from "src/hooks/useNotification";
import Icon from "src/@core/components/icon";
import { DeleteOutline } from "@mui/icons-material";

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
        <Grid>
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "space-between",
              // mx: 32,
              mt: 4,
            }}
          >
            <Typography variant="h4" component="h4">
              Certification
            </Typography>
            {/* <Button
              variant="contained"
              onClick={() => handleDrawerStateChangeOpen("isAddCertification")}
            >
              Add New
            </Button> */}
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
              <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
                {userDetail?.jobseekerDetails?.certifications.length > 0 && (
                  <Box>
                    <Grid
                      container
                      spacing={2}
                      columns={{ xs: 4, sm: 12, md: 12 }}
                    >
                      {userDetail?.jobseekerDetails?.certifications?.map(
                        (row, index) => {
                          return (
                            <Grid item xs={12} sm={6} md={6}>
                              <Card
                                raised={false}
                                sx={{
                                  mb: 2,
                                  border: "1px solid #ededed",
                                  "&:hover": {
                                    boxShadow:
                                      "rgba(0, 0, 0, 0.5) 0px 5px 15px 0px",
                                    transform: "translateY(-5px)",
                                  },
                                  height: "100%",
                                }}
                              >
                                <CardContent>
                                  <Typography
                                    sx={{
                                      fontSize: "20px",
                                      fontWeight: "500",
                                    }}
                                  >
                                    {row?.certification_name}
                                  </Typography>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      gap: "10px",
                                      mt: 4,
                                      alignItems: "center",
                                    }}
                                  >
                                    <Icon
                                      fontSize="1.25rem"
                                      icon="bx:certification"
                                      color="brown"
                                      style={{
                                        fontSize: "30px",
                                      }}
                                    />
                                    <Typography
                                      sx={{
                                        fontSize: "16px",
                                      }}
                                    >
                                      {row.cartification_completion_id}
                                    </Typography>
                                  </Box>

                                  <Box
                                    sx={{
                                      display: "flex",
                                      gap: "10px",
                                      alignItems: "center",
                                      mt: 2,
                                    }}
                                  >
                                    <Icon
                                      fontSize="1.25rem"
                                      icon="formkit:date"
                                      color="brown"
                                      style={{
                                        fontSize: "30px",
                                      }}
                                    />
                                    <Typography>
                                      {formatDate(
                                        row?.certification_valid_from
                                      )}{" "}
                                      -{" "}
                                      {formatDate(row?.certification_valid_to)}
                                    </Typography>
                                  </Box>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      gap: "10px",
                                      alignItems: "center",
                                      mt: 2,
                                    }}
                                  >
                                    <Icon
                                      fontSize="1.25rem"
                                      icon="mdi:web"
                                      style={{
                                        fontSize: "30px",
                                      }}
                                    />
                                    <Typography>
                                      {row?.cartification_url}
                                    </Typography>
                                  </Box>
                                </CardContent>

                                <CardActions sx={{ justifyContent: "end" }}>
                                  <Button
                                    size="small"
                                    variant="contained"
                                    color="error"
                                    onClick={() =>
                                      handleDeleteCertification(row)
                                    }
                                  >
                                    Delete
                                  </Button>
                                  <Button
                                    size="small"
                                    variant="contained"
                                    onClick={() => {
                                      handleSelectCertification(row);
                                      handleDrawerStateChangeOpen(
                                        "isEditCertification"
                                      );
                                    }}
                                  >
                                    Edit
                                  </Button>
                                </CardActions>
                              </Card>
                            </Grid>
                          );
                        }
                      )}
                    </Grid>
                  </Box>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Grid>
      </Grid>

      {/* <Grid item md={12} xs={12}>
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
      </Grid> */}
    </>
  );
};

export default CertificationDetail;
