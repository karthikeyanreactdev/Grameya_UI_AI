// ** Next Imports
import Head from "next/head";
import { Router } from "next/router";

// ** Loader Import
import NProgress from "nprogress";

// ** Emotion Imports
import { CacheProvider } from "@emotion/react";

// ** Config Imports

import { defaultACLObj } from "src/configs/acl";
import themeConfig from "src/configs/themeConfig";

// ** Fake-DB Import
import "src/@fake-db";

// ** Third Party Import
import { Toaster } from "react-hot-toast";

// ** Component Imports
import UserLayout from "src/layouts/UserLayout";
import AclGuard from "src/@core/components/auth/AclGuard";
import ThemeComponent from "src/@core/theme/ThemeComponent";
import AuthGuard from "src/@core/components/auth/AuthGuard";
import GuestGuard from "src/@core/components/auth/GuestGuard";

// ** Spinner Import
import Spinner from "src/@core/components/spinner";

// ** Contexts
import { AuthProvider } from "src/context/AuthContext";
import {
  SettingsConsumer,
  SettingsProvider,
} from "src/@core/context/settingsContext";

// ** Styled Components
import ReactHotToast from "src/@core/styles/libs/react-hot-toast";

// ** Utils Imports
import { createEmotionCache } from "src/@core/utils/create-emotion-cache";

// ** Prismjs Styles
import "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";

// ** React Perfect Scrollbar Style
import "react-perfect-scrollbar/dist/css/styles.css";
import "src/iconify-bundle/icons-bundle-react";

// ** Global css styles
import "../../styles/globals.css";
import { Provider } from "react-redux";
import { store } from "src/store";
import { SnackbarProvider } from "notistack";

const clientSideEmotionCache = createEmotionCache();

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on("routeChangeStart", () => {
    NProgress.start();
  });
  Router.events.on("routeChangeError", () => {
    NProgress.done();
  });
  Router.events.on("routeChangeComplete", () => {
    NProgress.done();
  });
}

const Guard = ({ children, authGuard, guestGuard }) => {
  if (guestGuard) {
    return <GuestGuard fallback={<Spinner />}>{children}</GuestGuard>;
  } else if (!guestGuard && !authGuard) {
    return <>{children}</>;
  } else {
    return <AuthGuard fallback={<Spinner />}>{children}</AuthGuard>;
  }
};

// ** Configure JSS & ClassName
const App = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  // Variables
  const contentHeightFixed = Component.contentHeightFixed ?? false;

  const getLayout =
    Component.getLayout ??
    ((page) => (
      <UserLayout contentHeightFixed={contentHeightFixed}>{page}</UserLayout>
    ));
  const setConfig = Component.setConfig ?? undefined;
  const authGuard = Component.authGuard ?? true;
  const guestGuard = Component.guestGuard ?? false;
  const aclAbilities = Component.acl ?? defaultACLObj;

  return (
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
        <Head>
          <title>{`${themeConfig.templateName} - AI Powered Job Portal`}</title>
          <meta
            name="description"
            content={`${themeConfig.templateName} – AI Powered Job Portal`}
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link
            href="https://fonts.googleapis.com/css2?family=Poiret+One&display=swap"
            rel="stylesheet"
          />
          <link
            rel="stylesheet"
            href="@sweetalert2/theme-material-ui/material-ui.css"
          />

          <script src="sweetalert2/dist/sweetalert2.min.js"></script>
          <meta
            name="keywords"
            content="AI, Job Portal, jobseeker, recruiter, skills, grameya, next innovation asia, hrtalky"
          />
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <SnackbarProvider
          maxSnack={6}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <AuthProvider>
            <SettingsProvider
              {...(setConfig ? { pageSettings: setConfig() } : {})}
            >
              <SettingsConsumer>
                {({ settings }) => {
                  return (
                    <ThemeComponent settings={settings}>
                      <Guard authGuard={authGuard} guestGuard={guestGuard}>
                        <AclGuard
                          aclAbilities={aclAbilities}
                          guestGuard={guestGuard}
                          authGuard={authGuard}
                        >
                          {getLayout(<Component {...pageProps} />)}
                        </AclGuard>
                      </Guard>
                      <ReactHotToast>
                        <Toaster
                          position={settings.toastPosition}
                          toastOptions={{ className: "react-hot-toast" }}
                        />
                      </ReactHotToast>
                    </ThemeComponent>
                  );
                }}
              </SettingsConsumer>
            </SettingsProvider>
          </AuthProvider>
        </SnackbarProvider>
      </CacheProvider>
    </Provider>
  );
};

export default App;
