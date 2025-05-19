import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { initializeAnalytics, trackPageView } from './components/publicCom/Analytics';


import Home from "./components/Home";
import About from "./components/About";
import About1 from "./components/About1";
import Contact from "./components/Contact";
import FAQs from "./components/FAQs";
import ShippingPolicy from "./components/ShippingPolicy";
import PrivacyPolicy from "./components/PrivacyPolicy";
import Return from "./components/Return";
import Shop from "./components/Shop";
import Detail from "./components/Detail";
import Pay from "./components/Pay";
import Ce from "./components/Ce";
/*

import ShoppingCart from "./components/ShoppingCart";

import Query from "./components/Query";
import Blogs from "./components/Blogs";
import BlogsInfo from "./components/BlogsInfo";

import FAQs from "./components/FAQs";


import WarrantyPolicy from "./components/WarrantyPolicy";

import SetReview from "./components/SetReview";

import CoPromo from "./components/CoPromo";
import CoPromoPanel from "./components/CoPromoPanel";
import ControllerBorder from "./components/MyController/ControllerBorder";

import PhoneHome from "./components/Phone/PhoneHome";
import PhoneShop from "./components/Phone/PhoneShop";
import PhoneDetail from "./components/Phone/PhoneDetail";
import PhonePay from "./components/Phone/PhonePay";
import PhoneShoppingCart from "./components/Phone/PhoneShoppingCart";
import PhoneQuery from "./components/Phone/PhoneQuery";
import PhoneSetReview from "./components/Phone/PhoneSetReview";
import PhoneAbout from "./components/Phone/PhoneAbout";
import PhoneContact from "./components/Phone/PhoneContact";
import PhoneFAQs from "./components/Phone/PhoneFAQs";
import PhoneShippingPolicy from "./components/Phone/PhoneShippingPolicy";
import PhoneReturn from "./components/Phone/PhoneReturn";
import PhoneWarrantyPolicy from "./components/Phone/PhoneWarrantyPolicy";
import PhonePrivacyPolicy from "./components/Phone/PhonePrivacyPolicy";
import PhoneBlogs from "./components/Phone/PhoneBlogs";

import PhoneCoPromo from "./components/Phone/PhoneCoPromo";
import PhoneCoPromoPanel from "./components/Phone/PhoneCoPromoPanel";

*/

class Direction extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            viewSize :  document.body.clientWidth / window.screen.height
         };
    }

    componentDidMount(){
        
        window.addEventListener('resize', this.windowSize)
        initializeAnalytics()
    }

    windowSize=()=>{
        this.setState({
            viewSize : document.body.clientWidth > 900 ? document.body.clientWidth / window.screen.height : 0
        })
    }

    render() {
        return (
            <div id="pageSize">
                <Router>
                    <RoutesWithTracker viewSize={this.state.viewSize} />
                </Router>
            </div>
        );
    }
}

function RoutesWithTracker(props) {
    const location = useLocation();

    React.useEffect(() => {
        trackPageView(location.pathname);
    }, [location]);

    return (
        <Routes>
            <Route path="/" element={props.viewSize > 1 ? <Home /> : <Home />} />
            <Route path="/about" element={props.viewSize > 1?<About />:<About />} />
            <Route path="/about1" element={props.viewSize > 1?<About1 />:<About1 />} />
            <Route path="/contact" element={props.viewSize > 1?<Contact />:<Contact />} />
            <Route path="/FAQs" element={props.viewSize > 1?<FAQs />:<FAQs />} />
            <Route path="/shipping_policy" element={props.viewSize > 1?<ShippingPolicy />:<ShippingPolicy />} />
            <Route path="/return" element={props.viewSize > 1?<Return />:<Return />} />
            <Route path="/privacy_policy" element={props.viewSize > 1?<PrivacyPolicy />:<PrivacyPolicy />} />
            <Route path="/shop" element={props.viewSize > 1?<Shop />:<Shop />} />
            <Route path="/detail" element={props.viewSize > 1?<Detail />:<Detail />} />
            <Route path="/pay" element={props.viewSize > 1?<Pay />:<Pay />} />
            <Route path="/ce" element={props.viewSize > 1?<Ce />:<Ce />} />
        </Routes>
    );
}

export default Direction;
