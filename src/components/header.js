import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export const Header = () => {
	return (
		<div className='header'>
			<Link to='/'><img className='header-capr-logo' src='/style/imgs/carp-logo-light.png' /></Link>
		</div>
	);
}
