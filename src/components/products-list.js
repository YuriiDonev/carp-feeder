import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { products } from '../constants/products';

import HeaderMain from './header.js';


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

			<div className='copyrighting'>
				<div className='copyrighting-box'>
					<div className='copyrighting-text'><h1>{'What is that tackle?'}</h1></div>
					<div className='copyrighting-text bullet'>{'- ready to use high quality carp feeder tackle'}</div>
					<div className='copyrighting-text bullet'>{'- made in East Europe (Ukraine) by fishermans'}</div>
					<div className='copyrighting-text bullet'>{'- high quality components'}</div>
					<div className='copyrighting-text bullet'>{'- all knots covered by shrink wrap'}</div>
				</div>
				<div className='copyrighting-box why'>
					<div className='copyrighting-text'><h1>{'Why these tackle?'}</h1></div>
					<div className='copyrighting-text bullet'>{'- NOT China high-volume product'}</div>
					<div className='copyrighting-text bullet'>{'- craft manufacture'}</div>
					<div className='copyrighting-text bullet'>{'- not just promises, but proven working tackle'}</div>
				</div>
			</div>


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
			<div className='footer'>
				<div className='footer-text'>{'Carp Feeder by DYV'} {'\u00A9'} {'2017'}</div>
			</div>
		</div>
		);
	}
}

export default ProductsList;
