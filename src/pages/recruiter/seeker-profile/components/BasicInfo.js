import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  Input,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
// import { makeStyles } from "@mui/styles";
import * as yup from "yup";

import React, { useEffect, useState } from "react";
import { removeResume, updateProfile } from "src/api-services/seeker/profile";
import useNotification from "src/hooks/useNotification";
import { useFormik } from "formik";
import { LoadingButton } from "@mui/lab";
import { useSelector } from "react-redux";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  root: {
    "& #header-bar": {
      marginTop: "-32px",
    },
    "& #pdf-controls": {
      backgroundColor: "#187de4",
    },
    "& #pdf-pagination-info": {
      color: "#fff",
    },
  },
});
// const useStyles = makeStyles((theme) => ({
//   disabledSelect: {
//     "& .MuiOutlinedInput-notchedOutline": {
//       borderColor: "transparent", // Remove the border color
//     },
//     "& .MuiSelect-icon": {
//       color: theme.palette.text.primary, // Keep the select icon color unchanged
//     },
//   },
// }));
import Icon from "src/@core/components/icon";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import moment from "moment";
import axios from "axios";

const renderList = (arr) => {
  if (arr && arr.length) {
    return arr.map((item, index) => {
      return (
        <Box
          key={index}
          sx={{
            display: "flex",
            "&:not(:last-of-type)": { mb: 3 },
            "& svg": { color: "text.secondary" },
          }}
        >
          <Box sx={{ display: "flex", mr: 2 }}>
            <Icon fontSize="1.25rem" icon={item.icon} />
          </Box>

          <Box
            sx={{
              columnGap: 2,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontWeight: 500, color: "text.secondary" }}>
              {`${
                item.property.charAt(0).toUpperCase() + item.property.slice(1)
              }:`}
            </Typography>
            <Typography sx={{ color: "text.secondary" }}>
              {item.value.charAt(0).toUpperCase() + item.value.slice(1)}
            </Typography>
          </Box>
        </Box>
      );
    });
  } else {
    return null;
  }
};
function BasicInfo({
  userDetail,
  isEditMode,
  onHandleEditCloseChange,
  getProfileDetail,
  onHandleChangeLoading,
}) {
  const [sendNotification] = useNotification();
  // const { userData } = useSelector((state) => state.auth);
  const { skills } = useSelector((state) => state.misc);
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const { isLoadingFlag, appliedCandidateProfile } = useSelector(
    (state) => state.appliedSeeker
  );
  const getPdf = async () => {};
  useEffect(() => {
    axios({
      url: "/download", // download url
      method: "get",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        mode: "no-cors",
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
        a.remove();
        setTimeout(() => window.URL.revokeObjectURL(url), 100);
      });
  }, [appliedCandidateProfile]);
  return (
    <>
      <Grid container spacing={6} className={classes.root}>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <Card>
            <CardContent>
              <Box sx={{ mb: 6 }}>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 4,
                    color: "text.primary",
                    textTransform: "uppercase",
                    fontSize: "12px",
                  }}
                >
                  Basic Info
                </Typography>

                <Box
                  // key={index}
                  sx={{
                    display: "flex",
                    "&:not(:last-of-type)": { mb: 3 },
                    "& svg": { color: "text.secondary" },
                  }}
                >
                  <Box sx={{ display: "flex", mr: 2 }}>
                    <Icon fontSize="1.25rem" icon={"tabler:user"} />
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
                        fontWeight: 500,
                        color: "text.secondary",
                        fontSize: "14px",
                      }}
                    >
                      {/* {`${
                        item.property.charAt(0).toUpperCase() +
                        item.property.slice(1)
                      }:`} */}
                      Full Name :
                    </Typography>
                    <Typography
                      sx={{ color: "text.secondary", fontSize: "14px" }}
                    >
                      {/* {item.value.charAt(0).toUpperCase() + item.value.slice(1)}
                       */}
                      {appliedCandidateProfile?.full_name}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  // key={index}
                  sx={{
                    display: "flex",
                    "&:not(:last-of-type)": { mb: 3 },
                    "& svg": { color: "text.secondary" },
                  }}
                >
                  <Box sx={{ display: "flex", mr: 2 }}>
                    <Icon fontSize="1.25rem" icon={"ic:outline-work-history"} />
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
                        fontWeight: 500,
                        color: "text.secondary",
                        fontSize: "14px",
                      }}
                    >
                      {/* {`${
                        item.property.charAt(0).toUpperCase() +
                        item.property.slice(1)
                      }:`} */}
                      Designation :
                    </Typography>
                    <Typography
                      sx={{ color: "text.secondary", fontSize: "14px" }}
                    >
                      {/* {item.value.charAt(0).toUpperCase() + item.value.slice(1)}
                       */}
                      {appliedCandidateProfile?.designation}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  // key={index}
                  sx={{
                    display: "flex",
                    "&:not(:last-of-type)": { mb: 3 },
                    "& svg": { color: "text.secondary" },
                  }}
                >
                  <Box sx={{ display: "flex", mr: 2 }}>
                    <Icon fontSize="1.25rem" icon={"carbon:location"} />
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
                        fontWeight: 500,
                        color: "text.secondary",
                        fontSize: "14px",
                      }}
                    >
                      {/* {`${
                        item.property.charAt(0).toUpperCase() +
                        item.property.slice(1)
                      }:`} */}
                      Current Location :
                    </Typography>
                    <Typography
                      sx={{ color: "text.secondary", fontSize: "14px" }}
                    >
                      {/* {item.value.charAt(0).toUpperCase() + item.value.slice(1)}
                       */}
                      {appliedCandidateProfile?.current_location}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  // key={index}
                  sx={{
                    display: "flex",
                    "&:not(:last-of-type)": { mb: 3 },
                    "& svg": { color: "text.secondary" },
                  }}
                >
                  <Box sx={{ display: "flex", mr: 2 }}>
                    <Icon
                      fontSize="1.25rem"
                      icon={"mdi:location-check-outline"}
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
                        fontWeight: 500,
                        color: "text.secondary",
                        fontSize: "14px",
                      }}
                    >
                      {/* {`${
                        item.property.charAt(0).toUpperCase() +
                        item.property.slice(1)
                      }:`} */}
                      Preferred Location:
                    </Typography>
                    <Typography
                      sx={{ color: "text.secondary", fontSize: "14px" }}
                    >
                      {/* {item.value.charAt(0).toUpperCase() + item.value.slice(1)}
                       */}
                      {appliedCandidateProfile?.preferred_job_location}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  // key={index}
                  sx={{
                    display: "flex",
                    "&:not(:last-of-type)": { mb: 3 },
                    "& svg": { color: "text.secondary" },
                  }}
                >
                  <Box sx={{ display: "flex", mr: 2 }}>
                    <Icon
                      fontSize="1.25rem"
                      icon={"game-icons:take-my-money"}
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
                        fontWeight: 500,
                        color: "text.secondary",
                        fontSize: "14px",
                      }}
                    >
                      {/* {`${
                        item.property.charAt(0).toUpperCase() +
                        item.property.slice(1)
                      }:`} */}
                      Current Salary :
                    </Typography>
                    <Typography
                      sx={{ color: "text.secondary", fontSize: "14px" }}
                    >
                      {/* {item.value.charAt(0).toUpperCase() + item.value.slice(1)}
                       */}
                      {appliedCandidateProfile?.current_salary} LPA
                    </Typography>
                  </Box>
                </Box>
                <Box
                  // key={index}
                  sx={{
                    display: "flex",
                    "&:not(:last-of-type)": { mb: 3 },
                    "& svg": { color: "text.secondary" },
                  }}
                >
                  <Box sx={{ display: "flex", mr: 2 }}>
                    <Icon
                      fontSize="1.25rem"
                      icon={"solar:hand-money-outline"}
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
                        fontWeight: 500,
                        color: "text.secondary",
                        fontSize: "14px",
                      }}
                    >
                      {/* {`${
                        item.property.charAt(0).toUpperCase() +
                        item.property.slice(1)
                      }:`} */}
                      Expected Salary :
                    </Typography>
                    <Typography
                      sx={{ color: "text.secondary", fontSize: "14px" }}
                    >
                      {/* {item.value.charAt(0).toUpperCase() + item.value.slice(1)}
                       */}
                      {appliedCandidateProfile?.expected_salary} LPA
                    </Typography>
                  </Box>
                </Box>
                <Box
                  // key={index}
                  sx={{
                    display: "flex",
                    "&:not(:last-of-type)": { mb: 3 },
                    "& svg": { color: "text.secondary" },
                  }}
                >
                  <Box sx={{ display: "flex", mr: 2 }}>
                    <Icon fontSize="1.25rem" icon={"cil:chart-line"} />
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
                        fontWeight: 500,
                        color: "text.secondary",
                        fontSize: "14px",
                      }}
                    >
                      {/* {`${
                        item.property.charAt(0).toUpperCase() +
                        item.property.slice(1)
                      }:`} */}
                      Total Experiance :
                    </Typography>
                    <Typography
                      sx={{ color: "text.secondary", fontSize: "14px" }}
                    >
                      {/* {item.value.charAt(0).toUpperCase() + item.value.slice(1)}
                       */}
                      {appliedCandidateProfile?.total_years_of_experience} Years
                    </Typography>
                  </Box>
                </Box>
                <Box
                  // key={index}
                  sx={{
                    display: "flex",
                    "&:not(:last-of-type)": { mb: 3 },
                    "& svg": { color: "text.secondary" },
                  }}
                >
                  <Box sx={{ display: "flex", mr: 2 }}>
                    <Icon fontSize="1.25rem" icon={"quill:paper"} />
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
                        fontWeight: 500,
                        color: "text.secondary",
                        fontSize: "14px",
                      }}
                    >
                      {/* {`${
                        item.property.charAt(0).toUpperCase() +
                        item.property.slice(1)
                      }:`} */}
                      Notice Period :
                    </Typography>
                    <Typography
                      sx={{ color: "text.secondary", fontSize: "14px" }}
                    >
                      {/* {item.value.charAt(0).toUpperCase() + item.value.slice(1)}
                       */}
                      {appliedCandidateProfile?.notice_period}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ mb: 6 }}>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 4,
                    color: "text.primary",
                    fontSize: "12px",
                    textTransform: "uppercase",
                  }}
                >
                  Contacts
                </Typography>
                <Box
                  // key={index}
                  sx={{
                    display: "flex",
                    "&:not(:last-of-type)": { mb: 3 },
                    "& svg": { color: "text.secondary" },
                  }}
                >
                  <Box sx={{ display: "flex", mr: 2 }}>
                    <Icon
                      fontSize="1.25rem"
                      icon={"fluent-emoji-high-contrast:e-mail"}
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
                        fontWeight: 500,
                        color: "text.secondary",
                        fontSize: "14px",
                      }}
                    >
                      Email :
                    </Typography>
                    <Typography
                      sx={{ color: "text.secondary", fontSize: "14px" }}
                    >
                      {appliedCandidateProfile?.email}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  // key={index}
                  sx={{
                    display: "flex",
                    "&:not(:last-of-type)": { mb: 3 },
                    "& svg": { color: "text.secondary" },
                  }}
                >
                  <Box sx={{ display: "flex", mr: 2 }}>
                    <Icon fontSize="1.25rem" icon={"circum:mobile-3"} />
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
                        fontWeight: 500,
                        color: "text.secondary",
                        fontSize: "14px",
                      }}
                    >
                      Mobile :
                    </Typography>
                    <Typography
                      sx={{ color: "text.secondary", fontSize: "14px" }}
                    >
                      {appliedCandidateProfile?.phone}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  // key={index}
                  sx={{
                    display: "flex",
                    "&:not(:last-of-type)": { mb: 3 },
                    "& svg": { color: "text.secondary" },
                  }}
                >
                  <Box sx={{ display: "flex", mr: 2 }}>
                    <Icon fontSize="1.25rem" icon={"circum:mobile-2"} />
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
                        fontWeight: 500,
                        color: "text.secondary",
                        fontSize: "14px",
                      }}
                    >
                      Alternate Mobile :
                    </Typography>
                    <Typography
                      sx={{ color: "text.secondary", fontSize: "14px" }}
                    >
                      {appliedCandidateProfile?.alternate_phone}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <div>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 4,
                    color: "text.primary",
                    fontSize: "12px",
                    textTransform: "uppercase",
                  }}
                >
                  Key Skills
                </Typography>
                {/* {renderTeams(teams)} */}
                {appliedCandidateProfile?.skills?.map((option, index) => (
                  <Chip
                    variant="outlined"
                    // color="primary"
                    // color="black"
                    sx={{ mx: 1, my: 1, fontSize: "12px" }}
                    // sx={{ color: "#" }}
                    label={
                      option?.name === null || option?.name === undefined
                        ? option
                        : option?.name
                    }
                  />
                ))}
              </div>
            </CardContent>
          </Card>
          <Divider sx={{ color: "black" }} />
          <Card sx={{ my: 4 }}>
            <CardContent>
              <div>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 4,
                    color: "text.primary",
                    textTransform: "uppercase",
                    fontSize: "12px",
                  }}
                >
                  Work Experiance
                </Typography>
                {appliedCandidateProfile?.experiences && (
                  <Box>
                    <Grid
                      container
                      spacing={2}
                      columns={{ xs: 4, sm: 12, md: 12 }}
                    >
                      {appliedCandidateProfile?.experiences?.map(
                        (row, index) => {
                          return (
                            <Grid item xs={12} sm={12} md={12}>
                              <Paper
                                raised={false}
                                sx={{
                                  mb: 2,
                                  border: "1px solid #ededed",
                                  boxShadow: "none",
                                  // "&:hover": {
                                  //   boxShadow:
                                  //     "rgba(0, 0, 0, 0.5) 0px 5px 15px 0px",
                                  //   transform: "translateY(-5px)",
                                  // },
                                  height: "100%",
                                }}
                              >
                                <CardContent>
                                  {row?.is_current_company && (
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "end",
                                      }}
                                    >
                                      <Tooltip
                                        title="Current Company"
                                        // placement="left-start"
                                      >
                                        <IconButton size="small">
                                          <Icon
                                            sx={{
                                              cursor: "pointer",
                                            }}
                                            fontSize="1.25rem"
                                            icon={
                                              "fluent:person-info-16-regular"
                                            }
                                          />
                                        </IconButton>
                                      </Tooltip>
                                    </Box>
                                  )}
                                  <Typography
                                    sx={{
                                      fontWeight: 500,
                                      color: "text.secondary",
                                      fontSize: "14px",
                                      mb: 4,
                                    }}
                                  >
                                    {row?.company_name}
                                  </Typography>
                                  <Box
                                    // key={index}
                                    sx={{
                                      display: "flex",
                                      "&:not(:last-of-type)": { mb: 3 },
                                      "& svg": { color: "text.secondary" },
                                    }}
                                  >
                                    <Box sx={{ display: "flex", mr: 2 }}>
                                      <Icon
                                        fontSize="1.25rem"
                                        icon={"ic:outline-work-history"}
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
                                          fontWeight: 500,
                                          fontSize: "14px",
                                          color: "text.secondary",
                                        }}
                                      >
                                        Designation :
                                      </Typography>
                                      <Typography
                                        sx={{
                                          color: "text.secondary",
                                          fontSize: "14px",
                                        }}
                                      >
                                        {row?.designation}
                                      </Typography>
                                    </Box>
                                  </Box>
                                  <Box
                                    // key={index}
                                    sx={{
                                      display: "flex",
                                      "&:not(:last-of-type)": { mb: 3 },
                                      "& svg": { color: "text.secondary" },
                                    }}
                                  >
                                    <Box sx={{ display: "flex", mr: 2 }}>
                                      <Icon
                                        fontSize="1.25rem"
                                        icon={"game-icons:duration"}
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
                                          fontWeight: 500,
                                          fontSize: "14px",
                                          color: "text.secondary",
                                        }}
                                      >
                                        Duration :
                                      </Typography>
                                      <Typography
                                        sx={{
                                          color: "text.secondary",
                                          fontSize: "14px",
                                        }}
                                      >
                                        {moment(row.start_date).format(
                                          "DD/MM/YYYY"
                                        )}
                                        {" - "}
                                        {moment(row.end_date).format(
                                          "DD/MM/YYYY"
                                        )}
                                      </Typography>
                                    </Box>
                                  </Box>
                                  {row?.skills?.map((option, index) => (
                                    <Chip
                                      variant="outlined"
                                      // color="primary"
                                      // color="black"
                                      sx={{ mx: 1, my: 1, fontSize: "12px" }}
                                      // sx={{ color: "#" }}
                                      label={
                                        option?.name === null ||
                                        option?.name === undefined
                                          ? option
                                          : option?.name
                                      }
                                    />
                                  ))}
                                </CardContent>
                              </Paper>
                            </Grid>
                          );
                        }
                      )}
                    </Grid>
                  </Box>
                )}
              </div>
            </CardContent>
          </Card>
          <Card sx={{ my: 4 }}>
            <CardContent>
              <div>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 4,
                    color: "text.primary",
                    textTransform: "uppercase",
                    fontSize: "12px",
                  }}
                >
                  Education
                </Typography>
                {appliedCandidateProfile?.educations && (
                  <Box>
                    <Grid
                      container
                      spacing={2}
                      columns={{ xs: 4, sm: 12, md: 12 }}
                    >
                      {appliedCandidateProfile?.educations?.map(
                        (row, index) => {
                          return (
                            <Grid item xs={12} sm={12} md={12}>
                              <Paper
                                raised={false}
                                sx={{
                                  mb: 2,
                                  border: "1px solid #ededed",
                                  boxShadow: "none",
                                  // "&:hover": {
                                  //   boxShadow:
                                  //     "rgba(0, 0, 0, 0.5) 0px 5px 15px 0px",
                                  //   transform: "translateY(-5px)",
                                  // },
                                  height: "100%",
                                }}
                              >
                                <CardContent>
                                  <Typography
                                    sx={{
                                      fontWeight: 500,
                                      color: "text.secondary",
                                      fontSize: "14px",
                                      mb: 4,
                                    }}
                                  >
                                    {row?.course}
                                  </Typography>
                                  <Box
                                    // key={index}
                                    sx={{
                                      display: "flex",
                                      "&:not(:last-of-type)": { mb: 3 },
                                      "& svg": { color: "text.secondary" },
                                    }}
                                  >
                                    <Box sx={{ display: "flex", mr: 2 }}>
                                      <Icon
                                        fontSize="1.25rem"
                                        icon={"grommet-icons:scorecard"}
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
                                          fontWeight: 500,
                                          color: "text.secondary",
                                          fontSize: "14px",
                                        }}
                                      >
                                        Grade/Marks(%) :
                                      </Typography>
                                      <Typography
                                        sx={{ color: "text.secondary" }}
                                      >
                                        {row?.grade_or_marks}
                                      </Typography>
                                    </Box>
                                  </Box>
                                  <Box
                                    // key={index}
                                    sx={{
                                      display: "flex",
                                      "&:not(:last-of-type)": { mb: 3 },
                                      "& svg": { color: "text.secondary" },
                                    }}
                                  >
                                    <Box sx={{ display: "flex", mr: 2 }}>
                                      <Icon
                                        fontSize="1.25rem"
                                        icon={"game-icons:duration"}
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
                                          fontWeight: 500,
                                          color: "text.secondary",
                                          fontSize: "14px",
                                        }}
                                      >
                                        Duration :
                                      </Typography>
                                      <Typography
                                        sx={{
                                          color: "text.secondary",
                                          fontSize: "14px",
                                        }}
                                      >
                                        {moment(
                                          row?.course_duration_start
                                        ).format("DD/MM/YYYY")}
                                        {" - "}
                                        {moment(
                                          row?.course_duration_end
                                        ).format("DD/MM/YYYY")}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </CardContent>
                              </Paper>
                            </Grid>
                          );
                        }
                      )}
                    </Grid>
                  </Box>
                )}
              </div>
            </CardContent>
          </Card>

          <Card sx={{ my: 4 }}>
            <CardContent>
              <div>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 4,
                    color: "text.primary",
                    textTransform: "uppercase",
                    fontSize: "14px",
                  }}
                >
                  Certifications
                </Typography>
                {appliedCandidateProfile?.certifications && (
                  <Box>
                    <Grid
                      container
                      spacing={2}
                      columns={{ xs: 4, sm: 12, md: 12 }}
                    >
                      {appliedCandidateProfile?.certifications?.map(
                        (row, index) => {
                          return (
                            <Grid item xs={12} sm={12} md={12}>
                              <Paper
                                raised={false}
                                sx={{
                                  mb: 2,
                                  border: "1px solid #ededed",
                                  boxShadow: "none",
                                  // "&:hover": {
                                  //   boxShadow:
                                  //     "rgba(0, 0, 0, 0.5) 0px 5px 15px 0px",
                                  //   transform: "translateY(-5px)",
                                  // },
                                  height: "100%",
                                }}
                              >
                                <CardContent>
                                  <Typography
                                    sx={{
                                      fontWeight: 500,
                                      color: "text.secondary",
                                      fontSize: "14px",
                                      mb: 4,
                                    }}
                                  >
                                    {row?.certification_name}
                                  </Typography>

                                  <Box
                                    // key={index}
                                    sx={{
                                      display: "flex",
                                      "&:not(:last-of-type)": { mb: 3 },
                                      "& svg": { color: "text.secondary" },
                                    }}
                                  >
                                    <Box sx={{ display: "flex", mr: 2 }}>
                                      <Icon
                                        fontSize="1.25rem"
                                        icon={"game-icons:duration"}
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
                                          fontWeight: 500,
                                          fontSize: "14px",
                                          color: "text.secondary",
                                        }}
                                      >
                                        Validity :
                                      </Typography>
                                      <Typography
                                        sx={{
                                          color: "text.secondary",
                                          fontSize: "14px",
                                        }}
                                      >
                                        {moment(
                                          row?.certification_valid_from
                                        ).format("DD/MM/YYYY")}
                                        {" - "}
                                        {moment(
                                          row?.certification_valid_to
                                        ).format("DD/MM/YYYY")}
                                      </Typography>
                                    </Box>
                                  </Box>
                                  <Box
                                    // key={index}
                                    sx={{
                                      display: "flex",
                                      "&:not(:last-of-type)": { mb: 3 },
                                      "& svg": { color: "text.secondary" },
                                    }}
                                  >
                                    <Box sx={{ display: "flex", mr: 2 }}>
                                      <Icon
                                        fontSize="1.25rem"
                                        icon={"mdi:web"}
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
                                          fontWeight: 500,
                                          fontSize: "14px",
                                          color: "text.secondary",
                                        }}
                                      >
                                        URL :
                                      </Typography>
                                      <Typography
                                        sx={{
                                          color: "text.secondary",
                                          fontSize: "14px",
                                        }}
                                      >
                                        {row?.certification_url}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </CardContent>
                              </Paper>
                            </Grid>
                          );
                        }
                      )}
                    </Grid>
                  </Box>
                )}
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={8} lg={8}>
          <Card>
            <CardContent>
              <Typography
                variant="body2"
                sx={{
                  mb: 4,
                  color: "text.primary",
                  textTransform: "uppercase",
                }}
              >
                Resume
              </Typography>
              <Typography>
                {appliedCandidateProfile?.resume_headline}
              </Typography>
              {appliedCandidateProfile?.resume_url ? (
                <>
                  <DocViewer
                    pluginRenderers={DocViewerRenderers}
                    config={{
                      header: {
                        disableHeader: false,
                        disableFileName: true,
                        retainURLParams: false,
                      },
                    }}
                    documents={[{ uri: appliedCandidateProfile?.resume_url }]}
                    // documents={[{url: }]}
                  />
                </>
              ) : (
                <Typography sx={{ mt: 2 }}>Resume not found</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default BasicInfo;
