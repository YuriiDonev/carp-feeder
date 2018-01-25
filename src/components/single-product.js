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
		currentImage: 0,
	 };

	 closeLightbox = () => {
		 this.setState({lightboxIsOpen: false, currentImage: 0});
	 }

	 openLightbox = (id) => {
		 this.setState({lightboxIsOpen: true, currentImage: id});
	 }

	gotoPrevious = () => {
		this.setState((prevState, props) => (
			{currentImage: prevState.currentImage - 1}
		));
	}
	gotoNext = () => {
		this.setState((prevState, props) => (
			{currentImage: prevState.currentImage + 1}
		));
	}

	renderPhoto = (imgID) => {
		this.setState({photoID: imgID});
	}

	render() {

		console.log('this.props ', this.props);

		// const product = products[this.props.match.params.productID-1];
		const productIdFromURL = +this.props.match.params.productID;

		console.log('productIdFromURL ', productIdFromURL);

		const productInArr = products.filter((p) => {
			return p.id === productIdFromURL
		});

		const product = productInArr[0];

		const productAddPhotos = product.img.slice();
		const lightboxImages = product.img.map(img => ({src: img}) );

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
					onClick={this.openLightbox.bind(this, this.state.photoID)}
				/></div>
				<Lightbox
					images={lightboxImages}
					currentImage={this.state.currentImage}
					isOpen={this.state.lightboxIsOpen}
					onClose={this.closeLightbox}
					onClickPrev={this.gotoPrevious}
					onClickNext={this.gotoNext}
				/>
				</div>
				<div className='description-block'>
					<div>{product.description}</div>
					<div className='product-price'>{product.price} $</div>
					<div className='buy-link'><a className='highlite2' href={product.link} target="_blank">Buy It Now</a></div>
					<div className='bullets'>
						<ul>
						{
							product.bullets.map((bullet, index) => {
								return <li key={index}>{bullet}</li>
							})
						}
						</ul>
					</div>
				</div>
				</div>
				<Footer />
			</div>
		);
	}
}



export default SingleProduct;
