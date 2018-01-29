import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class HeaderSingle extends Component {

	state = {
		showEmail: false
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
							<a href="mailto:yurii.donev@gmail.com">{'yurii.donev@gmail.com'}</a>
						</address>
					</div>

					<Link to='/'>
						<div className="w3-display-middle">
							<h1 className="w3-jumbo w3-animate-top">Carp Feeder</h1>
							<div className='logo'><img src='/style/imgs/carp-logo-beige.png' title='Carp Feeder' /></div>
						</div>
					</Link>
				</div>
			</div>
		);
	}
}

export default HeaderSingle;
