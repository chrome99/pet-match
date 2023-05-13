import React from "react";
import "./Faq.css";
import { Accordion } from "react-bootstrap";

function Faq() {
  return (
    <div id="faqContainer">
      <div className="heading">Frequently Asked Questions</div>
      <Accordion defaultActiveKey={["0"]}>
        <Accordion.Item eventKey="0">
          <Accordion.Header>How can I adopt a pet?</Accordion.Header>
          <Accordion.Body>
            To adopt a pet, simply browse our website and search for the pet
            that you're interested in. Once you find a pet that you like, click
            on the pet to view their profile. If you're logged in, you'll be
            able to adopt the pet by clicking the "Adopt" button on their
            profile.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>
            What if I'm not sure if I'm ready to adopt a pet?
          </Accordion.Header>
          <Accordion.Body>
            If you're not sure if you're ready to adopt a pet, you can foster a
            pet instead. Fostering allows you to take care of a pet for a
            temporary period of time without the long-term commitment of
            adoption. You can browse available pets and apply to foster them on
            their profile pages.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>
            What if I need to return a pet that I've adopted?
          </Accordion.Header>
          <Accordion.Body>
            We understand that sometimes things don't work out, and we allow
            returns on adopted pets. You can initiate a return by contacting us
            through our contact page and filling out a return request form. A
            member of our team will be in touch with you shortly to guide you
            through the process.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="3">
          <Accordion.Header>
            How can I add pets to my wishlist?
          </Accordion.Header>
          <Accordion.Body>
            You can add pets to your wishlist by clicking the "Add to Wishlist"
            button on their profile pages. This allows you to keep track of pets
            that you're interested in and revisit their profiles later.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="4">
          <Accordion.Header>
            How can I get technical support or make suggestions?
          </Accordion.Header>
          <Accordion.Body>
            You can contact us through our contact page and fill out a query
            form. An admin will shortly attend to your query and open a chat for
            further discussion. After the topic is finished, the query is locked
            for security reasons.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="5">
          <Accordion.Header>Can I edit my user profile?</Accordion.Header>
          <Accordion.Body>
            Yes, you can edit your user profile by visiting the profile page and
            clicking the "Edit Profile" button. This allows you to update your
            personal information, password, and communication preferences.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="6">
          <Accordion.Header>
            What if I'm not sure if I'm ready to adopt a pet?
          </Accordion.Header>
          <Accordion.Body>
            If you're not sure if you're ready to adopt a pet, you can foster a
            pet instead. Fostering allows you to take care of a pet for a
            temporary period of time without the long-term commitment of
            adoption. You can browse available pets and apply to foster them on
            their profile pages.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="7">
          <Accordion.Header>
            Where can I see the pets that I've adopted, fostered, or added to my
            wishlist?
          </Accordion.Header>
          <Accordion.Body>
            You can see the pets that you've adopted, fostered, or added to your
            wishlist by visiting the "My Pets" page. This page displays all the
            pets that you're currently caring for or interested in. If you have
            any further questions or concerns, please don't hesitate to contact
            us through our contact page. We're committed to helping you find the
            perfect pet and providing you with exceptional customer service.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}

export default Faq;
