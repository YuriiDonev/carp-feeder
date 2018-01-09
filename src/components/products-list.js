import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { products } from '../constants/products';
import SingleProduct from './single-product.js';
import { Header } from './header.js';

class ProductsList extends Component {

	render() {
		return (
		<div className='wrapper'>
		<Header />
			<div className='products-container'>
			{
				products.map((product, index) => {return  <div key={index} className='product'>
				<div className='image-container'>
				<div><Link to={`/${product.id}`}><img src={product.img[0]} /></Link></div>
				</div>
				<div className='product-description'><Link to={`/${product.id}`}>{product.description}</Link></div>
				<div className='product-price'>{product.price} $</div>
				<div className='buy-link'><a className='highlite2' href={product.link} target="_blank">
				Buy It Now</a></div>
				</div>
				})
			}
			</div>
		</div>
		);
	}
}

export default ProductsList;
