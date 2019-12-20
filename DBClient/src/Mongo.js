import React from 'react';
import './css/Mongo.css';
import {Container, Row, Col, ListGroup, Tab, Accordion, Card, Table, Alert, Image, OverlayTrigger, Popover} from 'react-bootstrap';
import AsyncSelect from 'react-select/async';
import CRUD from './js/util/crud.js';
import ReactJson from 'react-json-view'

export default class Mongo extends React.Component {
	componentDidMount() {
        console.log("Mongo Mounted.");
    };

    constructor(props) {
    	super(props);
    	this.state = {	data : {"status": "no data!", "action":"select a project first!"}, 
    					geom_data: {"status": "no data!"},
    					num_rooms: -1,
    					carpet_area: -1,

    					alert: {
    						show_alert: false,
    						message: "no message yet!",
    						variant: "success"
    					},

    					query_collection: {
    						get: "no op get",
    						aggregate: "no op aggregate",
    						update: "no op update"
    					},
    					query: "Do an operation first!"
    				};
    	this.getProjects = this.getProjects.bind(this);
    	this.selectProject = this.selectProject.bind(this);
    	this.updateItem = this.updateItem.bind(this);
    	this.handleAccordionClick = this.handleAccordionClick.bind(this);
    	this.deleteItem = this.deleteItem.bind(this);
    }
	getProjects(text) {
		console.log("test", text, this.state.query);
		const promise = CRUD.get_list(text);
		this.updateInspectQuery("db.find({name: .*"+text+".*}, {_id:1, name:1});");
		return promise.then(res => res.json());
	};

	updateInspectQuery(val) {
		this.setState({"query": val});
	}

	selectProject(val) {
		console.log("Selected: " , val);
		// this.state.query = "db.find({_id: "+val._id+"});";
		CRUD.get_id(val._id).then(res => res.json())
			.then( (res) => {
				this.setState({"data":res}); 
				this.setState({"geom_data": this.getGeometry(res)})
			});

		CRUD.getBusinessInfo(val._id, "spaces_list").then(res => res.json())
			.then( (res) => {
				this.setState({"num_rooms": res[0].spaces.length});
				this.setState({"num_floors": res[0].num_floors});
				this.setState({"carpet_area": res[0].area});

				var alert = {
					show_alert: true,
				};
				if(res[0].status === "error") {
					alert.message = res[0].code+" : "+res[0].message;
					alert.variant = "error";
					this.setState({"alert": alert});
				} else {
					alert.message = "operation successful!";
					alert.variant = "success";
					this.setState({"alert": alert});
				}
			});

		// CRUD.getBusinessInfo(val._id, "test").then(res => res.json())
		// 	.then( (res) => {
		// 		console.log("just testing failure case");
		// 	});

		this.setState({"query_collection": {
			get: "db.find({_id: "+val._id+"});",
			aggregate: `db.scratchpad.aggregate([
			    { $match: {"_id": `+val._id+`} },
			    { $unwind: "$site.building.floor"},
			    { $unwind: "$site.building.floor.spaces"}, 
			    { $group: {
			      _id:"$_id", 
			      spaces: {$push: "$site.building.floor.spaces"},
			      area: {$sum: "$site.building.floor.spaces.carpet_area"},
			      num_floors: {$first: "$site.building.num_floors"}
			      }
			    }
			])`,
			update: "oops"
		}});

		setTimeout(()=> {this.setState({alert: {show_alert: false}})}, 3000);

	}

	updateItem(edit) {
		CRUD.update_doc(edit);
		var key = edit.namespace;
		key.shift(); // remove trailing 0
		if(key.length > 0) {
			key = key.join(".") + "." + edit.name;
		}else{
			key = edit.name;
		}
		
		var id = edit.existing_src[0]._id;
		this.setState({query: `collection.update({"_id":${id}, {"$set": {${key}: ${edit.new_value}}}`});
		return null;
	}

	deleteItem(edit) {
		CRUD.delete_item(edit);

		var key = edit.namespace;
		key.shift(); // remove trailing 0
		if(key.length > 0) {
			key = key.join(".") + "." + edit.name;
		}else{
			key = edit.name;
		}
		var id = edit.existing_src[0]._id;
		this.setState({query: `collection.update({"_id":`+id+`, {"$unset": {`+key+`: ""}}`});

		return null;
	}

	getGeometry(data){
		data = data[0];
		function iter(o){
			var d = {};
			Object.keys(o).forEach(function (k) {
				if (o[k] != null && Array.isArray(o[k])) {
	        		for(var item in o[k]){
	        			if(d[k] == null){
	        				d[k] = [];
	        			}
	        			if(o[k][item] != null){
	        				var r = iter(o[k][item]);
	        				if(Object.entries(r).length !== 0){
	        					d[k].push(r);
	        				}
	        			}	
	        		}
	        		if(d[k] && d[k].length === 0){
	        			delete d[k];
	        		}
	        	}
		        else if (o[k] !== null && typeof o[k] === 'object') {
		        	if (k === "geometry") {
			        	d[k] = o[k];
			        } else {
			        	r = iter(o[k]);
			        	if(Object.entries(r).length !== 0){
	        				d[k] = r;
	        			}
		        		
			        }
		        }
			});
			return d;
    	};
		return iter(data);
	}

	handleAccordionClick(evt, id){
		switch(id){
			case 0: this.setState({"query": this.state.query_collection.get});break;
			case 1: this.setState({"query": this.state.query_collection.get});break;
			case 2: this.setState({"query": this.state.query_collection.aggregate});break;
			default: console.log();
		}
	}

	render() {
		const dot = (color = '#fcc') => ({
				alignItems: 'center',
				display: 'flex',
				':before': {
					backgroundColor: color,
					borderRadius: 10,
					content: '" "',
					display: 'block',
					marginRight: 8,
					height: 10,
					width: 10,
				},
			});

			const colourStyles = {
			container: styles => ({...styles, width: '450px', display: "inline-block"}),
			control: styles => ({ ...styles, backgroundColor: 'white', ":hover":{borderColor: "#ad9", boxShadow:"0 0 0 0 #ad9"}, ":active":{borderColor: "#ad9", boxShadow:"0 0 0 0 #ad9 !important"}}),
			option: (styles, { data, isDisabled, isFocused, isSelected }) => {
			return {
				...styles,
				backgroundColor: isDisabled? null: 
					isSelected? "#4faa40": 
					isFocused? "#ad9": 
					null,color: isDisabled? '#ccc': 
					isSelected? 'black': "black",
				cursor: isDisabled ? 'not-allowed' : 'default',
				':active': {
						...styles[':active'],
						backgroundColor: !isDisabled && (isSelected ? "#4faa40" : "#ad9"),
					},
				};
			},
			input: styles => ({ ...styles, ":focus": {outline:"none"}, ...dot()}),
			placeholder: styles => ({ ...styles, ...dot() }),
			singleValue: (styles, { data }) => ({ ...styles, ...dot("green") }),
		};
		return (
			<Container fluid id="mongo">
				<Alert key={0} variant={this.state.alert.variant} show={this.state.alert.show_alert} >
					{this.state.alert.message}
				</Alert>
				<Row  id="title">
					<Col sm>
						<div id="titleContainer">
		    				<span id="bigTitle">MongoDB</span> <br/> <span id="smallTitle">(Document Based Database.)</span>
		    			</div>
	    			</Col>
				</Row>
				<Tab.Container id="tabsContainer" defaultActiveKey="#mongo/link1">
				<Row>
					<Col sm={3}>
						<div id="sidebar">
							<ListGroup variant="flush">
								<ListGroup.Item action href="#mongo/link1">
									Usecases
								</ListGroup.Item>
								<ListGroup.Item action href="#mongo/link2">
									Metrics
								</ListGroup.Item>
								<ListGroup.Item action href="#mongo/link3">
									API Docs
								</ListGroup.Item>
							</ListGroup>
			          	</div>
					</Col>
					<Col sm={9}>
						<div id="rightPanel">
			          		<Tab.Content>
							<Tab.Pane eventKey="#mongo/link1">
							<div>
								<AsyncSelect
									styles = {colourStyles}
									defaultOptions
									placeholder="Type here to Search Projects..."
									name="project-select"
									getOptionLabel ={(option)=>option.name}
									getOptionValue ={(option)=>option._id}
									loadOptions= {this.getProjects}
									onChange= {this.selectProject}
								/>
								<OverlayTrigger
									trigger="click"
									key="bottom"
									placement="bottom"
									overlay={
										<Popover
										id={`popover-positioned-bottom`}
										title={`Inspect Query`}
										>
											{this.state.query}
										</Popover>
									}
									>
								
								<Image src="./images/Dbicon.png" width="25px" height="25px" vspace="10px" hspace="10px" alt="inspect query!" style={{cursor:"pointer"}}></Image>
								</OverlayTrigger>
								<div style={{display: "inline-block", margin: "5px", width: "48%", textAlign: "center"}}>Schema in use: <strong> buildings </strong></div>
							</div>
							<hr/>
							<Accordion>
								<Card>
									<Accordion.Toggle as={Card.Header} eventKey="0" onClick={(evt) => this.handleAccordionClick(evt, 0)}>
										<h5> View & Update </h5>
									</Accordion.Toggle>
									<Accordion.Collapse eventKey="0">
										<Card.Body>
											<div id="jsonContainer"> 
												<ReactJson src={this.state.data} theme="eighties" collapsed={true} enableClipboard={false} onEdit={this.updateItem} onDelete={this.deleteItem}/>
											</div>
										</Card.Body>
									</Accordion.Collapse>
								</Card>
								<Card>
									<Accordion.Toggle as={Card.Header} eventKey="1" onClick={(evt) => this.handleAccordionClick(evt, 1)}>
										<h5>Geometry </h5>
									</Accordion.Toggle>
									<Accordion.Collapse eventKey="1">
										<Card.Body>
											<div id="jsonContainer"> 
												<ReactJson src={this.state.geom_data} theme="eighties" collapsed={true} enableClipboard={false} onEdit={this.updateItem}/>
											</div>
										</Card.Body>
									</Accordion.Collapse>
								</Card>
								<Card>
									<Accordion.Toggle as={Card.Header} eventKey="2" onClick={(evt) => this.handleAccordionClick(evt, 2)}>
										<h5>Business Queries </h5>
									</Accordion.Toggle>
									<Accordion.Collapse eventKey="2">
										<Card.Body>
											<Table striped borderless hover variant="dark" id="tableContainer">
												<thead><tr>
													<th>#</th>
													<th>Query Type</th>
													<th>Result</th>
												</tr></thead>
												<tbody>
													<tr>
														<td>1</td>
														<td>Number of Floors in building</td>
														<td>{this.state.num_floors}</td>
													</tr>
													<tr>
														<td>2</td>
														<td>Number of rooms in building</td>
														<td>{this.state.num_rooms}</td>
													</tr>
													<tr>
														<td>3</td>
														<td>Carpet Area of the building</td>
														<td>{this.state.carpet_area} sq.ft</td>
													</tr>
												</tbody>
											</Table>
										</Card.Body>
									</Accordion.Collapse>
								</Card>
							</Accordion>
							</Tab.Pane>
							<Tab.Pane eventKey="#mongo/link2">
								<h3> Metrics of various queries: </h3>
								<hr/>
								<div>
									Total number of documents: <strong> 484 </strong>   <br/> Size: <strong> 170.85 M</strong>
								</div>
								<br/>
								<div>
									<Table striped borderless hover variant="dark" id="tableContainer">
										<thead>
											<tr>
												<th>#</th>
												<th>Query Type</th>
												<th>Measurement (*average)</th>
											</tr>
										</thead>
										<tbody>
											<tr><td colSpan="3">GET Queries</td></tr>
											<tr>
												<td>1</td>
												<td>Time for GET query (entire document)</td>
												<td>0.0ms (w & w/o index)</td>
											</tr>
											<tr>
												<td>2</td>
												<td>Time for GET query (arbitrary field)</td>
												<td>27.0ms (0ms w/ index)</td>
											</tr>
											<tr>
												<td>3</td>
												<td>Time for GET with criteria on entire corpus</td>
												<td>0.0ms (does COLLSCAN)</td>
											</tr>
											<tr><td colSpan="3">UPDATE Queries</td></tr>
											<tr>
												<td>4</td>
												<td>Time for UPDATE query (entire document)</td>
												<td>0.0ms</td>
											</tr>
											<tr>
												<td>5</td>
												<td>Time for UPDATE query (partial update)</td>
												<td>0.0ms</td>
											</tr>
											<tr>
												<td>6</td>
												<td>Time for UPDATE with criteria on entire corpus</td>
												<td>0.0ms</td>
											</tr>
											<tr>
												<td>7</td>
												<td>Time for UPDATE with new field (add annotation)</td>
												<td>0.0ms</td>
											</tr>
											<tr><td colSpan="3">Aggregate Queries</td></tr>
											<tr>
												<td>8</td>
												<td>Time for query to get all rooms in a building</td>
												<td>0.0ms</td>
											</tr>
											<tr>
												<td>9</td>
												<td>Time for query to get carpet area of a floor</td>
												<td>0.0ms</td>
											</tr>
											<tr><td colSpan="3">Relationship Queries</td></tr>
											<tr>
												<td>10</td>
												<td>Time for query to get direction from pointA to pointB</td>
												<td>*app dependent*</td>
											</tr>
											<tr>
												<td>11</td>
												<td>Time for query to get all rooms close to kitchen</td>
												<td>*app dependent*</td>
											</tr>
										</tbody>
									</Table>
								</div>
							</Tab.Pane>
							<Tab.Pane eventKey="#mongo/link3">
								Don't be lazy! write docs!
							</Tab.Pane>
							</Tab.Content>
			          	</div>
		          	</Col>
				</Row>
				</Tab.Container>
			</Container>
		);
	}
}