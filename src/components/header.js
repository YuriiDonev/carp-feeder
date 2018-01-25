import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export const HeaderMain = (props) => {
	return (
		<div className='header-main'>
			<div className="bgimg w3-display-container w3-animate-opacity w3-text-white">
				<div className="w3-display-middle">
					<h1 className="w3-jumbo w3-animate-top">Carp Feeder</h1>
				</div>
			</div>
		</div>
	);
};

export const HeaderDark = () => {
	return (
		<div className='header-dark'>
			<Link to='/'><img className='header-carp-logo-dark' src='/style/imgs/carp-logo-black.png' /></Link>
		</div>
	);
};

// <div className="w3-display-bottomleft w3-padding-large">
// 	{'Powered by by DYV '}{'\u00A9'}
// </div>
