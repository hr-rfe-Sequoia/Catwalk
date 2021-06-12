import * as React from 'react';
import axios from 'axios';
import Productinformation from './Productinformation.jsx';
import ImageGallaryComponent from './corosel.jsx';
import Productdescription from './Productdescription.jsx';
import Addtocart from './Addtocart.jsx';
import SingleStarRating from './SingleStarRating.jsx';
// import Imagegallery from './Imagegallery.jsx';
import config from './config.js';
import '../../styles/overview.css';
import GET from '../../../../lib/related.js';


class Overview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentProductInfo: '',
      currentProductStylesInfo: '',
      currentSelectedStyle: '',
      styleArray: '',
      cart: '',
      updateS: [],
      ratings: '',
    };

    this.updateCurrentSelectedStyle = this.updateCurrentSelectedStyle.bind(this);
    this.updateCart = this.updateCart.bind(this);
    this.updateStyleArayyy = this.updateStyleArayyy.bind(this);
    this.styleDropdown = this.styleDropdown.bind(this);

  }

  updateCart(data) {
    this.setState({
      cart: data
    });
  }

  updateStyleArayyy(styleObj) {
    this.styleDropdown(styleObj);
  }

  updateCurrentSelectedStyle(styleObj) {


    this.setState({
      currentSelectedStyle: styleObj,
    });



  }


  componentDidMount() {
    console.log('PLEASE HAVE THE PROPS', this.props.featuredProduct);
    GET.featuredProduct(this.props.featuredProduct.id)
      .then((data) => {
        console.log('firs set of data', data);

        this.setState({
          currentProductInfo: data.data
        });
        return GET.productStyles(this.props.featuredProduct.id);
      })
      .then((data) => {
        console.log('this is the styles info', data.data, 'this is default access', data.data.results[0]['default?']);
        var currentSelected = data.data.results[0];
        for (var i = 0; i < data.data.results.length; i++) {
          if (data.data.results[i]['default?'] === true) {
            currentSelected = data.data.results[i];
          }
        }

        this.setState({
          currentProductStylesInfo: data.data,
          currentSelectedStyle: currentSelected
          // default could be the defualt being true
        });
        return GET.productReviews(this.props.featuredProduct.id);
      })
      .then((data) => {
        // console.log('this is the current cart state', data.data);
        this.setState({
          ratings: data.data.ratings
        });
        return GET.getCart();
      })

      .then((data) => {
        // console.log('this is the current cart state', data.data);
        this.setState({
          cart: data.data
        });
        this.styleDropdown();

      })
      .catch((error) => {
        // console.log('the data did not renderrrr', error);
      });
  }




  styleDropdown(styleObj) {
    this.setState({
      styleArray: [],
    });
    if (styleObj === undefined) {
      var currentStyleArray = Object.entries(this.state.currentSelectedStyle.skus);
    } else {
      var currentStyleArray = Object.entries(styleObj.skus);
    }


    var styleStockArray = [];
    for (var j = 0; j < currentStyleArray.length; j++) {
      var value = currentStyleArray[j][1].size;
      var block = true;
      var blob = true;
      if (currentStyleArray[j][0] === '599535') {
        blob = false;
      }
      for (var i = 0; i < this.state.cart.length; i++) {
        if (this.state.cart[i]['sku_id'] === Number(currentStyleArray[j][0])) {
          blob = true;
          if ((currentStyleArray[j][1].quantity - this.state.cart[i]['count'] || 0) < 1) {

            block = false;
          }
        }
      }
      if (block === false || blob === false) {

      } else {
        styleStockArray.push(value);
      }
    }

    if (styleStockArray.length === 0) {
      styleStockArray = '';
    }
    this.setState({
      styleArray: styleStockArray
    });


  }


  render() {
    if (!this.props.featuredProduct) {
      return <span>Loading...</span>;
    }
    return (

      <div className='overview'>
        {console.log('what is the passed in prop', this.props)}

        <div className='galleryContainer'>
          <ImageGallaryComponent currentStyle={this.state.currentSelectedStyle} />
        </div>
        {/* <Imagegallery currentStyle={this.state.currentSelectedStyle}/> */}

        <div className='productContainer'>
          <div className='infocontainer'>
            <Productinformation currentProduct={this.state.currentProductInfo} currentStyle={this.state.currentSelectedStyle} ratings={this.state.ratings} />
            <SingleStarRating ratings={this.state.ratings} />
          </div>

          <Addtocart currentStyles={this.state.currentProductStylesInfo} updateCurrentStyle={this.updateCurrentSelectedStyle} currentStyle={this.state.currentSelectedStyle} styleArrayy={this.state.styleArray} updateOverCart={this.updateCart} updateStyleArray={this.updateStyleArayyy} />

          <Productdescription currentProduct={this.state.currentProductInfo} currentStyle={this.state.currentSelectedStyle} />
        </div>


      </div>



    );
  }
}

export default Overview;




