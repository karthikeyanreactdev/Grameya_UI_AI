// ** React Imports
import { useState } from "react";

// ** Next Import
import Link from "next/link";

// ** MUI Components
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

// ** Layout Import
import BlankLayout from "src/@core/layouts/BlankLayout";

// ** Hooks
import { useSettings } from "src/@core/hooks/useSettings";

// ** Demo Imports
import FooterIllustrationsV2 from "src/views/pages/auth/FooterIllustrationsV2";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import { validateEmail, validatePassword } from "src/utils/commonUtils";
import { useDispatch } from "react-redux";
import { authRegister, changePassword } from "src/store/apps/auth";
import useNotification from "src/hooks/useNotification";
import { useRouter } from "next/router";
import { LoadingButton } from "@mui/lab";

// ** Styled Components
const RegisterIllustration = styled("img")(({ theme }) => ({
  zIndex: 2,
  maxHeight: 600,
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
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(1.75),
  "& .MuiFormControlLabel-label": {
    color: theme.palette.text.secondary,
  },
}));

const Register = () => {
  // ** States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [formValue, setFormValue] = useState({
    password: "",
    confirm_password: "",
  });
  const [termsCheck, setTermsCheck] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sendNotification] = useNotification();
  const router = useRouter();
  const token = router.asPath.split("=")[1];

  // ** Hooks
  const theme = useTheme();
  const { settings } = useSettings();
  const hidden = useMediaQuery(theme.breakpoints.down("md"));

  // ** Vars
  const { skin } = settings;
  const imageSource =
    skin === "bordered"
      ? "auth-v2-register-illustration-bordered"
      : "auth-v2-register-illustration";

  const validatePassword = (password) => {
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    if (passwordPattern.test(password)) {
      console.log("Password is valid");
      return false;
    } else {
      console.log("Password is invalid");
      return true;
    }
  };

  const handleInputChange = (e) => {
    const newFormValue = { ...formValue };
    newFormValue[e.target.name] = e.target.value;
    setFormValue(newFormValue);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const handleFormSubmit = async () => {
    setSubmitted(true);
    if (!formValue.confirm_password || !formValue.password) {
      return;
    }
    if (validatePassword(formValue.password)) {
      return;
    }

    const requestData = {
      new_password: formValue.password,
      token: token,
    };
    setIsLoading(true);

    const response = await dispatch(
      changePassword({
        formValue: requestData,
      })
    );
    console.log("response", response);
    if (response.payload?.data) {
      setIsLoading(false);
      sendNotification({
        message: response.payload?.data?.message,
        variant: "success",
      });
      router.push("/login");
    } else {
      setIsLoading(false);
      sendNotification({
        message: response.payload?.message,
        variant: "error",
      });
    }
  };

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
          <RegisterIllustration
            alt="register-illustration"
            src={`/images/pages/${imageSource}-${theme.palette.mode}.png`}
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
            <img
              height={50}
              width={250}
              alt="add-role"
              src="/images/glogo.png"
            />
            <Box sx={{ my: 6 }}>
              <Typography variant="h3" sx={{ mb: 1.5 }}>
                Change Password
              </Typography>
              <Typography sx={{ color: "text.secondary" }}>
                Make your password your own
              </Typography>
            </Box>
            <form>
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

                {submitted &&
                  formValue.password &&
                  validatePassword(formValue.password) && (
                    <>
                      <FormHelperText error={true}>
                        Invalid Password. Password should be a minimum of 8
                        characters, containing at least one digit, one uppercase
                        letter, and one lowercase letter.
                      </FormHelperText>
                    </>
                  )}
              </FormControl>

              <FormControl sx={{ mt: 4 }} fullWidth variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">
                  Confirm Password
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  name="confirm_password"
                  onChange={handleInputChange}
                  type={showConfirmPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowConfirmPassword}
                        // onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Confirm Password"
                />
                {submitted && !formValue.confirm_password && (
                  <>
                    <FormHelperText error={true}>
                      Confirm Password is required
                    </FormHelperText>
                  </>
                )}

                {submitted &&
                  formValue.confirm_password &&
                  formValue.password !== formValue.confirm_password && (
                    <>
                      <FormHelperText error={true}>
                        Password does not match
                      </FormHelperText>
                    </>
                  )}
              </FormControl>

              <LoadingButton
                loading={isLoading}
                fullWidth
                onClick={handleFormSubmit}
                variant="contained"
                sx={{ my: 6 }}
              >
                Submit
              </LoadingButton>
              {/* <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <Typography sx={{ color: "text.secondary", mr: 2 }}>
                  Already have an account?
                </Typography>
                <Typography component={LinkStyled} href="/login">
                  Sign in instead
                </Typography>
              </Box> */}
              {/* <Divider
                sx={{
                  color: "text.disabled",
                  "& .MuiDivider-wrapper": { px: 6 },
                  fontSize: theme.typography.body2.fontSize,
                  my: (theme) => `${theme.spacing(6)} !important`,
                }}
              >
                or
              </Divider> */}
              {/* <Box
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
              </Box> */}
            </form>
          </Box>
        </Box>
      </RightWrapper>
    </Box>
  );
};
Register.getLayout = (page) => <BlankLayout>{page}</BlankLayout>;
Register.guestGuard = true;

export default Register;
