// import * as yup from "yup";

// export const validationSchema = yup.object({
//   jobTitle: yup
//     .string("Job Title is required")
//     .trim()
//     .required("Job Title is required")
//     .min(10, "Minimum 10 character required"),
//   companyName: yup
//     .string("Company Name is required")
//     .trim()
//     .required("Company Name is required"),
//   email: yup
//     .string("Email is Required")
//     .email("Enter the valid email")
//     .trim()
//     .required("Email is Required"),
//   jobCategory: yup
//     .string("Job Category is required")
//     .required("Job Category is required"),
//   location: yup
//     .string("Job Location is required")
//     .required("Job Location is required"),
//   jobSubCategory: yup
//     .string("Job Sub Category is required")
//     .required("Job Sub Category is required"),
//   noticePeriod: yup
//     .string("Notice Period is required")
//     .required("Notice Period is required"),
//   jobType: yup.string("Job Type is required").required("Job Type is required"),
//   skills: yup
//     .array()
//     .of(
//       yup.object().shape({
//         id: yup.string(),
//         jobCategory: yup.string(),
//       })
//     )
//     .min(1, "Minimum 1 skill is required")
//     .max(10, "Maximum 10 skills is allowed"),
// });
