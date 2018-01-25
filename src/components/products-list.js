import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { products } from '../constants/products';
import SingleProduct from './single-product.js';
import { HeaderMain, HeaderDark } from './header.js';
import { Footer } from './footer.js';


class ProductsList extends Component {

	state={
		transitionClass: 'header',
		extendedProduct: '',
	};

	// componentDidMount() {
	// 	this.setState({ transitionClass: 'header-trans' });
	// 	// setTimeout(() => {
	// 	// 	this.setState({ transitionClass: 'header-trans' });
	// 	// }, 1000);
	// }


	// mouseOver = (id) => {
	// 	console.log('mouseOver id ', id);
	// 	// console.log('event.target ', event.target);
	// 	// console.log('event.currentTarget.dataset.id ', event.currentTarget.dataset.id);
	// 	// this.setState({ extendedProduct: id });
	// 	this.setState((prevState, props) => ({extendedProduct: id}));
	// }

	// mouseOut = () => {
	// 	console.log('onMouseLeave ');
	// 	this.setState({ extendedProduct: '' });
	// }

	render() {
		return (
		<div className='wrapper'>
		<HeaderMain />
			<div className='products-container'>
			<section className="products">
			{
				products.map((product, index) => { return <div key={index}
				data-id={product.id}
				className='product-card'
				>
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

// className={(this.state.extendedProduct === product.id) ? 'product-info-extended' : 'product-info'}
// render() {
// 	return (
// 	<div className='wrapper'>
// 	<HeaderLight transClass={this.state.transitionClass} />
// 		<div className='products-container'>
// 		{
// 			products.map((product, index) => {return  <div key={index} className='product'>
// 			<div className='image-container'>
// 			<Link to={`/${product.id}`}><img src={product.img[0]} /></Link>
// 			</div>
// 			<div className='product-description'><Link to={`/${product.id}`}>{product.description}</Link></div>
// 			<div className='product-price'>{product.price} $</div>
// 			<div className='buy-link'><a className='highlite2' href={product.link} target="_blank">
// 			Buy It Now</a></div>
// 			</div>
// 			})
// 		}
// 		</div>
// 		<Footer />
// 	</div>
// 	);
// }
