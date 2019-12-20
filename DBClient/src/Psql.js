import React from 'react';
import './css/Psql.css';
import {Container, Row, Col, ListGroup, Tab, Table, Card, Image} from 'react-bootstrap';

export default class PSQL extends React.Component {
	componentDidMount() {
        console.log("Psql Mounted.");
    };

    showTableResult(e) {
    	console.log("showing table result", e.target);
    	var c = e.target.parentElement.children[2].className;

    	if(c === "hide"){
    		e.target.parentElement.children[2].classList.remove("hide");
    		e.target.parentElement.children[2].classList.add("show");
    		e.target.innerText = "hide";
    	}else {
    		e.target.parentElement.children[2].classList.remove("show");
    		e.target.parentElement.children[2].classList.add("hide");
    		e.target.innerText = "run";
    	}
    	
    }

	render() {
		return (
			<Container fluid id="psql">
				<Row id="title">
					<Col sm>
						<div id="titleContainer">
		    				<span id="bigTitle">PostgreSQL</span> <br/> <span id="smallTitle">(Relational Database.)</span>
		    			</div>
	    			</Col>
				</Row>
				<Tab.Container id="tabsContainer" defaultActiveKey="#psql/link1">
				<Row>
					<Col sm={3}>
						<div id="sidebar">
							<ListGroup variant="flush">
								<ListGroup.Item action href="#psql/link1">
									Queries
								</ListGroup.Item>
								<ListGroup.Item action href="#psql/link3">
									DB Schema
								</ListGroup.Item>
								<ListGroup.Item action href="#psql/link2">
									Metrics
								</ListGroup.Item>
							</ListGroup>
			          	</div>
					</Col>
					<Col sm={9}>
						<div id="rightPanel">
			          		<Tab.Content>
							<Tab.Pane eventKey="#psql/link1">
								<Card border="light" style={{ width: '100%' }}>
									<Card.Header>Get Building Details</Card.Header>
									<Card.Body>
										<Card.Text>
											select p.*, s.*, b.*, f.* from projects as p inner join projectstositesmapping as psm on p.projectid = psm.projectid and p.projectid=1 inner join sites as s on psm.siteid = s.siteid inner join sitestobuildingsmapping as sbm on s.siteid=sbm.siteid inner join buildings as b on sbm.buildingid=b.buildingid inner join buildingstofloorsmapping as bfm on bfm.buildingid = b.buildingid inner join floors as f on bfm.floorid = f.floorid inner join floortostructuremapping as fsm on f.floorid=fsm.floorid inner join items as itm on fsm.structureid=itm.itemid inner join spacetoitemmapping as sim on itm.itemid=sim.spaceid inner join items as i on sim.itemid = i.itemid
										</Card.Text>
										<div className="showTableResult" onClick={this.showTableResult}>run</div>
										<div id="tableResult" className="hide">
										Number of joins: 10
										<Table striped borderless hover id="tableContainers">
										<thead>
											<tr><th>projectid</th><th>name</th><th>filename</th><th>siteid</th><th>name</th><th>geometry</th><th>buildingid</th><th>name</th><th>num_floors</th><th>floorid</th><th>name</th><th>fnumber</th><th>itemid</th><th>name</th><th>type</th><th>geometry</th></tr>
										</thead>
										<tbody>
											<tr><td>1</td><td>project_name_aardvark</td><td>./path/to/file/hackler.txt</td><td>2</td><td>site_name_illiterate</td><td>e230c474-c841-4bf3-98be-04e37f38a262</td><td>1744</td><td>building_name_Zend</td><td>10</td><td>3</td><td>floor_name_sarcosine</td><td>0</td><td>8</td><td>desk_name_extortioner</td><td>26</td><td>2a002bb5-ad39-46d4-b200-35c30e3c2027</td></tr>
											<tr><td>1</td><td>project_name_aardvark</td><td>./path/to/file/hackler.txt</td><td>2</td><td>site_name_illiterate</td><td>e230c474-c841-4bf3-98be-04e37f38a262</td><td>1744</td><td>building_name_Zend</td><td>10</td><td>3</td><td>floor_name_sarcosine</td><td>0</td><td>8</td><td>desk_name_extortioner</td><td>26</td><td>2a002bb5-ad39-46d4-b200-35c30e3c2027</td></tr>
											<tr><td>1</td><td>project_name_aardvark</td><td>./path/to/file/hackler.txt</td><td>2</td><td>site_name_illiterate</td><td>e230c474-c841-4bf3-98be-04e37f38a262</td><td>1744</td><td>building_name_Zend</td><td>10</td><td>3</td><td>floor_name_sarcosine</td><td>0</td><td>9</td><td>chair_name_funnelform</td><td>27</td><td>09fbf941-2f89-4d6e-8c7d-145a763b9967</td></tr>
											<tr><td>1</td><td>project_name_aardvark</td><td>./path/to/file/hackler.txt</td><td>2</td><td>site_name_illiterate</td><td>e230c474-c841-4bf3-98be-04e37f38a262</td><td>1744</td><td>building_name_Zend</td><td>10</td><td>3</td><td>floor_name_sarcosine</td><td>0</td><td>10</td><td>whiteboard_name_unparcelled</td><td>28</td><td>ff89eb30-70cc-4c08-90e4-bc88310653df</td></tr>
											<tr><td>1</td><td>project_name_aardvark</td><td>./path/to/file/hackler.txt</td><td>2</td><td>site_name_illiterate</td><td>e230c474-c841-4bf3-98be-04e37f38a262</td><td>1744</td><td>building_name_Zend</td><td>10</td><td>3</td><td>floor_name_sarcosine</td><td>0</td><td>14</td><td>desk_name_ostalgia</td><td>26</td><td>15730c7d-46c6-462f-a40e-0753c195f44f</td></tr>
										</tbody>
										</Table>
										</div>
									</Card.Body>
								</Card>
								<Card border="light" style={{ width: '100%' }}>
									<Card.Header>Get All Geometry for Floor</Card.Header>
									<Card.Body>
										<Card.Text>
											select i.geometry from floors as f inner join floortostructuremapping as fsm on f.floorid=fsm.floorid and f.floorid=3 inner join items as i on fsm.structureid = i.itemid 
										</Card.Text>
										<div className="showTableResult" onClick={this.showTableResult}>run</div>
										<div id="tableResult" className="hide">
										Number of joins: 2
										<Table striped borderless hover id="tableContainers">
										<thead>
											<tr><th>geometry</th></tr>
										</thead>
										<tbody>
											<tr><td>552d1b60-4fa9-48f0-8e5b-b68ce48ca96e</td></tr>
											<tr><td>a506a0cc-f164-4fb7-9107-4842a7d8e9d2</td></tr>
											<tr><td>2c6a6eb2-8611-4ea3-b2d3-324ddea5f83d</td></tr>
											<tr><td>32fa86ae-e1e1-4789-ac15-d7b0b6f9d39f</td></tr>
											<tr><td>a0a7cff3-4109-44d8-b8c5-6af8ded91de2</td></tr>
											<tr><td>3b89f237-4afc-4f48-957d-9bec7e10bf4d</td></tr>
											<tr><td>e0cbe6f7-b4df-423d-86b1-d52bfcb3de30</td></tr>
											<tr><td>a011dd6d-1691-4989-9c97-303de2c2c300</td></tr>
											<tr><td>4df8800a-5094-4b98-88e2-d314c3a4c985</td></tr>
											<tr><td>(null)</td></tr>
											<tr><td>(null)</td></tr>
											<tr><td>2dd51c8a-20b1-4356-9056-1577f30b5be4</td></tr>
											<tr><td>...</td></tr>
											<tr><td>...</td></tr>
										</tbody>
										</Table>
										</div>
									</Card.Body>
								</Card>
								<Card border="light" style={{ width: '100%' }}>
									<Card.Header>Get Number of rooms in building</Card.Header>
									<Card.Body>
										<Card.Text>
											select count(*) from items as i inner join floortostructuremapping as fsm on fsm.structureid = i.itemid and i.type=10 inner join buildingstofloorsmapping as bfm on fsm.floorid=bfm.floorid where buildingid=1744
										</Card.Text>
										<div className="showTableResult" onClick={this.showTableResult}>run</div>
										<div id="tableResult" className="hide">
										Number of joins: 2
										<Table striped borderless hover id="tableContainers">
										<thead>
											<tr><th>count</th></tr>
										</thead>
										<tbody>
											<tr><td>92</td></tr>
										</tbody>
										</Table>
										</div>
									</Card.Body>
								</Card>
								<Card border="light" style={{ width: '100%' }}>
									<Card.Header>Get carpet area of a floor</Card.Header>
									<Card.Body>
										<Card.Text>
											select sum(area) from items as i inner join floortostructuremapping as fsm on fsm.structureid = i.itemid and i.type in (10,11,12,13,14,15) and fsm.floorid=3 inner join itemtopropertymapping as ipm on i.itemid = ipm.itemid inner join itemproperties as ip on ipm.propid = ip.propid
										</Card.Text>
										<div className="showTableResult" onClick={this.showTableResult}>run</div>
										<div id="tableResult" className="hide">
										Number of joins: 3
										<Table striped borderless hover id="tableContainers">
										<thead>
											<tr><th>sum</th></tr>
										</thead>
										<tbody>
											<tr><td>12637</td></tr>
										</tbody>
										</Table>
										</div>
									</Card.Body>
								</Card>
								<Card border="light" style={{ width: '100%' }}>
									<Card.Header>Update Query</Card.Header>
									<Card.Body>
										<Card.Text>
											update sites set name = 'site_name_illiterate' where siteid=2
										</Card.Text>
									</Card.Body>
								</Card>
							</Tab.Pane>
							<Tab.Pane eventKey="#psql/link2">
								<h3> Metrics of various queries: </h3>
								<hr/>
								<div>
									Total number of tables: <strong> 13 </strong> 
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
												<td>162.0ms</td>
											</tr>
											<tr>
												<td>2</td>
												<td>Time for GET query (arbitrary field)</td>
												<td>10.0ms</td>
											</tr>
											<tr>
												<td>3</td>
												<td>Time for GET with criteria on entire corpus</td>
												<td>11.0ms</td>
											</tr>
											<tr><td colSpan="3">UPDATE Queries</td></tr>
											<tr>
												<td>4</td>
												<td>Time for UPDATE query (entire document)</td>
												<td>-</td>
											</tr>
											<tr>
												<td>5</td>
												<td>Time for UPDATE query (partial update)</td>
												<td>38.0ms</td>
											</tr>
											<tr>
												<td>6</td>
												<td>Time for UPDATE with criteria on entire corpus</td>
												<td>39.0ms</td>
											</tr>
											<tr>
												<td>7</td>
												<td>Time for UPDATE with new field (add annotation)</td>
												<td>-</td>
											</tr>
											<tr><td colSpan="3">Aggregate Queries</td></tr>
											<tr>
												<td>8</td>
												<td>Time for query to get all rooms in a building</td>
												<td>21.0ms</td>
											</tr>
											<tr>
												<td>9</td>
												<td>Time for query to get carpet area of a floor</td>
												<td>17.0ms</td>
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
							<Tab.Pane eventKey="#psql/link3">
								<Image src="/images/dbschema.svg"/>
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