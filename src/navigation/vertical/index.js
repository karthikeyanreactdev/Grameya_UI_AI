const navigation = () => {
  return [
    {
      title: "Home",
      path: "/home",
      icon: "tabler:smart-home",
    },
    {
      title: "Second Page",
      path: "/second-page",
      icon: "tabler:mail",
    },
    {
      path: "/acl",
      action: "read",
      subject: "acl-page",
      title: "Access Control",
      icon: "tabler:shield",
    },
    // {
    //   path: '/acl2',
    //   action: 'read',
    //   subject: 'acl-page2',
    //   title: 'Access Control2',
    //   icon: 'tabler:shield'
    // },
    {
      sectionTitle: "Recruiter Menu",
    },
    {
      path: "/recruiter/dashboard",
      action: "read",
      subject: "dashboard",
      title: "Dashboard",
      icon: "tabler:layout-dashboard",
    },
    {
      path: "/recruiter/resume-search",
      action: "read",
      subject: "search",
      title: "Resume Search",
      icon: "tabler:list-search",
    },
    {
      path: "/recruiter/jobs",
      action: "read",
      subject: "jobs",
      title: "Create Job",
      icon: "tabler:notes",
    },

    {
      path: "/recruiter/profile",
      action: "read",
      subject: "profile",
      title: "My Profile",
      icon: "tabler:user-star",
    },
    {
      sectionTitle: "Job Seeker Menu",
    },
    {
      path: "/jobseeker/dashboard",
      action: "read",
      subject: "jsdashboard",
      title: "Dashboard",
      icon: "tabler:layout-dashboard",
    },
    {
      path: "/jobseeker/jobs",
      action: "read",
      subject: "jsajobs",
      title: "Applied Jobs",
      icon: "tabler:notes",
    },

    {
      path: "/jobseeker/profile",
      action: "read",
      subject: "jsprofile",
      title: "My Profile",
      icon: "tabler:user-star",
    },
  ];
};

export default navigation;
