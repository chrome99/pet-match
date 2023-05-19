import React, { useState, useContext } from "react";
import { Form, Alert, Button, Row, Col } from "react-bootstrap";
import { server } from "../../../App";
import "./ManagePetModal.css";
import { ManagePetModalProps } from "./ManagePetModal";
import { UserContext, UserContextType } from "../../../Contexts/UserContext";

function PetForm({
  modal,
  setModal,
  pet,
  updatePet,
  addPet,
}: ManagePetModalProps) {
  const { user } = useContext(UserContext) as UserContextType;

  const [typeInput, setTypeInput] = useState<"Dog" | "Cat">(
    pet ? pet.type : "Dog"
  );
  const [nameInput, setNameInput] = useState(pet ? pet.name : "");
  const [pictureInput, setPictureInput] = useState<File | null>(null);
  const [heightInput, setHeightInput] = useState(pet ? pet.height : "");
  const [weightInput, setWeightInput] = useState(pet ? pet.weight : "");
  const [colorInput, setColorInput] = useState(pet ? pet.color : "");
  const [bioInput, setBioInput] = useState(pet ? pet.bio : "");
  const [dieteryInput, setDieteryInput] = useState(pet ? pet.dietery : "");
  const [breedInput, setBreedInput] = useState(pet ? pet.breed : "");
  const [adoptionStatusInput, setAdoptionStatusInput] = useState<
    "Adopted" | "Fostered" | "Available"
  >(pet ? pet.adoptionStatus : "Available");
  const [hypoallergnicInput, setHypoallergnicInput] = useState<"Yes" | "No">(
    pet && !pet.hypoallergnic ? "No" : "Yes"
  );

  const [alert, setAlert] = useState("");

  function submit() {
    if (!user) return;

    const newPet = new FormData();
    if (pictureInput) {
      newPet.append("pet_img", pictureInput);
    } else if (!pet) {
      //if add mode then image is required
      setAlert("Image Required");
      return;
    }

    if (pet) {
      if (typeInput !== pet.type) newPet.append("type", typeInput);
      if (nameInput !== pet.name) newPet.append("name", nameInput);
      if (colorInput !== pet.color) newPet.append("color", colorInput);
      if (bioInput !== pet.bio) newPet.append("bio", bioInput);
      if (breedInput !== pet.breed) newPet.append("breed", breedInput);
      if (heightInput !== pet.height)
        newPet.append("height", heightInput.toString());
      if (weightInput !== pet.weight)
        newPet.append("weight", weightInput.toString());
      if (adoptionStatusInput !== pet.adoptionStatus)
        newPet.append("adoptionStatus", adoptionStatusInput);
      if (dieteryInput !== pet.dietery)
        newPet.append("dietery", dieteryInput.toString());
      if ((hypoallergnicInput === "Yes") !== pet.hypoallergnic)
        newPet.append("hypoallergnic", hypoallergnicInput);
    } else {
      newPet.append("type", typeInput);
      newPet.append("name", nameInput);
      newPet.append("adoptionStatus", adoptionStatusInput);
      newPet.append("color", colorInput);
      newPet.append("bio", bioInput);
      newPet.append("breed", breedInput);
      newPet.append("height", heightInput.toString());
      newPet.append("weight", weightInput.toString());
      newPet.append("dietery", dieteryInput.toString());
      newPet.append(
        "hypoallergnic",
        hypoallergnicInput === "Yes" ? "true" : "false"
      );
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
      });
  }

  return (
    <div id="managePetForm">
      <Form>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="input"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col xs="2">
            <Form.Group controlId="formType">
              <Form.Label>Type</Form.Label>
              <Form.Select
                value={typeInput}
                onChange={(e) => setTypeInput(e.target.value as "Dog" | "Cat")}
              >
                <option>Dog</option>
                <option>Cat</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col xs="3">
            <Form.Group controlId="formAdoptionStatus">
              <Form.Label>Adoption Status</Form.Label>
              <Form.Select
                value={adoptionStatusInput}
                onChange={(e) =>
                  setAdoptionStatusInput(
                    e.target.value as "Fostered" | "Adopted" | "Available"
                  )
                }
              >
                <option>Available</option>
                <option>Fostered</option>
                <option>Adopted</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formBreed">
              <Form.Label>Breed</Form.Label>
              <Form.Control
                type="input"
                value={breedInput}
                onChange={(e) => setBreedInput(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formDietary">
              <Form.Label>Dietary</Form.Label>
              <Form.Control
                type="input"
                value={dieteryInput}
                onChange={(e) => setDieteryInput(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col xs="3">
            <Form.Group controlId="formHypoallergnic">
              <Form.Label>Hypoallergnic</Form.Label>
              <Form.Select
                value={hypoallergnicInput}
                onChange={(e) =>
                  setHypoallergnicInput(e.target.value as "Yes" | "No")
                }
              >
                <option>Yes</option>
                <option>No</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formColor">
              <Form.Label>Color</Form.Label>
              <Form.Control
                type="input"
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col xs="2">
            <Form.Group controlId="formHeight">
              <Form.Label>Height</Form.Label>
              <Form.Control
                type="number"
                value={heightInput}
                onChange={(e) => setHeightInput(e.target.value)}
              />
            </Form.Group>
          </Col>

          <Col xs="2">
            <Form.Group controlId="formWeight">
              <Form.Label>Weight</Form.Label>
              <Form.Control
                type="number"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3" controlId="formPicture">
          <Form.Label>Picture</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => {
              const value = e.target as HTMLInputElement;
              if (value.files) {
                setPictureInput(value.files[0]);
              } else {
                setPictureInput(null);
              }
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBio">
          <Form.Label>Bio</Form.Label>
          <Form.Control
            as="textarea"
            value={bioInput}
            onChange={(e) => setBioInput(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3 text-center" controlId="formAlert">
          <Alert
            variant="danger"
            dismissible={true}
            show={alert ? true : false}
            onClose={() => setAlert("")}
          >
            {alert}
          </Alert>
        </Form.Group>

        <Form.Group className="text-center" controlId="formBtn">
          <Button
            variant="warning"
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            {pet ? "Edit Pet" : "Add Pet"}
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
}

export default PetForm;
