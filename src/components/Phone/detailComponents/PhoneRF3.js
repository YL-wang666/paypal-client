import React,{Component} from "react";
import { Link } from "react-router-dom";
import "../../../assets/css/phone/detailComponentsCss/pRF3.css"
class PhoneRF3 extends Component {
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
                <div className="Pdetail-RF3-mobule-1">
                    <div className="Pdetail-RF3-mobule-1-text">
                        <h4>Common eye area issues</h4>
                        <p>
                            Facial aging often begins with the skin around the eyes, as it is the thinnest in this area, making it the most prominent.
                            <br /><br />
                            These issues are often caused by staying up late, excessive fatigue leading to slow venous circulation and excessive accumulation of metabolic waste, or by the skin around the eyes being unable to absorb nutrients or losing moisture, resulting in loss of elasticity.
                        </p>
                    </div>
                    <img src={require("../../../assets/images/pro3_1.jpg")} alt="Common eye area issues"/>
                </div>
                <div className="Pdetail-RF3-mobule-2">
                    <div className="Pdetail-RF3-mobule-2-text">
                        <h4>use the illustrated guide</h4>
                        <p>
                            The beauty eye device not only helps improve issues such as dark circles, eye bags, and wrinkles around the eyes, but also softens the lip's keratin and plumps the lips.
                            <br /><img style={{width:"10%",marginLeft:"40%",marginTop:"3%",marginBottom:"3%"}} src={require("../../../assets/images/down.png")} alt=""/>
                            <br />Here is our operational suggestion for your reference. In addition to this, you can also refer to the instruction manual and adapt the usage to your own situation.
                        </p>
                    </div>
                    <img src={require("../../../assets/images/pro3_2.jpeg")} alt="Dark circles , Eye bags,Crow's feet"/>
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

export default PhoneRF3;