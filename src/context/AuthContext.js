// ** React Imports
import { createContext, useEffect, useState } from "react";

// ** Next Import
import { useRouter } from "next/router";

// ** Axios
import axios from "axios";

// ** Config
import authConfig from "src/configs/auth";
import { getUserData, handleUserData } from "src/store/apps/auth";
import { userProfileUrl } from "src/utils/pathConst";
import { useDispatch, useSelector } from "react-redux";
import {
  getJobCategory,
  getJobType,
  getNoticePeriod,
  getSkills,
} from "src/store/apps/misc";
// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
};
const AuthContext = createContext(defaultProvider);

const AuthProvider = ({ children }) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user);
  const [loading, setLoading] = useState(defaultProvider.loading);
  const { userData } = useSelector((state) => state.auth);
  console.log("UserData", userData);
  const dispatch = useDispatch();
  // ** Hooks
  const router = useRouter();
  useEffect(() => {
    const initAuth = async () => {
      const returnUrl = router.pathname;

      const storedToken = window.localStorage.getItem(
        authConfig.storageTokenKeyName
      );
      console.log("reloaded");
      if (router.pathname === "/verify_email") {
        console.log("router ready 2", router);
        setLoading(false);

        const token = router.asPath.split("=")[1];
        console.log(token);

        router.replace({
          pathname: "/verify_email",
          query: { token: token },
        });
        return;
      }
      if (router.pathname === "/reset_password") {
        console.log("router ready 2", router);
        setLoading(false);

        const token = router.asPath.split("=")[1];
        console.log(token);

        router.replace({
          pathname: "/reset_password",
          query: { token: token },
        });
        return;
      }
      if (storedToken) {
        setLoading(true);
        await axios
          .get(userProfileUrl, {
            headers: {
              Authorization: "Bearer " + storedToken,
            },
          })
          .then(async (response) => {
            setLoading(false);
            setUser(response?.data?.data);
            dispatch(handleUserData(response?.data?.data));
            dispatch(getJobCategory({}));
            dispatch(getJobType({}));
            dispatch(getSkills({}));
            dispatch(getNoticePeriod({}));
            const redirectURL =
              returnUrl && returnUrl !== "/" ? returnUrl : "/";
            router.replace(redirectURL);
          })
          .catch(() => {
            localStorage.removeItem("userData");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("idToken");
            setUser(null);
            setLoading(false);
            if (
              authConfig.onTokenExpiration === "logout" &&
              !router.pathname.includes("login")
            ) {
              router.replace("/login");
            }
          });
      } else {
        localStorage.removeItem("userData");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("idToken");
        setUser(null);
        setLoading(false);
        router.replace("/login");
      }
    };
    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = (userData, errorCallback) => {
    const returnUrl = router.query.returnUrl;
    // let data = [];
    // if (userData?.roles.includes("JOB_SEEKER")) {
    //   data = userData;
    //   data.role = "jobseeker";
    // }
    // console.log(data);
    setUser(userData);
    // params.rememberMe
    //   ? window.localStorage.setItem(
    //       "userData",
    //       JSON.stringify(response.data.userData)
    //     )
    //   : null;
    const redirectURL = returnUrl && returnUrl !== "/" ? returnUrl : "/";
    router.replace(redirectURL);
    // axios
    //   .post(authConfig.loginEndpoint, params)
    // getUserData({})
    //   .then(async (response) => {
    //     params.rememberMe
    //       ? window.localStorage.setItem(
    //           authConfig.storageTokenKeyName,
    //           response.data.accessToken
    //         )
    //       : null;
    //     const returnUrl = router.query.returnUrl;
    //     setUser({ ...response.data.userData });
    //     params.rememberMe
    //       ? window.localStorage.setItem(
    //           "userData",
    //           JSON.stringify(response.data.userData)
    //         )
    //       : null;
    //     const redirectURL = returnUrl && returnUrl !== "/" ? returnUrl : "/";
    //     router.replace(redirectURL);
    //   })
    //   .catch((err) => {
    //     if (errorCallback) errorCallback(err);
    //   });
  };

  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem("userData");
    window.localStorage.removeItem(authConfig.storageTokenKeyName);
    localStorage.removeItem("userData");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("idToken");
    setUser(null);
    setLoading(false);

    window.location.reload();
    router.replace("/login");
  };

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
