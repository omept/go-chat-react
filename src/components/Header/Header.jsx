import { MDBBtn } from "mdb-react-ui-kit";
import React from "react";
import "./Header.scss";

const Header = (props) => (
  <div className="header">
    <h2>Go + React Socket Chat</h2>
    {!props.isAuthenticated ? (
      ""
    ) : (
      <MDBBtn color="danger" onClick={props.logout}>
        Logout
      </MDBBtn>
    )}
  </div>
);

export default Header;
