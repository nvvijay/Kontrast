import React from 'react';
import './css/Header.css';
import {Navbar, Nav, NavDropdown} from 'react-bootstrap';
import {
  HashRouter
} from "react-router-dom";
import { LinkContainer } from 'react-router-bootstrap';

export default class Header extends React.Component {

	handleTabClick(key, evt) {
		console.log("in click:", key, evt);
	}

	componentDidMount() {
        console.log("Header Mounted.");
    }

	render () {
		return (
	    <>
	    <HashRouter>
		  <Navbar bg="dark" variant="dark" expand="md">
		    <Navbar.Brand href="/">
		      <img alt="" src="/images/icon.png" width="35" height="35" className="d-inline-block align-top" />
		      {'Kontrast'} 
		    </Navbar.Brand>
		    <Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
				<Nav className="mr-auto" onSelect={this.handleTabClick}>
					<LinkContainer to="/"><Nav.Link href="#">Home</Nav.Link></LinkContainer>
					<LinkContainer to="/Metrics"><Nav.Link href="#Metrics">Metrics</Nav.Link></LinkContainer>
					<NavDropdown title="Explorer" id="basic-nav-dropdown">
						<LinkContainer to="/PSQL"><NavDropdown.Item href="#sql">SQL</NavDropdown.Item></LinkContainer>
						<LinkContainer to="/Mongo"><NavDropdown.Item href="#MongoDB">MongoDB</NavDropdown.Item></LinkContainer>
						<LinkContainer to="/GraphDB"><NavDropdown.Item href="#GraphDB">GraphDB</NavDropdown.Item></LinkContainer>
					</NavDropdown>
				</Nav>
				</Navbar.Collapse>
		  </Navbar>
		  </HashRouter>
		</>
	  );
	}
}
	

