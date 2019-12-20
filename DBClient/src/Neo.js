import React from 'react';
import './css/Neo.css';
import {Container, Row, Col, ListGroup, Tab, Table, InputGroup, FormControl, Dropdown, DropdownButton} from 'react-bootstrap';
import { NeoGraph } from "./NeoGraphComponent";

const NEO4J_URI = "bolt://localhost:7687";
const NEO4J_USER = "neo4j";
const NEO4J_PASSWORD = "qwertyuiop";

export default class Neo extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			query: "MATCH (p:Project) return p;",
			status: "No Output!"
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.runQuery = this.runQuery.bind(this);
	}
	componentDidMount() {
        console.log("neo Mounted.");
    };

    handleSubmit(event) {
		event.preventDefault();
		this.setState({ query: this.element.value });
	}

	runQuery(type) {
		console.log("getting query of type:", type);
		if(type === "getBuilding"){
			this.setState({"query": "MATCH (p:Project {projectid: '1'}) -[r:CONTAINS*]-> (b) return p,r,b;" });
			this.element.value = "MATCH (p:Project {projectid: '1'}) -[r:CONTAINS*]-> (b) return p,r,b;"
		}
		else if(type === "getLayout"){
			this.setState({"query": "MATCH (i:Item {itemid: '159'}) -[r:CONNECTS*]- (b) return i,r,b;" });
			this.element.value = "MATCH (i:Item {itemid: '159'}) -[r:CONNECTS*]- (b) return i,r,b;"
		}else if(type === "getPath"){
			this.setState({"query": "MATCH (from:Item { itemid: '139' }), (to:Item { itemid: '5' }), p = shortestPath((from)-[:CONNECTS*]-(to)) return p;" });
			this.element.value = "MATCH (from:Item { itemid: '139' }), (to:Item { itemid: '5' }), p = shortestPath((from)-[:CONNECTS*]-(to)) return p;"
		}else if(type === "getGeometry"){
			this.setState({"query": "MATCH (i:Building { buildingid: '8900' }) -[r:CONTAINS*]- (b:Item) where b.type in ['10','11','12','13','14','15'] return i,r,b;" });
			this.element.value = "MATCH (i:Building { buildingid: '8900' }) -[r:CONTAINS*]- (b:Item) where b.type in ['10','11','12','13','14','15'] return i,r,b;"
		}else if(type === "getProperty"){
			this.setState({"query": "MATCH (i:Item{itemid:'163'}) -[r:HAS_PROPERTY]- (p)  return i,r,p" });
			this.element.value = "MATCH (i:Item{itemid:'163'}) -[r:HAS_PROPERTY]- (p)  return i,r,p"
		}else if(type === "getArea"){
			this.setState({"query": "MATCH (f:Floor {floorid: '3'}) -[r:CONTAINS*]-> (i) where i.type in ['10','11','12','13','14','15'] with i match (i)-[:HAS_PROPERTY]-(p) with sum(toInt(p.area)) as ar CALL apoc.create.vNode(['RESULT'], {area: ar}) yield node as are return are;"});
			this.element.value = `MATCH (f:Floor {floorid: '3'}) -[r:CONTAINS*]-> (i) where i.type in ['10','11','12','13','14','15'] 
with i 
match (i)-[:HAS_PROPERTY]-(p) 
with sum(toInt(p.area)) as ar
CALL apoc.create.vNode(['RESULT'], {area: ar}) yield node as are
return are
			`
		}
		
	}

	render() {
		return (
			<Container fluid id="neo">
				<Row id="title">
					<Col sm>
						<div id="titleContainer">
		    				<span id="bigTitle">Neo4J</span> <br/> <span id="smallTitle">(Graph Database.)</span>
		    			</div>
	    			</Col>
				</Row>
				<Tab.Container id="tabsContainer" defaultActiveKey="#GraphDB/link1">
				<Row>
					<Col sm={3}>
						<div id="sidebar">
							<ListGroup variant="flush">
								<ListGroup.Item action href="#GraphDB/link1">
									Graph Visualizer
								</ListGroup.Item>
								<ListGroup.Item action href="#GraphDB/link2">
									Metrics
								</ListGroup.Item>
								<ListGroup.Item action href="#GraphDB/link3">
									API Docs
								</ListGroup.Item>
							</ListGroup>
			          	</div>
					</Col>
					<Col sm={9}>
						<div id="rightPanel">
			          		<Tab.Content>
							<Tab.Pane eventKey="#GraphDB/link1">
								<InputGroup className="mb-3">
									<FormControl
										placeholder="Enter Cypher Query"
										aria-label="Recipient's username"
										aria-describedby="basic-addon2"
										ref={el => this.element = el}
										as="textarea"
										rows="3"
										defaultValue="MATCH (p:Project) return p;"
									/>
									<DropdownButton
										as={InputGroup.Prepend}
										variant="outline-secondary"
										title="Execute"
										id="input-group-dropdown-2"
									>
										<Dropdown.Item onClick={() => this.runQuery("getBuilding")}>Get Building</Dropdown.Item>
										<Dropdown.Item onClick={() => this.runQuery("getLayout")}>Get Floor Layout</Dropdown.Item>
										<Dropdown.Item onClick={() => this.runQuery("getPath")}>Get Path From PointA to pointB</Dropdown.Item>
										<Dropdown.Divider />
										<Dropdown.Item onClick={() => this.runQuery("getGeometry")}>Get Geometry</Dropdown.Item>
										<Dropdown.Item onClick={() => this.runQuery("getProperty")}>Get Property Of an Item</Dropdown.Item>
										<Dropdown.Item onClick={() => this.runQuery("getArea")}>Get Carpet Area of a floor</Dropdown.Item>
										<Dropdown.Divider />
										<Dropdown.Item onClick={this.handleSubmit}>Execute Current Query</Dropdown.Item>
									</DropdownButton>
								</InputGroup>
								<div style={{"fontSize":"11px", "textAlign":"center", "float":"right", "width":"300px", "backgroundColor":"#faa"}}><strong>!!CAUTION!!</strong> Input not sanitized, you could break stuff. </div>

								<NeoGraph
									width={"100%"}
									height={"500px"}
									containerId={"graphContainer"}
									neo4jUri={NEO4J_URI}
									neo4jUser={NEO4J_USER}
									neo4jPassword={NEO4J_PASSWORD}
									backgroundColor={"white"}
									query={this.state.query}
								/>
							</Tab.Pane>
							<Tab.Pane eventKey="#GraphDB/link2">
								<h3> Metrics of various queries: </h3>
								<hr/>
								<div>
									Number of Nodes: <strong> 16204 </strong>   <br/> Number of Relationships: <strong> 68092</strong>
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
												<td>1.0ms (w/ index)</td>
											</tr>
											<tr>
												<td>2</td>
												<td>Time for GET query (arbitrary field)</td>
												<td>8.0ms (w/ index)</td>
											</tr>
											<tr>
												<td>3</td>
												<td>Time for GET with criteria on entire corpus</td>
												<td>14.0ms</td>
											</tr>
											<tr><td colSpan="3">UPDATE Queries</td></tr>
											<tr>
												<td>4</td>
												<td>Time for UPDATE query (entire document)</td>
												<td>2.0ms</td>
											</tr>
											<tr>
												<td>5</td>
												<td>Time for UPDATE query (partial update)</td>
												<td>2.0ms</td>
											</tr>
											<tr>
												<td>6</td>
												<td>Time for UPDATE with criteria on entire corpus</td>
												<td>17.0ms</td>
											</tr>
											<tr>
												<td>7</td>
												<td>Time for UPDATE with new field (add annotation)</td>
												<td>7.0ms</td>
											</tr>
											<tr><td colSpan="3">Aggregate Queries</td></tr>
											<tr>
												<td>8</td>
												<td>Time for query to get all rooms in a building</td>
												<td>1.0ms</td>
											</tr>
											<tr>
												<td>9</td>
												<td>Time for query to get carpet area of a floor</td>
												<td>2.0ms</td>
											</tr>
											<tr><td colSpan="3">Relationship Queries</td></tr>
											<tr>
												<td>10</td>
												<td>Time for query to get direction from pointA to pointB</td>
												<td>1.0ms</td>
											</tr>
											<tr>
												<td>11</td>
												<td>Time for query to get all rooms close to kitchen</td>
												<td>1.0ms</td>
											</tr>
										</tbody>
									</Table>
								</div>
							</Tab.Pane>
							<Tab.Pane eventKey="#GraphDB/link3">
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