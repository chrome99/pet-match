import React, { useContext } from "react";
import { UserContext, UserContextType } from "./UserContext";
import { Navigate } from "react-router-dom";

interface routeFunctionProps {
  redirectRoute: string;
  children: JSX.Element;
}
function UserRoute({ redirectRoute, children }: routeFunctionProps) {
  const { user } = useContext(UserContext) as UserContextType;
  if (user) {
    return children;
  } else {
    return <Navigate to={redirectRoute} />;
  }
}

export default UserRoute;
