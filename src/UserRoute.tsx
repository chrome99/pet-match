import React, { useContext } from "react";
import { UserContext, UserContextType } from "./UserContext";
import { Navigate } from "react-router-dom";

interface routeFunctionProps {
  redirectRoute: string;
  children: JSX.Element;
  onlyAdmin?: boolean;
}
function UserRoute({
  redirectRoute,
  children,
  onlyAdmin = false,
}: routeFunctionProps) {
  const { user } = useContext(UserContext) as UserContextType;
  const securityCheck = onlyAdmin ? user && user.admin : user;
  if (securityCheck) {
    return children;
  } else {
    return <Navigate to={redirectRoute} />;
  }
}

export default UserRoute;
