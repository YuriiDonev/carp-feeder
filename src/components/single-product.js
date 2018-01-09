import React, { Component } from 'react';
import _ from 'lodash';

import { products } from '../constants/products.js';
import { Header } from './header.js';

class SingleProduct extends Component {

	state = {
		photoID: 0,
		increased: false
	 };

	renderPhoto = (imgID) => {
		this.setState({photoID: imgID});
	}

	render() {
		const product = products[this.props.match.params.productID-1];
		const productAddPhotos = product.img.slice();

		return (
			<div className='wrapper'>
				<Header />
				<div className='wrapper-single'>
				<div className='all-photos'>
				{	(_.isEmpty(productAddPhotos) || productAddPhotos.length === 1) ? null : <div className='add-photos-container'>
					{
						productAddPhotos.map((img, index) => {return <div key={index}
						onClick={this.renderPhoto.bind(this, index)}
						><img className='add-photos' src={img} /></div>})
					}
					</div>
				}
				<div><img className='single-product-main-image' src={product.img[this.state.photoID]} /></div>
				</div>
				<div className='description-block'>
					<div>{product.description}</div>
					<div className='product-price'>{product.price} $</div>
					<div className='buy-link'><a className='highlite2' href={product.link} target="_blank">Buy It Now</a></div>
				</div>
				</div>
			</div>
		);
	}
}


export default SingleProduct;
