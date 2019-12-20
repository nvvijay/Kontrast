import React from 'react';


export default class Presentation extends React.Component {
	componentDidMount() {
        console.log("Presentation Mounted.");
    }

	render() {
		return (
			<div className="content">
				<iframe src="https://docs.google.com/a/wework.com/presentation/d/e/2PACX-1vTlHfDLEULIM8hwIVNmtVXhWqhCLB7JbUcA-n7EIYra7B_gj1rjhtvnSXyxdJQm-kQG6pwJv2_yIQ9H/embed?start=false&loop=false&delayms=60000" frameborder="0" width="1440" height="800" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" title="Kontrast"></iframe>
          	</div>
		);
	}
}