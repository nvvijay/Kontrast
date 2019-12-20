import React from 'react';

import {
  Route,
  HashRouter
} from "react-router-dom";
import Dashboard from "./Dashboard";
import Presentation from "./Presentation";
import Mongo from "./Mongo";
import PSQL from "./Psql";
import Neo from "./Neo";

import "./css/common.css"

export default class Content extends React.Component {
	componentDidMount() {
        console.log("Content Mounted.");
    }

	render() {
		return (

			<HashRouter>
			<div className="content">
				<Route exact path="/" component={Presentation}/>
				<Route path="/Metrics" component={Dashboard}/>
	            <Route path="/Mongo" component={Mongo}/>
	            <Route path="/PSQL" component={PSQL}/> 
	            <Route path="/GraphDB" component={Neo}/> 
          	</div>
          	</HashRouter>
		);
	}
}