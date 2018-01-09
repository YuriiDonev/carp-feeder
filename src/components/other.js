
import React, { Component } from 'react';

import { products } from '../constants/products.js';
import { Header } from './header.js';

class OtherProduct extends Component {

	render() {
    console.log('this.props OtherProduct', this.props);
		return (
      		<div>
				<Header />
				<div>OtherProduct</div>
			</div>
		);
	}
}


export default OtherProduct;
