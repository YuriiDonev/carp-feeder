import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export const HeaderLight = (props) => {
	return (
		<div className={ props.transClass }>
			<Link to='/'><img className='header-capr-logo' src='/style/imgs/carp-logo-text.png' /></Link>
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
