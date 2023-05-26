import React, { useState } from "react";
import "./SearchForm.css";
import { Form, Row, Col, Collapse } from "react-bootstrap";
import { object as schema } from "yup";
import { Formik } from "formik";
import { MyInput, MySubmit, MySelect } from "../../Utils/MyForm";
import validictonary from "../../Utils/Validictonary";

interface SearchFormProps {
  getPetsByQuery: (
    query: string,
    setSubmitting: (isSubmitting: boolean) => void
  ) => void;
}
function SearchForm({ getPetsByQuery }: SearchFormProps) {
  const [advancedSearch, setAdvancedSearch] = useState(false);

  type formData = {
    type: string;
    name: string;
    height: string | number;
    weight: string | number;
    adoptionStatus: string;
  };
  function searchPets(
    form: formData,
    setSubmitting: (isSubmitting: boolean) => void
  ) {
    //the first "&" later gets replaced by "?"
    let queryInput = "";
    if (form.type !== "All") {
      queryInput += "&type=" + form.type;
    }
    if (advancedSearch) {
      if (form.adoptionStatus !== "All") {
        queryInput += "&adoptionStatus=" + form.adoptionStatus;
      }
      if (form.height) {
        queryInput += "&height=" + form.height;
      }
      if (form.weight) {
        queryInput += "&weight=" + form.weight;
      }
      if (form.name) {
        queryInput += "&name=" + form.name;
      }
    }

    getPetsByQuery(queryInput, setSubmitting);
  }

  return (
    <div id="searchContainer">
      <div className="heading">Search</div>
      <Formik
        validationSchema={schema().shape({
          type: validictonary.select("Type", ["All", "Dog", "Cat"]),
          name: validictonary.name("Name", false),
          height: validictonary.pet.height(false),
          weight: validictonary.pet.weight(false),
          adoptionStatus: validictonary.select("Adoption Status", [
            "All",
            "Adopted",
            "Fostered",
            "Available",
          ]),
        })}
        onSubmit={(e, { setSubmitting }) => {
          searchPets(e, setSubmitting);
        }}
        initialValues={{
          type: "All",
          name: "",
          height: "",
          weight: "",
          adoptionStatus: "All",
        }}
      >
        {({ handleSubmit, isSubmitting }) => (
          <Form id="searchForm" noValidate onSubmit={handleSubmit}>
            <Row className="mb-3 align-items-center">
              <Col sm={3} />
              <MySelect
                name="type"
                label="Type"
                options={["All", "Dog", "Cat"]}
                xs={"6"}
              />
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
                <Row className="mb-3">
                  <MyInput name="name" label="Name" />
                  <MySelect
                    name="adoptionStatus"
                    label="Adoption Status"
                    options={["All", "Fostered", "Adopted", "Available"]}
                  />
                </Row>

                <Row className="mb-3">
                  <MyInput name="height" label="Height" type="number" />
                  <MyInput name="weight" label="Weight" type="number" />
                </Row>
              </div>
            </Collapse>

            <MySubmit text="Search" isSubmitting={isSubmitting} />
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default SearchForm;
