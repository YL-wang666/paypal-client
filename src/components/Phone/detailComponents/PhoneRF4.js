import React,{Component} from "react";
import { Link } from "react-router-dom";
import "../../../assets/css/phone/detailComponentsCss/pRF4.css"
class PhoneRF4 extends Component {
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
                {/**直接用RF1模块 */}
                <div className="Pdetail-PRF4-colorLight-mobule">
                    <p>
                        <h4>Red Light</h4> 
                        Red light + vibration + Thermal skincare. Smooth fine lines, tighten skin, simple melanin fading
                    </p>
                    <p>
                        <h4>Blue Light</h4>
                        Blue light + vibration + EMS microcurrent. Suppress acne, purify skin, tighten pores, significantly improve oily skin
                    </p>
                    <p>
                        <h4>Green Light</h4>
                        Green light + vibration. Promote superficial microcirculation, enhance absorption, diminish wrinkles, rejuvenate skin
                    </p>
                </div>
                <div className="Pdetail-RF4-mobule-1">
                    
                    <div className="Pdetail-RF4-mobule-text">
                        <p className="Pdetail-RF4-mobule-text-p1">
                            <h4>Vibration & Hot Compress</h4>
                            Temporarily heating the skin to around 42 degrees Celsius may promote blood circulation, enhance skin metabolism, and improve the skin's ability to absorb skincare products. In addition to promoting blood circulation and enhancing absorption, sonic vibrations can also stimulate the production of collagen and elastin fibers, thus tightening the skin
                        </p>
                    </div>
                    <img src={require("../../../assets/images/controller.png")} alt="Neck lines , Fine lines"/>
                    <div className="Pdetail-RF4-mobule-text">
                        <p className="Pdetail-RF4-mobule-text-p2" alt="Neck lines , Fine lines">
                            <h4>Biophotonic Therapy</h4>
                            Biophotonic therapy is a method that utilizes specific wavelengths of light to treat skin issues, as different wavelengths have varying effects on the skin. Both our neck beautifier and radiofrequency beauty device incorporate biophotonic technology to assist in improving skin conditions
                        </p>
                    </div>
                    <img src={require("../../../assets/images/neckRed.png")}/>

                </div>
                
                {/**这就下面和RF3的一样就不改动了 */}
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

export default PhoneRF4;