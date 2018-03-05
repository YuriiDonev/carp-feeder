import React, { Component } from 'react';

class HeaderMain extends Component {

	state = {
		showEmail: false
	}

	choose = (event) => {
		this.props.chooseSort(event.target.value);
	}

	toggleEmail = () => {
		if (!this.state.showEmail) {
			this.setState({ showEmail: true });
		} else {
			this.setState({ showEmail: false });
		}
	}

	render() {

		let emailActive = (this.state.showEmail) ? 'active' : '';

		return (
			<div className='header-main'>
				<div className="bgimg w3-display-container w3-animate-opacity w3-text-white">
					<div className='contact-us' onClick={this.toggleEmail}>
						<img src='/style/imgs/envelope2.png' title='Contact Us' />
					</div>

					<div className={`email-${emailActive}`} onClick={this.toggleEmail}>
						<address>
							<a href="mailto:k.savenkov@yahoo.com">{'k.savenkov@yahoo.com'}</a>
						</address>
					</div>

					<div className="w3-display-middle">
						<h1 className="w3-jumbo w3-animate-top">Carp Feeder - Ready to Use Tackle</h1>
					</div>
				</div>
				<div className="collection-sort">
					<label>Sort by:</label>
					<select onChange={this.choose}>
						<option>Default</option>
			      <option>Price, low to high</option>
			      <option>Price, high to low</option>
			    </select>
				</div>
			</div>
		);
	}
}

export default HeaderMain;

// <div className='logo'><img src='/style/imgs/carp-logo-beige.png' title='Carp Feeder' /></div>
