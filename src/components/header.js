import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class HeaderMain extends Component {

	choose = (event) => {
		this.props.chooseSort(event.target.value);
	}

	render() {
		return (
			<div className='header-main'>
				<div className="bgimg w3-display-container w3-animate-opacity w3-text-white">
					<div className="w3-display-middle">
						<h1 className="w3-jumbo w3-animate-top">Carp Feeder</h1>
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



// export const HeaderMain = (props) => {
// 	return (
// 		<div className='header-main'>
// 			<div className="bgimg w3-display-container w3-animate-opacity w3-text-white">
// 				<div className="w3-display-middle">
// 					<h1 className="w3-jumbo w3-animate-top">Carp Feeder</h1>
// 				</div>
// 			</div>
//
// 			<div className="collection-sort">
// 				<label>Sort by:</label>
// 				<select>
// 					<option>Select type...</option>
// 		      <option onClick={props.chooseSort.bind(this, 'low to high')}>Price, low to high</option>
// 		      <option onClick={props.chooseSort.bind(this, 'high to low')}>Price, high to low</option>
// 		    </select>
// 			</div>
//
// 		</div>
// 	);
// };

export const HeaderDark = () => {
	return (
		<div className='header-dark'>
			<Link to='/'><img className='header-carp-logo-dark' src='/style/imgs/carp-logo-black.png' /></Link>
		</div>
	);
};

// div className='logo-container'><img className='header-carp-logo' src='/style/imgs/carp-logo-light.png' /></div>
// <div className="w3-display-bottomleft w3-padding-large">
// 	{'Powered by by DYV '}{'\u00A9'}
// </div>
