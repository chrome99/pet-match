import * as yup from "yup";
const validictonary = {
  name: (label: string, required: boolean = true) => {
    let result = yup.string().max(20, "Must be less than 20 characters");
    if (required) {
      result = result.required(`${label} is a required field.`);
    }
    return result;
  },
  phone: yup
    .string()
    .required("Phone number is a required field.")
    .matches(/^[0-9]+$/, "Must be only digits.")
    .min(7, " Must be more than 7 characters.")
    .max(20, "Must be less than 20 characters."),
  email: yup
    .string()
    .email("Invalid email.")
    .required("Email is a required field.")
    .max(50, "Must be less than 50 characters."),
  password: (required: boolean = true) => {
    let result = yup
      .string()
      .min(8, "Must be more than 8 characters.")
      .max(50, "Must be less than 50 characters.")
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
        "Must contain at least one digit, one lower case letter, and one upper case letter."
      );
    //on edit profile password is not required
    if (required) {
      result = result.required("Password is a required field.");
    }
    return result;
  },
  confirmPassword: (required: boolean = true) => {
    let result = yup
      .string()
      .min(8, "Must be more than 8 characters.")
      .max(50, "Must be less than 50 characters.")
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
        "Must contain at least one digit, one lower case letter, and one upper case letter."
      )
      .oneOf([yup.ref("password")], "Passwords must match");

    if (required) {
      result = result.required("Please Confirm Password.");
    } else {
      //even if confirmPassword is not required, it actually is required when there is any input in password
      //only if the user does not put input in password, then confirmPassword is not required
      //this is used in user profile for selective editing (can edit bio without editing password / confirm password)
      //if you don't believe me - check it out!
      result = result.when("password", {
        is: (pass: string) => pass, //when password is not empty
        then: (schema) => schema.required("Please Confirm Password."),
        otherwise: (schema) => schema,
      });
    }
    return result;
  },
  bio: yup.string().max(500, "Must be 500 characters or less"),
  title: yup
    .string()
    .required("Title is a required field.")
    .max(65, "Must be less than 65 characters"),
  message: yup
    .string()
    .required("Message is a required field.")
    .max(500, "Must be less than 500 characters"),
  select: (label: string, options: string[]) => {
    let errorMsg = "Must be ";
    for (let i = 0; i < options.length; i++) {
      errorMsg += options[i];
      //if not last
      if (i !== options.length - 1) {
        errorMsg += " or ";
      } else {
        errorMsg += ".";
      }
    }
    return yup
      .string()
      .oneOf(options, errorMsg)
      .required(`${label} is a required field.`);
  },
  pet: {
    height: (required: boolean = true) => {
      let result = yup
        .number()
        .min(10, "Must be more than 10")
        .max(350, "Must be less than 350");
      if (required) {
        result = result.required("Height is a required field.");
      }
      return result;
    },
    weight: (required: boolean = true) => {
      let result = yup
        .number()
        .min(10, "Must be more than 10")
        .max(350, "Must be less than 350");
      if (required) {
        result = result.required("Weight is a required field.");
      }
      return result;
    },
  },
};
export default validictonary;
