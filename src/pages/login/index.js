// ** React Imports
import { useEffect, useState } from "react";

// ** Next Imports
import Link from "next/link";

// ** MUI Components
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled, useTheme } from "@mui/material/styles";
import InputAdornment from "@mui/material/InputAdornment";
import MuiFormControlLabel from "@mui/material/FormControlLabel";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// ** Custom Component Import
import CustomTextField from "src/@core/components/mui/text-field";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Third Party Imports
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// ** Hooks
import { useAuth } from "src/hooks/useAuth";
import useBgColor from "src/@core/hooks/useBgColor";
import { useSettings } from "src/@core/hooks/useSettings";

// ** Configs
import themeConfig from "src/configs/themeConfig";

// ** Layout Import
import BlankLayout from "src/@core/layouts/BlankLayout";

// ** Demo Imports
import FooterIllustrationsV2 from "src/views/pages/auth/FooterIllustrationsV2";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { authLogin, getUserData } from "src/store/apps/auth";
import { validateEmail } from "src/utils/commonUtils";
import useNotification from "src/hooks/useNotification";
import {
  getJobCategory,
  getJobType,
  getNoticePeriod,
  getSkills,
} from "src/store/apps/misc";
import { LoadingButton } from "@mui/lab";

// ** Styled Components
const LoginIllustration = styled("img")(({ theme }) => ({
  zIndex: 2,
  maxHeight: 680,
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(12),
  [theme.breakpoints.down(1540)]: {
    maxHeight: 550,
  },
  [theme.breakpoints.down("lg")]: {
    maxHeight: 500,
  },
}));

const RightWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  [theme.breakpoints.up("md")]: {
    maxWidth: 450,
  },
  [theme.breakpoints.up("lg")]: {
    maxWidth: 600,
  },
  [theme.breakpoints.up("xl")]: {
    maxWidth: 750,
  },
}));

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  color: `${theme.palette.primary.main} !important`,
}));

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  "& .MuiFormControlLabel-label": {
    color: theme.palette.text.secondary,
  },
}));

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(5).required(),
});

const defaultValues = {
  password: "password",
  email: "r@p.com",
};

const LoginPage = () => {
  const dispatch = useDispatch();
  const [rememberMe, setRememberMe] = useState(true);
  // const [showPassword, setShowPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formValue, setFormValue] = useState({
    username: "",
    password: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [sendNotification] = useNotification();

  // ** Hooks
  const auth = useAuth();
  const theme = useTheme();
  const bgColors = useBgColor();
  const { settings } = useSettings();
  const hidden = useMediaQuery(theme.breakpoints.down("md"));

  const { userData, isLoading } = useSelector((state) => state.auth);
  console.log("UserData", userData);
  // ** Vars
  const { skin } = settings;

  // const {
  //   control,
  //   setError,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm({
  //   defaultValues,
  //   mode: "onBlur",
  //   resolver: yupResolver(schema),
  // });

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleInputChange = (e) => {
    const newFormValue = { ...formValue };
    newFormValue[e.target.name] = e.target.value;
    setFormValue(newFormValue);
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    if (!formValue.username || !formValue.password) {
      return;
    }
    if (!validateEmail(formValue.username)) {
      return;
    }
    console.log("formValue", formValue);
    const response = await dispatch(
      authLogin({
        formValue: formValue,
      })
    );
    console.log("response", response);
    if (response.payload?.data) {
      localStorage.setItem("idToken", response.payload?.data?.data?.idToken);
      localStorage.setItem(
        "accessToken",
        response.payload?.data?.data?.accessToken
      );
      localStorage.setItem(
        "refreshToken",
        response.payload?.data?.data?.refreshToken
      );
      dispatch(getUserData({}));
      dispatch(getJobCategory({}));
      dispatch(getJobType({}));
      dispatch(getSkills({}));
      dispatch(getNoticePeriod({}));
      // sendNotification({
      //   message: response.payload?.data?.message,
      //   variant: "success",
      // });
    } else {
      sendNotification({
        message: response.payload?.message,
        variant: "error",
      });
    }
  };

  const onSubmit = (data) => {
    const { email, password } = data;
    auth.login({ email, password, rememberMe }, () => {
      setError("email", {
        type: "manual",
        message: "Email or Password is invalid",
      });
    });
  };
  const imageSource =
    skin === "bordered"
      ? "auth-v2-login-illustration-bordered"
      : "auth-v2-login-illustration";
  useEffect(() => {
    if (userData?._id) {
      auth.login(userData, () => {
        setError("email", {
          type: "manual",
          message: "Email or Password is invalid",
        });
      });
    }
  }, [userData]);
  return (
    <Box className="content-right" sx={{ backgroundColor: "background.paper" }}>
      {!hidden ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            position: "relative",
            alignItems: "center",
            borderRadius: "20px",
            justifyContent: "center",
            backgroundColor: "customColors.bodyBg",
            margin: (theme) => theme.spacing(8, 0, 8, 8),
          }}
        >
          {/* <LoginIllustration alt='login-illustration' src={`/images/pages/${imageSource}-${theme.palette.mode}.png`} /> */}
          <LoginIllustration
            alt="login-illustration"
            src={`/images/pages/login.png`}
          />
          <FooterIllustrationsV2 />
        </Box>
      ) : null}
      <RightWrapper>
        <Box
          sx={{
            p: [6, 12],
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 400 }}>
            <Box
              sx={{
                height: "100%",
                minHeight: 140,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
              }}
            >
              <img
                height={50}
                width={250}
                alt="add-role"
                src="/images/glogo.png"
              />
            </Box>
            <Box sx={{ my: 6 }}>
              <Typography variant="h3" sx={{ mb: 1.5 }}>
                {`Welcome to ${themeConfig.templateName}! 👋🏻`}
              </Typography>
              <Typography sx={{ color: "text.secondary" }}>
                Please sign-in to your account and start the adventure
              </Typography>
            </Box>
            {/* <Alert icon={false} sx={{ py: 3, mb: 6, ...bgColors.primaryLight, '& .MuiAlert-message': { p: 0 } }}>
              <Typography variant='body2' sx={{ mb: 2, color: 'primary.main' }}>
                Admin: <strong>admin@vuexy.com</strong> / Pass: <strong>admin</strong>
              </Typography>
              <Typography variant='body2' sx={{ color: 'primary.main' }}>
                Client: <strong>client@vuexy.com</strong> / Pass: <strong>client</strong>
              </Typography>
            </Alert> */}
            <form noValidate autoComplete="off">
              <Box sx={{ mb: 4 }}>
                <FormControl fullWidth>
                  <TextField
                    id="outlined-basic"
                    label="Email"
                    variant="outlined"
                    name="username"
                    onChange={handleInputChange}
                  />
                </FormControl>
                {submitted && !formValue.username && (
                  <>
                    <FormHelperText error={true}>
                      Email is required
                    </FormHelperText>
                  </>
                )}
                {submitted && !validateEmail(formValue.username) && (
                  <>
                    <FormHelperText error={true}>Invalid email</FormHelperText>
                  </>
                )}

                <FormControl sx={{ mt: 4 }} fullWidth variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-password">
                    Password
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    name="password"
                    onChange={handleInputChange}
                    type={showPassword ? "text" : "password"}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          // onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                  />
                  {submitted && !formValue.password && (
                    <>
                      <FormHelperText error={true}>
                        Password is required
                      </FormHelperText>
                    </>
                  )}
                </FormControl>

                {/* <Controller
                  name="email"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      autoFocus
                      label="Email"
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      placeholder="admin@vuexy.com"
                      error={Boolean(errors.email)}
                      {...(errors.email && {
                        helperText: errors.email.message,
                      })}
                    />
                  )}
                /> */}
              </Box>
              {/* <Box sx={{ mb: 1.5 }}>
                <Controller
                  name="password"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      onBlur={onBlur}
                      label="Password"
                      onChange={onChange}
                      id="auth-login-v2-password"
                      error={Boolean(errors.password)}
                      {...(errors.password && {
                        helperText: errors.password.message,
                      })}
                      type={showPassword ? "text" : "password"}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              edge="end"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              <Icon
                                fontSize="1.25rem"
                                icon={
                                  showPassword ? "tabler:eye" : "tabler:eye-off"
                                }
                              />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Box> */}
              <Box
                sx={{
                  mb: 1.75,
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <FormControlLabel
                  label="Remember Me"
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                  }
                />
                <Typography component={LinkStyled} href="/forgot-password">
                  Forgot Password?
                </Typography>
              </Box>
              <LoadingButton
                fullWidth
                loading={isLoading}
                variant="contained"
                sx={{ mb: 4 }}
                onClick={handleSubmit}
              >
                Login
              </LoadingButton>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <Typography sx={{ color: "text.secondary", mr: 2 }}>
                  New to our platform?
                </Typography>
                <Typography href="/register" component={LinkStyled}>
                  Register
                </Typography>
              </Box>
              <Divider
                sx={{
                  color: "text.disabled",
                  "& .MuiDivider-wrapper": { px: 6 },
                  fontSize: theme.typography.body2.fontSize,
                  my: (theme) => `${theme.spacing(6)} !important`,
                }}
              >
                or
              </Divider>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconButton
                  href="/"
                  component={Link}
                  sx={{ color: "#497ce2" }}
                  onClick={(e) => e.preventDefault()}
                >
                  <Icon icon="mdi:facebook" />
                </IconButton>
                <IconButton
                  href="/"
                  component={Link}
                  sx={{ color: "#1da1f2" }}
                  onClick={(e) => e.preventDefault()}
                >
                  <Icon icon="mdi:twitter" />
                </IconButton>
                <IconButton
                  href="/"
                  component={Link}
                  onClick={(e) => e.preventDefault()}
                  sx={{
                    color: (theme) =>
                      theme.palette.mode === "light" ? "#272727" : "grey.300",
                  }}
                >
                  <Icon icon="mdi:github" />
                </IconButton>
                <IconButton
                  href="/"
                  component={Link}
                  sx={{ color: "#db4437" }}
                  onClick={(e) => e.preventDefault()}
                >
                  <Icon icon="mdi:google" />
                </IconButton>
              </Box>
            </form>
          </Box>
        </Box>
      </RightWrapper>
    </Box>
  );
};
LoginPage.getLayout = (page) => <BlankLayout>{page}</BlankLayout>;
LoginPage.guestGuard = true;

export default LoginPage;
