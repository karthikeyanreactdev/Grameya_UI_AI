// ** Next Import
import Link from "next/link";

// ** MUI Components
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled, useTheme } from "@mui/material/styles";

// ** Custom Component Import
import CustomTextField from "src/@core/components/mui/text-field";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Layout Import
import BlankLayout from "src/@core/layouts/BlankLayout";

// ** Demo Imports
import FooterIllustrationsV2 from "src/views/pages/auth/FooterIllustrationsV2";
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { validateEmail, validatePassword } from "src/utils/commonUtils";
import { authForgotPasswor } from "src/store/apps/auth";
import { useState } from "react";
import { useDispatch } from "react-redux";
import useNotification from "src/hooks/useNotification";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// Styled Components
const ForgotPasswordIllustration = styled("img")(({ theme }) => ({
  zIndex: 2,
  maxHeight: 650,
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
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
  justifyContent: "center",
  color: theme.palette.primary.main,
  fontSize: theme.typography.body1.fontSize,
}));

const ResetPassword = () => {
  // ** Hooks
  const dispatch = useDispatch();
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [formValue, setFormValue] = useState({
    password: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [sendNotification] = useNotification();

  // ** Vars
  const hidden = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleInputChange = (e) => {
    const newFormValue = { ...formValue };
    newFormValue[e.target.name] = e.target.value;
    setFormValue(newFormValue);
  };

  const handleSubmitForgotPassword = async () => {
    setSubmitted(true);
    if (!formValue.email) {
      return;
    }
    if (!validateEmail(formValue.email)) {
      return;
    }
    console.log("formValue", formValue);
    const response = await dispatch(
      authForgotPasswor({
        formValue: formValue,
      })
    );
    console.log("response", response);
    if (response.payload?.data) {
      sendNotification({
        message: response.payload?.data?.message,
        variant: "success",
      });
    } else {
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
          <ForgotPasswordIllustration
            alt="forgot-password-illustration"
            src={`/images/pages/auth-v2-forgot-password-illustration-${theme.palette.mode}.png`}
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
              <Typography
                sx={{
                  mb: 1.5,
                  fontWeight: 500,
                  fontSize: "1.625rem",
                  lineHeight: 1.385,
                }}
              >
                Reset Password? 🔒
              </Typography>
              {/* <Typography sx={{ color: "text.secondary" }}>
                Enter your email and we&prime;ll send you instructions to reset
                your password
              </Typography> */}
            </Box>
            <form
              noValidate
              autoComplete="off"
              onSubmit={(e) => e.preventDefault()}
            >
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
                  !validatePassword(formValue.password) && (
                    <>
                      <FormHelperText error={true}>
                        Password should have minimum 8 characters, maximum 16
                        characters, at least one uppercase letter, one lowercase
                        letter, one number and one special character
                      </FormHelperText>
                    </>
                  )}
              </FormControl>
              <Button
                fullWidth
                onClick={handleSubmitForgotPassword}
                variant="contained"
                sx={{ mb: 4, mt: 4 }}
              >
                Change Password
              </Button>
              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  "& svg": { mr: 1 },
                }}
              >
                <LinkStyled href="/login">
                  <Icon fontSize="1.25rem" icon="tabler:chevron-left" />
                  <span>Back to login</span>
                </LinkStyled>
              </Typography>
            </form>
          </Box>
        </Box>
      </RightWrapper>
    </Box>
  );
};
ResetPassword.getLayout = (page) => <BlankLayout>{page}</BlankLayout>;
ResetPassword.guestGuard = true;

export default ResetPassword;
