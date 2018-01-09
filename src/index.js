import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
// import { Router, browserHistory } from 'react-router';
import reduxThunk from 'redux-thunk';
import { HashRouter, Route } from 'react-router-dom';


/**  CSS Load * */
// import 'react-select/dist/react-select.css';
import '../style/scss/index.scss';

import ProductsList from './components/products-list.js';
import SingleProduct from './components/single-product.js';
import RigsComponentsList from './components/rigs-components-list.js';

ReactDOM.render(
	<HashRouter>
	   <div>
		 <Route exact path="/" component={ProductsList} />
		 <Route exact path="/:productID" component={SingleProduct} />
	   </div>
	</HashRouter >
  ,document.querySelector('#main'));

// <Route exact path="/:productID" component={SingleProduct} />
		 // <Route path="/:product" component={OtherProduct} />
