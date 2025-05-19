import React,{Component} from "react";
import { Link } from "react-router-dom";
import "../../../assets/css/phone/detailComponentsCss/pRF6.css"
class PhoneRF6 extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }

    //添加购物车
    addToCart=(e)=>{
        this.props.addChildCartProInfo(e.target.value)
    }

    //点击刷新页面
    pageReload=(e)=>{
        window.location.href = `/detail?pdnum=${e.target.value}`
    }

    render() {
        return (
            <div>
                <div className="Pdetail-RF6-mobule-1">
                    <div className="Pdetail-RF6-mobule-1-text">
                        <h4>gentle with zero irritation</h4>
                        <p>
                            Maintains the skin's natural microenvironment
                            <br /><br />
                            Free from preservatives, heavy metals, alcohol, and other allergenic substances for the skin.
                            <br /><br />
                            Choose good ingredients and avoid selecting complex ones that may harm the skin. No need to worry about pore irritation or liquid residue causing bacterial growth.
                        </p>
                    </div>
                    <img src={require("../../../assets/images/RF6_1.jpg")} alt="gel picture"/>
                </div>
                

                <div className="Pdetail-RF3-3-moblue">
                    <h3>You Might Like</h3>
                    <div className="Pdetail-RF3-3-recom">
                        <div className="Pdetail-RF1-gel-info">
                            <div className="Pdetail-RF1-gel-text">
                                <h4>ZH - RF SKINCARE DEVICE</h4>
                                <p>
                                Comprehensively care for your facial skin, remove fine lines and wrinkles, tighten and brighten the skin, reduce inflammation and redness, etc. Slow down the aging process of facial skin.
                                </p>
                                <div className="Pdetail-RF1-recom-btn-mouble">
                                    <button value="pro1" onClick={this.addToCart}>Add To Cart</button>
                                    <button value="pro1" onClick={this.pageReload}>Learn More</button>
                                </div>
                            </div>
                            <img src={require("../../../assets/images/phoneImg/RF.png")} alt="Radio Frequency Beauty Device"/>
                        </div>
                        <div className="Pdetail-RF1-essence-info">     
                            <div className="Pdetail-RF1-essence-text">
                                <h4>PEPTIDE FIRMING ESSENCE</h4>
                                <p>
                                    Small molecules penetrate easily, deeply hydrating and moisturizing, bidding farewell to dryness, assisting in improving fine lines and achieving plump skin.
                                </p>
                                <div className="Pdetail-RF1-recom-btn-mouble">
                                    <button value="pro5" onClick={this.addToCart}>Add To Cart</button>
                                    <button value="pro5" onClick={this.pageReload}>Learn More</button>
                                </div>
                            </div>
                            <img src={require("../../../assets/images/phoneImg/essence.jpg")} alt="Peptide Firming Essence"/>
                        </div>
                    </div>
                </div>


            </div>
        );
    }
}

export default PhoneRF6;