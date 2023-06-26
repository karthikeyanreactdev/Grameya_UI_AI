import {
  Avatar,
  Box,
  Button,
  Card,
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
            <Button
              variant="contained"
              onClick={() => handleDrawerStateChangeOpen("isAddCertification")}
            >
              Add New
            </Button>
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
                                  border: "1px solid rgba(0, 0, 0, 0.5)",
                                  "&:hover": {
                                    boxShadow:
                                      "rgba(0, 0, 0, 0.5) 0px 5px 15px 0px",
                                    transform: "translateY(-5px)",
                                  },
                                  height: "100%",
                                }}
                              >
                                <CardContent sx={{ pb: 0 }}>
                                  <Grid
                                    container
                                    spacing={2}
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <Grid item xs={11} sm={11} md={11} lg={11}>
                                      <Typography
                                        sx={{ mb: 4 }}
                                        color="text.primary"
                                        variant="h5"
                                        gutterBottom
                                      >
                                        {row?.certification_name && (
                                          <>
                                            <Typography
                                              gutterBottom
                                              variant="h5"
                                              component="div"
                                              sx={{ fontWeight: 700 }}
                                            >
                                              {row.certification_name}
                                            </Typography>
                                          </>
                                        )}
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={1} sm={1} md={1} lg={1}>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          mr: 2,
                                          cursor: "pointer",
                                        }}
                                      >
                                        <Tooltip title="Delete" arrow>
                                          <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            sx={{ mr: 1 }}
                                            onClick={() =>
                                              handleDeleteCertification(row)
                                            }
                                          >
                                            <DeleteOutline
                                              sx={{ color: "red" }}
                                            />
                                          </IconButton>
                                        </Tooltip>
                                      </Box>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          // mt: 4,
                                          cursor: "pointer",
                                        }}
                                      >
                                        <Tooltip title="Edit" arrow>
                                          <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            onClick={() => {
                                              handleSelectCertification(row);
                                              handleDrawerStateChangeOpen(
                                                "isEditCertification"
                                              );
                                            }}
                                          >
                                            <EditIcon />
                                          </IconButton>
                                        </Tooltip>
                                      </Box>
                                    </Grid>
                                  </Grid>
                                  <Grid
                                    container
                                    spacing={2}
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                      {row.cartification_completion_id && (
                                        <>
                                          <Box
                                            sx={{
                                              display: "flex",
                                              "&:not(:last-of-type)": { mb: 3 },
                                              "& svg": {
                                                color: "text.secondary",
                                              },
                                            }}
                                          >
                                            <Box
                                              sx={{
                                                display: "flex",
                                                mr: 2,
                                              }}
                                            >
                                              <Icon
                                                fontSize="1.25rem"
                                                icon="bx:certification"
                                                color="brown"
                                              />
                                            </Box>

                                            <Box
                                              sx={{
                                                columnGap: 2,
                                                display: "flex",
                                                flexWrap: "wrap",
                                                alignItems: "center",
                                              }}
                                            >
                                              <Typography
                                                sx={{
                                                  color: "text.primary",
                                                }}
                                              >
                                                {
                                                  row.cartification_completion_id
                                                }
                                              </Typography>
                                            </Box>
                                          </Box>
                                        </>
                                      )}

                                      {(row?.certification_valid_from ||
                                        row?.certification_valid_to) && (
                                        <>
                                          <Box
                                            sx={{
                                              display: "flex",
                                              "&:not(:last-of-type)": { mb: 3 },
                                              "& svg": {
                                                color: "text.secondary",
                                              },
                                            }}
                                          >
                                            <Box
                                              sx={{
                                                display: "flex",
                                                mr: 2,
                                              }}
                                            >
                                              <Icon
                                                fontSize="1.25rem"
                                                icon="formkit:date"
                                                color="red"
                                              />
                                            </Box>

                                            <Box
                                              sx={{
                                                columnGap: 2,
                                                display: "flex",
                                                flexWrap: "wrap",
                                                alignItems: "center",
                                              }}
                                            >
                                              <Typography
                                                sx={{
                                                  color: "text.primary",
                                                }}
                                              >
                                                {formatDate(
                                                  row?.certification_valid_from
                                                )}{" "}
                                                -{" "}
                                                {formatDate(
                                                  row?.certification_valid_to
                                                )}
                                              </Typography>
                                            </Box>
                                          </Box>
                                        </>
                                      )}

                                      {row?.cartification_url && (
                                        <>
                                          <Box
                                            sx={{
                                              display: "flex",
                                              "&:not(:last-of-type)": { mb: 3 },
                                              "& svg": {
                                                color: "text.secondary",
                                              },
                                            }}
                                          >
                                            <Box
                                              sx={{
                                                display: "flex",
                                                mr: 2,
                                              }}
                                            >
                                              <Icon
                                                fontSize="1.25rem"
                                                icon="dashicons:admin-site-alt"
                                                color="brown"
                                              />
                                            </Box>

                                            <Box
                                              sx={{
                                                columnGap: 2,
                                                display: "flex",
                                                flexWrap: "wrap",
                                                alignItems: "center",
                                              }}
                                            >
                                              <Typography
                                                sx={{
                                                  color: "text.primary",
                                                }}
                                              >
                                                {row.cartification_url}
                                              </Typography>
                                            </Box>
                                          </Box>
                                        </>
                                      )}
                                    </Grid>
                                    {/* <Grid item xs={12} sm={4} md={3} lg={3}>
                                      {row.end_date && (
                                        <>
                                          <Box
                                            sx={{
                                              display: "flex",
                                              "&:not(:last-of-type)": { mb: 3 },
                                              "& svg": {
                                                color: "text.primary",
                                              },
                                            }}
                                          >
                                            <Box
                                              sx={{
                                                columnGap: 2,
                                                display: "flex",
                                                flexWrap: "wrap",
                                                alignItems: "center",
                                              }}
                                            >
                                              <Typography
                                                sx={{
                                                  color: "text.primary",
                                                }}
                                              >
                                                Relieving date:{" "}
                                                {formatDate(row.end_date)}
                                              </Typography>
                                            </Box>
                                          </Box>
                                        </>
                                      )}
                                    </Grid> */}
                                  </Grid>
                                </CardContent>
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
