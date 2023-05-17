import React, { useState } from "react";
import "./SearchForm.css";
import {
  Form,
  Button,
  Spinner,
  Alert,
  Row,
  Col,
  Collapse,
} from "react-bootstrap";
import axios from "axios";
import { IPet } from "../Pet/PetProfile";

interface SearchFormProps {
  setPets: React.Dispatch<React.SetStateAction<IPet[] | null>>;
}
function SearchForm({ setPets }: SearchFormProps) {
  type adoptionStatus = "All" | "Fostered" | "Adopted" | "Available";
  type petType = "All" | "Cat" | "Dog";

  const [adoptionStatusInput, setAdoptionStatusInput] =
    useState<adoptionStatus>("All");
  const [typeInput, setTypeInput] = useState<petType>("All");
  const [heightInput, setHeightInput] = useState("");
  const [weightInput, setWeightInput] = useState("");
  const [nameInput, setNameInput] = useState("");

  const [advancedSearch, setAdvancedSearch] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [alert, setAlert] = useState("");

  function searchPets() {
    let queryInput = "";
    if (typeInput !== "All") {
      queryInput += "&type=" + typeInput;
    }
    if (advancedSearch) {
      if (adoptionStatusInput !== "All") {
        queryInput += "&adoptionStatus=" + adoptionStatusInput;
      }
      if (heightInput) {
        queryInput += "&height=" + heightInput;
      }
      if (weightInput) {
        queryInput += "&weight=" + weightInput;
      }
      if (nameInput) {
        queryInput += "&name=" + nameInput;
      }
    }

    //replace the first instance of & with ?
    queryInput = queryInput.replace("&", "?");

    setSpinner(true);
    axios
      .get("http://localhost:8080/pet/" + queryInput)
      .then((response) => {
        response.data.map((pet: any) => {
          return (pet.id = pet._id);
        });
        setPets(response.data);
        setSpinner(false);
      })
      .catch((error) => {
        if (error.response) {
          setAlert(error.response.data);
        } else {
          setAlert(error.message);
        }
        setSpinner(false);
      });
  }

  return (
    <div id="searchContainer">
      <div className="heading">Search</div>
      <Form id="searchForm">
        <Row className="align-items-center">
          <Col sm={3} />
          <Col sm={6}>
            <Form.Group id="typeInput" className="mb-3" controlId="formType">
              <Form.Label>Type</Form.Label>
              <Form.Select
                value={typeInput}
                onChange={(e) => setTypeInput(e.target.value as petType)}
              >
                <option>All</option>
                <option>Dog</option>
                <option>Cat</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col sm={3}>
            <Form.Group id="searchSwitch" controlId="formSwitch">
              <Form.Check
                type="switch"
                onClick={() => setAdvancedSearch((prev) => !prev)}
                label="Advanced"
              />
            </Form.Group>
          </Col>
        </Row>

        <Collapse in={advancedSearch}>
          <div id="advanced-search">
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="input"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="formAdoptionStatus">
                  <Form.Label>Adoption Status</Form.Label>
                  <Form.Select
                    value={adoptionStatusInput}
                    onChange={(e) =>
                      setAdoptionStatusInput(e.target.value as adoptionStatus)
                    }
                  >
                    <option>All</option>
                    <option>Available</option>
                    <option>Fostered</option>
                    <option>Adopted</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="formHeight">
                  <Form.Label>Height</Form.Label>
                  <Form.Control
                    type="input"
                    value={heightInput}
                    onChange={(e) => setHeightInput(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="formWeight">
                  <Form.Label>Weight</Form.Label>
                  <Form.Control
                    type="input"
                    value={weightInput}
                    onChange={(e) => setWeightInput(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>
        </Collapse>

        <Form.Group className={`text-center`} controlId="formAlert">
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
              searchPets();
            }}
          >
            <Spinner
              id="submitSpinner"
              className={spinner ? "" : "d-none"}
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            Search
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
}

export default SearchForm;
