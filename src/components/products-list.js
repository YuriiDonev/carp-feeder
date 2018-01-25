import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { products } from '../constants/products';

import HeaderMain from './header.js';
import { Footer } from './footer.js';


class ProductsList extends Component {

	state={
		transitionClass: 'header',
		extendedProduct: '',
		sortType: 'Default',
	};

	chooseSortType = (type) => {
		this.setState({sortType: type});
	}

	defineSortType = () => {
		let productsSorted;
		if ( this.state.sortType === 'Default' ) {
			productsSorted = products;
		} else if ( this.state.sortType === 'Price, low to high' ) {
			productsSorted = products.slice().sort((a, b) => ( a.price - b.price ));
		} else if ( this.state.sortType === 'Price, high to low' ) {
			productsSorted = products.slice().sort((a, b) => ( b.price - a.price ));
		}
		return productsSorted;
	}

	render() {

		const productsSorted = this.defineSortType();

		return (
		<div className='wrapper'>
			<HeaderMain
				chooseSort={this.chooseSortType}
			 />
			<div className='products-container'>
			<section className="products">
			{
				productsSorted.map((product, index) => { return <div key={index} className='product-card'>
					<div className='product-image'>
						<Link to={`/${product.id}`}><img src={product.img[0]} /></Link>
					</div>
					<div className='product-info'>
						<h5><Link to={`/${product.id}`}>{product.description}</Link></h5>
						<h6>{product.price} $</h6>
						<div className='buy'><a className='highlite2' href={product.link} target="_blank">
						Buy It Now</a></div>
					</div>
				</div>
				})
			}
			</section>
			</div>
			<Footer />
		</div>
		);
	}
}

export default ProductsList;
