import React, { useState, useContext } from "react";
import "./ChatsMenu.css";
import { Request } from "./Contact";
import { Modal, Button, Form } from "react-bootstrap";
import RequestForm from "./RequestForm";
import { UserContext, UserContextType } from "../../Contexts/UserContext";

interface ChatMenuProps {
  requests: Request[] | null;
  setCurrentRequest: React.Dispatch<React.SetStateAction<Request | undefined>>;
}
function ChatsMenu({ requests, setCurrentRequest }: ChatMenuProps) {
  const { user } = useContext(UserContext) as UserContextType;
  const [modal, setModal] = useState(false);

  const [selectFilter, setSelectFilter] = useState<
    "all" | "unattended" | "open" | "closed"
  >("all");
  const [selectSort, setSelectSort] = useState<"newest" | "oldest">("newest");

  return (
    <>
      <div id="chatsMenuContainer">
        <div id="chatsMenuHeading">
          <div id="chatsMenuHeadingFilter">
            Filter
            <Form.Select
              onChange={(e) => {
                setSelectFilter(
                  e.target.value as "all" | "unattended" | "open" | "closed"
                );
              }}
              value={selectFilter}
            >
              <option value="all">All</option>
              <option value="unattended">New</option>
              <option value="open">Open</option>
              <option value="closed">Locked</option>
            </Form.Select>
          </div>
          <div>
            Sort
            <Form.Select
              onChange={(e) => {
                setSelectSort(e.target.value as "newest" | "oldest");
              }}
              value={selectSort}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </Form.Select>
          </div>
        </div>
        <div id="chatsMenuAll">
          {requests
            ? requests
                .filter((request) =>
                  selectFilter === "all" ? true : request.state === selectFilter
                )
                .sort((a, b) =>
                  selectSort === "newest"
                    ? b.updatedAt.getTime() - a.updatedAt.getTime()
                    : a.updatedAt.getTime() - b.updatedAt.getTime()
                )
                .map((request) => {
                  return (
                    <div
                      className="chatMenuRequest"
                      key={request.id}
                      onClick={() => setCurrentRequest(request)}
                    >
                      <span>
                        {request.messages[request.messages.length - 1].value}
                      </span>
                      <img
                        src={require(`../../Assets/Images/icon-${request.state}.png`)}
                        alt="state"
                      />
                    </div>
                  );
                })
            : ""}
        </div>
        <div id="chatsMenuButton">
          <Button
            variant="warning"
            className={user && user.admin ? "d-none" : ""}
            onClick={() => setModal(true)}
          >
            Add Request
          </Button>
        </div>
      </div>
      <Modal show={modal} onHide={() => setModal(false)}>
        <RequestForm setModal={setModal} />
      </Modal>
    </>
  );
}

export default ChatsMenu;
