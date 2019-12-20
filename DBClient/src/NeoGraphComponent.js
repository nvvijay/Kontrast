import React, { Component } from "react";
import PropTypes from "prop-types";
import NeoVis from 'neovis.js';

class NeoGraph extends Component {
  constructor(props) {
    super(props);
    this.visRef = React.createRef();
  }

  componentDidMount() {
    const { neo4jUri, neo4jUser, neo4jPassword, query } = this.props;
    const config = {
      container_id: this.visRef.current.id,
      server_url: neo4jUri,
      server_user: neo4jUser,
      server_password: neo4jPassword,
      initial_cypher: query,
      arrows: true,
      labels: {
      	"Project": {
      		"caption" : "name",
      		"icon": "./public/images/icon.png",
      	},
      	"Site": {
      		"caption": "name",
      	},
      	"Building": {
      		"caption" : "name",
      	},
      	"Floor": {
      		"caption": "name",
      	},
      	"Item": {
      		"caption": "name",
      	}
      }
    };

    // "sizeCypher": "MATCH (n) WHERE id(n) = {id} MATCH (n)-[r]-() RETURN sum(1) AS c"
    /*
      Since there is no neovis package on NPM at the moment, we have to use a "trick":
      we bind Neovis to the window object in public/index.html.js
    */
    this.vis = new NeoVis(config);
    this.vis.render();
  }

  componentWillReceiveProps(nextProps) {
  	this.vis.renderWithCypher(nextProps.query);
  	console.log("trs", this.vis);
  }

  render() {
    const { width, height, containerId, backgroundColor } = this.props;
    return (
      <div
        id={containerId}
        ref={this.visRef}
        style={{
          width: `${width}`,
          height: `${height}`,
          backgroundColor: `${backgroundColor}`
        }}
      />
    );
  }
}

NeoGraph.defaultProps = {
  width: 600,
  height: 600,
  backgroundColor: "white"
};

NeoGraph.propTypes = {
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  containerId: PropTypes.string.isRequired,
  neo4jUri: PropTypes.string.isRequired,
  neo4jUser: PropTypes.string.isRequired,
  neo4jPassword: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string,
  query: PropTypes.string
};

export { NeoGraph }