import React from 'react';
import {Table, Image} from 'react-bootstrap';

export default class Content extends React.Component {
	componentDidMount() {
        console.log("Dashboard Mounted.");
    }

	render() {
		return (
			<div className="content" id="dash">
    			<Table striped borderless hover variant="light" id="tableContainer">
										<thead>
											<tr>
												<th></th>
												<th>#</th>
												<th>Query Type</th>
												<th>PSQL<Image src="/images/psqldb.svg" width="50px" height="50px"/></th>
												<th>Mongo<Image src="/images/mongodb.svg" width="50px" height="50px"/></th>
												<th>Neo4J<Image src="/images/neodb.svg" width="50px" height="50px"/></th>
											</tr>
										</thead>
										<tbody>
											<tr><td colSpan="6">GET Queries</td></tr>
											<tr>
												<th></th>
												<td>1</td>
												<td>Time for GET query (entire document)</td>
												<td>162.0ms</td>
												<td>0.0ms (w & w/o index)</td>
												<td>1.0ms (w/ index)</td>
											</tr>
											<tr>
												<th></th>
												<td>2</td>
												<td>Time for GET query (arbitrary field)</td>
												<td>10.0ms</td>
												<td>27.0ms (0ms w/ index)</td>
												<td>8.0ms (w/ index)</td>
											</tr>
											<tr>
												<th></th>
												<td>3</td>
												<td>Time for GET with criteria on entire corpus</td>
												<td>11.0ms</td>
												<td>0.0ms (does COLLSCAN)</td>
												<td>14.0ms</td>
											</tr>
											<tr><td colSpan="6">UPDATE Queries</td></tr>
											<tr>
												<th></th>
												<td>4</td>
												<td>Time for UPDATE query (entire document)</td>
												<td>-</td>
												<td>0.0ms</td>
												<td>2.0ms</td>
											</tr>
											<tr>
												<th></th>	
												<td>5</td>
												<td>Time for UPDATE query (partial update)</td>
												<td>38.0ms</td>
												<td>0.0ms</td>
												<td>2.0ms</td>
											</tr>
											<tr>
												<th></th>
												<td>6</td>
												<td>Time for UPDATE with criteria on entire corpus</td>
												<td>39.0ms</td>
												<td>0.0ms</td>
												<td>17.0ms</td>
											</tr>
											<tr>
												<th></th>
												<td>7</td>
												<td>Time for UPDATE with new field (add annotation)</td>
												<td>-</td>
												<td>0.0ms</td>
												<td>7.0ms</td>
											</tr>
											<tr><td colSpan="6">Aggregate Queries</td></tr>
											<tr>
												<th></th>
												<td>8</td>
												<td>Time for query to get all rooms in a building</td>
												<td>21.0ms</td>
												<td>0.0ms</td>
												<td>1.0ms</td>
											</tr>
											<tr>
												<th></th>
												<td>9</td>
												<td>Time for query to get carpet area of a floor</td>
												<td>17.0ms</td>
												<td>0.0ms</td>
												<td>2.0ms</td>
											</tr>
											<tr><td colSpan="6">Relationship Queries</td></tr>
											<tr>
												<th></th>
												<td>10</td>
												<td>Time for query to get direction from pointA to pointB</td>
												<td>*app dependent*</td>
												<td>*app dependent*</td>
												<td>1.0ms</td>
											</tr>
											<tr>
												<th></th>
												<td>11</td>
												<td>Time for query to get all rooms close to kitchen</td>
												<td>*app dependent*</td>
												<td>*app dependent*</td>
												<td>1.0ms</td>
											</tr>
										</tbody>
									</Table>
          	</div>
		);
	}
}