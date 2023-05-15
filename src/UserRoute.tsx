import React, { useContext } from "react";
import { UserContext, UserContextType } from "./UserContext";
import { Navigate } from "react-router-dom";

interface routeFunctionProps {
  redirectRoute: string;
  openModal: Function;
  children: JSX.Element;
  onlyAdmin?: boolean;
}
function UserRoute({
  redirectRoute,
  openModal,
  children,
  onlyAdmin = false,
}: routeFunctionProps) {
  const { user } = useContext(UserContext) as UserContextType;
  const securityCheck = onlyAdmin ? user && user.admin : user;
  if (securityCheck) {
    return children;
  } else {
    // openModal();
    return <Navigate to={redirectRoute} />;
  }
}

export default UserRoute;
