import { useSnackbar } from "notistack";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import { Fragment, useEffect, useState } from "react";

const useNotification = () => {
  const [conf, setConf] = useState({});
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    const { variant } = conf;
    if (conf?.message) {
      enqueueSnackbar(conf.message, {
        variant: variant || "info",
        autoHideDuration: 3000,
        // action,
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
        action: (key) => (
          <Fragment>
            <IconButton
              sx={{ color: "white" }}
              aria-label="toaster-close"
              component="label"
              onClick={() => {
                closeSnackbar(key);
              }}
            >
              <CloseIcon />
            </IconButton>
          </Fragment>
        ),
      });
    }
  }, [conf]);
  return [setConf];
};

export default useNotification;
