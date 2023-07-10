// ** React Import
import { useEffect, useRef } from "react";

// ** Layout Components
import VerticalLayout from "./VerticalLayout";
import HorizontalLayout from "./HorizontalLayout";

const Layout = (props) => {
  // ** Props
  const { hidden, children, settings, saveSettings } = props;

  // ** Ref
  const isCollapsed = useRef(settings.navCollapsed);
  useEffect(() => {
    if (hidden) {
      if (true) {
        saveSettings({ ...settings, navCollapsed: true, layout: "vertical" });
        isCollapsed.current = true;
      }
    } else {
      if (true) {
        saveSettings({
          ...settings,
          navCollapsed: true,
          layout: settings.lastLayout,
        });
        isCollapsed.current = false;
      } else {
        if (settings.lastLayout !== settings.layout) {
          saveSettings({ ...settings, layout: settings.lastLayout });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hidden]);
  if (settings.layout === "horizontal") {
    return <HorizontalLayout {...props}>{children}</HorizontalLayout>;
  }

  return <VerticalLayout {...props}>{children}</VerticalLayout>;
};

export default Layout;
