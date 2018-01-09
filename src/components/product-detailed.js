import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { products } from '../constants/products.js';
import SingleProduct from './single-product.js';
import { Header } from './header.js';

class ProductDetailed extends Component {

  state = {increasedProduct: null};

  increasedProduct (id) {
    if (this.state.increasedProduct === id) {
      this.setState({increasedProduct: null});
      return;
    }
    this.setState({increasedProduct: id});
  }

  checkIncreasedPhoto(id) {
    if (this.state.increasedProduct === id) {
      return 'increased';
    } else {
      return '';
    }
  }

  componentWillMount() {
    addEventListener('click', this.handleWrapperClick);
    addEventListener('keydown', this.handleWrapperClick);
  }

  componentWillUnmount() {
    removeEventListener('click', this.handleWrapperClick);
    removeEventListener('keydown', this.handleWrapperClick);
  }

  handleWrapperClick = event => {
    if (event.target.tagName !== 'IMG' || event.keyCode === 27) {
      this.setState({increasedProduct: null});
    }
  }

	render() {

		return (
		<div>
		<Header />
		<div className='products-container'>
			{
				products.map((product, index) => {return  <div key={index} className='product'>
				<div className={`image-container ${this.checkIncreasedPhoto(product.id)}`}
        		onClick={this.increasedProduct.bind(this, product.id)}>
            {
              product.img.map((img, index) => {return <div key={index}><img src={img} /></div>})
            }
            {
              (this.state.increasedProduct === product.id) ? <div>X</div> : null
            }
          </div>
		  		<div className='product-description'>{product.description}</div>
          <div className='product-price'>{product.price} $</div>
          <div className='buy-link'><a className='highlite2' href={product.link} target="_blank">Buy It Now</a></div>
        </div>
      })
			}
		</div>
		</div>
		);
	}
}


export default ProductDetailed;
