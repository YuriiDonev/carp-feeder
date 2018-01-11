import React, { Component } from 'react';
import _ from 'lodash';
import Lightbox from 'react-images';

import { products } from '../constants/products.js';
import { HeaderDark } from './header.js';
import { Footer } from './footer.js';

class SingleProduct extends Component {

	state = {
		photoID: 0,
		increased: false,
		lightboxIsOpen: false,
	 };

	 closeLightbox = () => {
		 this.setState({lightboxIsOpen: false});
	 }

	 openLightbox = () => {
		 this.setState({lightboxIsOpen: true});
	 }


	renderPhoto = (imgID) => {
		this.setState({photoID: imgID});
	}

	render() {
		console.log('products ', products);
		const product = products[this.props.match.params.productID-1];
		const productAddPhotos = product.img.slice();
		console.log('product ', product);
		const arr = [{src: product.img[this.state.photoID]}];
		console.log('arr ', arr);

		return (
			<div className='wrapper'>
				<HeaderDark />
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
				<div><img className='single-product-main-image' src={product.img[this.state.photoID]}
					onClick={this.openLightbox}
				/></div>
				</div>
				<div className='description-block'>
					<div>{product.description}</div>
					<div className='product-price'>{product.price} $</div>
					<div className='buy-link'><a className='highlite2' href={product.link} target="_blank">Buy It Now</a></div>
				</div>
				</div>
				<Footer />
						<Lightbox
			        images={arr}
			        isOpen={this.state.lightboxIsOpen}
			        onClose={this.closeLightbox}
		      />
			</div>
		);
	}
}



export default SingleProduct;
