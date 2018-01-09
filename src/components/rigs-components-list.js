import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { productsReady } from '../constants/ready-to-use-rigs.js';
import SingleProduct from './single-product.js';
import { Header } from './header.js';

class RigsComponentsList extends Component {

	render() {
		return (
		<div>
		<Header />
			<div>
				This is RigsComponentsList
			</div>
		</div>
		);
	}
}

export default RigsComponentsList;
