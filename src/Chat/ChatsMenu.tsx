import React, { useState, useContext } from "react";
import "./ChatsMenu.css";
import { Request } from "./Contact";
import { Modal, Button, Collapse } from "react-bootstrap";
import RequestForm from "./RequestForm";
import { UserContext, UserContextType } from "../UserContext";

function MyArrow({ value }: { value: boolean }) {
  return (
    <span className="myArrow">
      {value ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
          <path d="M12 17.414 3.293 8.707l1.414-1.414L12 14.586l7.293-7.293 1.414 1.414L12 17.414z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
          <path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z" />
        </svg>
      )}
    </span>
  );
}

interface ChatMenuProps {
  requests: Request[] | null;
  setRequests: React.Dispatch<
    React.SetStateAction<Request[] | null | undefined>
  >;
  setCurrentRequest: React.Dispatch<React.SetStateAction<Request | null>>;
}
function ChatsMenu({
  requests,
  setRequests,
  setCurrentRequest,
}: ChatMenuProps) {
  const { user } = useContext(UserContext) as UserContextType;
  const [modal, setModal] = useState(false);

  const [viewUnattendedRequests, setViewUnattendedRequests] = useState(true);
  const [viewOpenRequests, setViewOpenRequests] = useState(true);
  const [viewClosedRequests, setViewClosedRequests] = useState(true);

  function addRequest(value: Request) {
    setRequests((prev) => {
      if (prev) {
        return [...prev, value];
      } else {
        return [value];
      }
    });
  }

  return (
    <>
      <div id="chatsMenuContainer">
        <div id="chatsMenuAll">
          <div id="chatsMenuUnattended">
            <div
              className="chatsMenuHeading"
              onClick={() => setViewUnattendedRequests((prev) => !prev)}
            >
              <MyArrow value={viewUnattendedRequests} />
              Unattended
            </div>
            <Collapse in={viewUnattendedRequests}>
              <div>
                {requests
                  ? requests
                      .filter((request) => request.state === "unattended")
                      .map((request) => {
                        return (
                          <div
                            className="chatMenuRequest"
                            key={request.id}
                            onClick={() => setCurrentRequest(request)}
                          >
                            {request.title}
                          </div>
                        );
                      })
                  : ""}
              </div>
            </Collapse>
          </div>
          <div id="chatsMenuOpen">
            <div
              className="chatsMenuHeading"
              onClick={() => setViewOpenRequests((prev) => !prev)}
            >
              <MyArrow value={viewOpenRequests} />
              Open
            </div>
            <Collapse in={viewOpenRequests}>
              <div>
                {requests
                  ? requests
                      .filter((request) => request.state === "open")
                      .map((request) => {
                        return (
                          <div
                            className="chatMenuRequest"
                            key={request.id}
                            onClick={() => setCurrentRequest(request)}
                          >
                            {request.title}
                          </div>
                        );
                      })
                  : ""}
              </div>
            </Collapse>
          </div>
          <div id="chatsMenuClosed">
            <div
              className="chatsMenuHeading"
              onClick={() => setViewClosedRequests((prev) => !prev)}
            >
              <MyArrow value={viewClosedRequests} />
              Locked
            </div>
            <Collapse in={viewClosedRequests}>
              <div>
                {requests
                  ? requests
                      .filter((request) => request.state === "closed")
                      .map((request) => {
                        return (
                          <div
                            className="chatMenuRequest"
                            key={request.id}
                            onClick={() => setCurrentRequest(request)}
                          >
                            {request.title}
                          </div>
                        );
                      })
                  : ""}
              </div>
            </Collapse>
          </div>
        </div>
        <div id="chatsMenuButton">
          <Button
            className={user && user.admin ? "d-none" : ""}
            onClick={() => setModal(true)}
          >
            Add Request
          </Button>
        </div>
      </div>
      <Modal show={modal} onHide={() => setModal(false)}>
        <RequestForm setModal={setModal} addRequest={addRequest} />
      </Modal>
    </>
  );
}

export default ChatsMenu;
