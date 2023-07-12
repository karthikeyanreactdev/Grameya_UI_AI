// ** React Imports
import { useEffect } from "react";

// ** Next Import
import { useRouter } from "next/router";

// ** Hooks Import
import { useAuth } from "src/hooks/useAuth";

const AuthGuard = (props) => {
  const { children, fallback } = props;
  const auth = useAuth();
  const router = useRouter();
  useEffect(
    () => {
      console.log("router====>", router);
      if (!router.isReady) {
        return;
      }
      if (auth.user === null && !window.localStorage.getItem("userData")) {
        // if (router.pathname === "/verify_email") {
        //   console.log("router ready 1", router);
        //   const token = url.split("=")[1];
        //   console.log(token);

        //   router.replace({
        //     pathname: "/verify_email",
        //     query: { returnUrl: token },
        //   });
        // }
        if (router.asPath !== "/") {
          router.replace({
            pathname: "/login",
            query: { returnUrl: router.asPath },
          });
        } else {
          router.replace("/login");
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.route]
  );
  if (auth.loading || auth.user === null) {
    return fallback;
  }

  return <>{children}</>;
};

export default AuthGuard;
