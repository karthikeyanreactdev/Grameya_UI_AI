import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import BlankLayout from "src/@core/layouts/BlankLayout";

import AuthIllustrationV1Wrapper from "src/views/pages/auth/AuthIllustrationV1Wrapper";
import { useRouter } from "next/router";
import { Card, CardContent } from "@mui/material";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { verifyToken } from "src/store/apps/auth";

const VerifyEmail = () => {
  const router = useRouter();
  const token = router.asPath.split("=")[1];
  const dispatch = useDispatch();
  const [errorMsg, setErrorMsg] = useState();
  console.log(token);

  const verifyEmailApi = async () => {
    const formValue = { token: token };
    const response = await dispatch(
      verifyToken({
        formValue: formValue,
      })
    );
    console.log("response", response);
    if (response?.payload?.status !== 200) {
      setErrorMsg(response?.payload?.message);
    }
  };

  useEffect(() => {
    verifyEmailApi();
  }, []);

  const handleNavigate = () => {
    router.push("/login");
  };

  return (
    <Box className="content-center">
      <AuthIllustrationV1Wrapper>
        <Card>
          <CardContent
            sx={{ p: (theme) => `${theme.spacing(10.5, 8, 8)} !important` }}
          >
            <Box
              sx={{
                mb: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  // minHeight: 140,
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                }}
              >
                <img
                  height={60}
                  width={250}
                  alt="add-role"
                  src="/images/glogo.png"
                />
              </Box>
            </Box>
            <Box sx={{ mb: 6, textAlign: "center", display: "flex" }}>
              {errorMsg ? (
                <>
                  <Typography
                    sx={{
                      color: "text.secondary",
                      textAlign: "center",
                      display: "flex",
                    }}
                  >
                    {errorMsg}
                  </Typography>
                </>
              ) : (
                <>
                  <Typography variant="h4" sx={{ mb: 1.5 }}>
                    Email Verified ✉️
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>
                    We are pleased to inform you that your email address has
                    been successfully verified.
                  </Typography>
                </>
              )}
            </Box>
            <Button fullWidth variant="contained" onClick={handleNavigate}>
              Back to Login
            </Button>
            <Box
              sx={{
                mt: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* <Typography sx={{ color: "text.secondary" }}>
                Didn't get the mail?
              </Typography> */}
              {/* <Typography
                component={LinkStyled}
                href="/"
                onClick={(e) => e.preventDefault()}
                sx={{ ml: 1 }}
              >
                Resend
              </Typography> */}
            </Box>
          </CardContent>
        </Card>
      </AuthIllustrationV1Wrapper>
    </Box>
  );
};

VerifyEmail.getLayout = (page) => <BlankLayout>{page}</BlankLayout>;
VerifyEmail.guestGuard = true;

export default VerifyEmail;
