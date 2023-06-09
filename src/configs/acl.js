import { AbilityBuilder, Ability } from "@casl/ability";

export const AppAbility = Ability;

/**
 * Please define your own Ability rules according to your app requirements.
 * We have just shown Admin and Client rules for demo purpose where
 * admin can manage everything and client can just visit ACL page
 */
const defineRulesFor = (role, subject) => {
  const { can, rules } = new AbilityBuilder(AppAbility);
  if (role === "admin") {
    can("manage", "all");
  } else if (role === "client") {
    can(["read"], "acl-page");
  } else if (role === "recruiter") {
    can("manage", "dashboard");
    can("read", "profile");
    can("read", "jobs");
    can("read", "search");
    can("read", "candidates");
    can("read", "appliedCandidates");
    can("read", "rcprofile");
    can("read", "jobPreview");
  } else if (role === "jobseeker") {
    can("manage", "jsdashboard");
    can("read", "jsprofile");
    can("read", "jsSavedJob");
    can("read", "jssearch");
    can("read", "jsJobDetail");
    can("read", "jsRecommendedJob");
  } else {
    can(["read", "create", "update", "delete"], subject);
  }

  return rules;
};

export const buildAbilityFor = (role, subject) => {
  return new AppAbility(defineRulesFor(role, subject), {
    // https://casl.js.org/v5/en/guide/subject-type-detection
    // @ts-ignore
    detectSubjectType: (object) => object.type,
  });
};

export const defaultACLObj = {
  action: "manage",
  subject: "all",
};

export default defineRulesFor;
