import React, { useState, useContext } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { server } from "../../../App";
import "./ManagePetModal.css";
import { ManagePetModalProps } from "./ManagePetModal";
import { UserContext, UserContextType } from "../../../Contexts/UserContext";
import { object as schema } from "yup";
import { Formik } from "formik";
import { MyInput, MySubmit, MyAlert, MySelect } from "../../../Utils/MyForm";
import validictonary from "../../../Utils/Validictonary";

function PetForm({
  modal,
  setModal,
  pet,
  updatePet,
  addPet,
}: ManagePetModalProps) {
  const { user } = useContext(UserContext) as UserContextType;

  const [pictureInput, setPictureInput] = useState<File | undefined>(undefined);
  const [errorPictureInput, setErrorPictureInput] = useState(
    pet ? "" : "Picture is a required field."
  );

  const [alert, setAlert] = useState("");

  //Formik and Yup are terrible about updating the state of files or validating files,
  //So I created my own state and validation for the "picture" field.
  type formData = {
    type: string;
    name: string;
    height: string | number;
    weight: string | number;
    color: string;
    bio: string;
    dietery: string | string[];
    breed: string;
    adoptionStatus: string;
    hypoallergnic: string;
  };
  function submit(
    form: formData,
    setSubmitting: (isSubmitting: boolean) => void
  ) {
    if (!user) return;

    const newPet = new FormData();
    if (pictureInput) {
      newPet.append("pet_img", pictureInput);
    }

    if (pet) {
      if (form.type !== pet.type) newPet.append("type", form.type);
      if (form.name !== pet.name) newPet.append("name", form.name);
      if (form.color !== pet.color) newPet.append("color", form.color);
      //bio can be erased, so if empty string - set to "empty_bio"
      //(can't set to null because FormData does not accept this type)
      if (form.bio !== pet.bio)
        newPet.append("bio", form.bio === "" ? "empty_bio" : form.bio);
      if (form.breed !== pet.breed) newPet.append("breed", form.breed);
      if (form.height !== pet.height)
        newPet.append("height", form.height.toString());
      if (form.weight !== pet.weight)
        newPet.append("weight", form.weight.toString());
      if (form.adoptionStatus !== pet.adoptionStatus)
        newPet.append("adoptionStatus", form.adoptionStatus);
      if (form.dietery !== pet.dietery.toString())
        newPet.append("dietery", form.dietery.toString());
      if ((form.hypoallergnic === "Yes") !== pet.hypoallergnic)
        newPet.append("hypoallergnic", form.hypoallergnic);
    } else {
      newPet.append("type", form.type);
      newPet.append("name", form.name);
      newPet.append("adoptionStatus", form.adoptionStatus);
      newPet.append("color", form.color);
      newPet.append("bio", form.bio);
      newPet.append("breed", form.breed);
      newPet.append("height", form.height.toString());
      newPet.append("weight", form.weight.toString());
      newPet.append("dietery", form.dietery.toString());
      newPet.append(
        "hypoallergnic",
        form.hypoallergnic === "Yes" ? "true" : "false"
      );
    }
    //checking if formData is empty, if no changes made
    let newPetEmpty = true;
    for (const pair of newPet.entries()) {
      //if got here it means that newPet is not empty
      newPetEmpty = false;
      break;
    }
    if (newPetEmpty) {
      setAlert("No Changes Made");
      setSubmitting(false);
      return;
    }

    server({
      method: pet ? "put" : "post",
      url: pet ? "pet/" + pet.id : "pet",
      data: newPet,
      headers: {
        "Content-Type": "multipart/form-data",
        admin: user.id,
        "x-access-token": user.token,
      },
    })
      .then((response) => {
        //if edit mode, then update pet inside collection
        //if add-new-pet mode, then add new pet inside collection
        response.data.id = response.data._id;
        if (pet) {
          updatePet(response.data);
        } else {
          addPet(response.data);
        }
        setModal(false);
      })
      .catch((error) => {
        if (error.response) {
          setAlert(error.response.data);
        } else {
          setAlert(error.message);
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
  }

  return (
    <div id="managePetForm">
      <Formik
        validationSchema={schema().shape({
          type: validictonary.select("Type", ["Dog", "Cat"]),
          name: validictonary.name("Name"),
          height: validictonary.pet.height(),
          weight: validictonary.pet.weight(),
          color: validictonary.name("Color"),
          bio: validictonary.bio,
          dietery: validictonary.name("Dietery"),
          breed: validictonary.name("Breed"),
          adoptionStatus: validictonary.select("Adoption Status", [
            "Adopted",
            "Fostered",
            "Available",
          ]),
          hypoallergnic: validictonary.select("Hypoallergnic", ["Yes", "No"]),
        })}
        onSubmit={(e, { setSubmitting }) => {
          if (errorPictureInput.length > 0) {
            setSubmitting(false);
            return;
          }
          submit(e, setSubmitting);
        }}
        initialValues={{
          type: pet ? pet.type : "---",
          name: pet ? pet.name : "",
          height: pet ? pet.height : "",
          weight: pet ? pet.weight : "",
          picture: "",
          color: pet ? pet.color : "",
          bio: pet ? pet.bio : "",
          dietery: pet ? pet.dietery.toString() : "",
          breed: pet ? pet.breed : "",
          adoptionStatus: pet ? pet.adoptionStatus : "---",
          hypoallergnic: pet ? (pet.hypoallergnic ? "Yes" : "No") : "---",
        }}
      >
        {({ handleSubmit, handleBlur, isSubmitting, touched }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Row className="mb-3">
              <MyInput name="name" label="Name" />
              <MySelect
                name="type"
                label="Type"
                options={["---", "Dog", "Cat"]}
                xs={"2"}
              />
              <MySelect
                name="adoptionStatus"
                label="Adoption Status"
                options={["---", "Fostered", "Adopted", "Available"]}
                xs={"3"}
              />
            </Row>
            <Row className="mb-3">
              <MyInput name="breed" label="Breed" />
              <MyInput name="dietery" label="Dietery" />
              <MySelect
                name="hypoallergnic"
                label="Hypoallergnic"
                options={["---", "Yes", "No"]}
                xs={"3"}
              />
            </Row>
            <Row className="mb-3">
              <MyInput name="color" label="Color" />
              <MyInput name="height" label="Height" type="number" xs="2" />
              <MyInput name="weight" label="Weight" type="number" xs="2" />
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId={"formPicture"}>
                  <Form.Label>Picture</Form.Label>
                  <Form.Control
                    type="file"
                    name="picture"
                    onChange={(e) => {
                      const value = e.target as HTMLInputElement;
                      //validation testing =>
                      //if there is no file
                      if (!value.files) {
                        setErrorPictureInput("Picture is a required field.");
                        setPictureInput(undefined);
                        return;
                      }
                      //if file is not an image
                      if (!value.files[0].type.startsWith("image/")) {
                        setErrorPictureInput("File must be an image.");
                        setPictureInput(undefined);
                        return;
                      }
                      //if file is too large (larger than 200kb)
                      if (value.files[0].size > 204800) {
                        setErrorPictureInput(
                          "Image must be smaller than 200kb."
                        );
                        setPictureInput(undefined);
                        return;
                      }

                      //if passed all tests - set error to empty string, and update input
                      setErrorPictureInput("");
                      setPictureInput(value.files[0]);
                    }}
                    onBlur={handleBlur}
                    isValid={
                      touched.picture &&
                      pictureInput &&
                      errorPictureInput.length === 0
                    }
                    isInvalid={touched.picture && errorPictureInput.length > 0}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errorPictureInput}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <MyInput name="bio" label="Bio" as="textarea" />
            </Row>

            <MyAlert alert={alert} setAlert={setAlert} />
            <MySubmit
              text={pet ? "Edit Pet" : "Add Pet"}
              isSubmitting={isSubmitting}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default PetForm;
