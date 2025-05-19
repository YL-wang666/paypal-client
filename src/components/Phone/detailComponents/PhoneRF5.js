import React,{Component} from "react";
import { Link } from "react-router-dom";
import "../../../assets/css/phone/detailComponentsCss/pRF5.css"
class PhoneRF5 extends Component {
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
                
                <div className="Pdetail-RF5-mobule-1">
                    <h3>Key Ingredients</h3>
                    <div style={{width:"15%",height:"2px",backgroundColor:"black",margin:"auto",borderRadius:"50px"}}></div>
                    <div className="Pdetail-RF5-mobule-1-info">
                        <div>
                            <h4><span>4D</span> Hyaluronic Acid</h4>
                            <p>
                            Constructing a three-dimensional water storage sponge layer, layer by layer nourishing, for enhanced hydration and moisture retention
                            </p>
                        </div>
                        <img src={require("../../../assets/images/RF5_1.jpg")} alt="Hyaluronic Acid"/>
                        <div>
                            <h4><span>Complex</span> Peptides</h4>
                            <p>
                            Stimulate key components of the skin matrix, synthesize collagen, reduce wrinkles, and increase elasticity
                            </p>
                        </div>
                        <img src={require("../../../assets/images/RF5_3.jpg")} alt="Complex Peptides"/>
                        <div>
                            <h4><span>Trehalose</span></h4>
                            <p>
                            Deeply repair the moisturizing barrier, establish a water cycle, and rejuvenate the skin with abundant hydration
                            </p>
                        </div>
                        <img src={require("../../../assets/images/RF5_2.jpg")} alt="Trehalose"/>
                        <div>
                            <h4><span>Rose</span> Extract</h4>
                            <p>
                            Supplementing anthocyanins, bringing abundant rose polyphenols, improving radiance
                            </p>
                        </div>
                        <img src={require("../../../assets/images/RF5_4.jpg")} alt="Rose Extract"/>

                        
                        <div>
                            <h4 style={{marginTop:"15%"}}>✔ Natural Essential Oil Fragrances</h4>
                            <p>
                                Cinnamon Bark Oil , Osmanthus Oil , Lemongrass Oil , Rose Extract 
                            </p>
                        </div>
                        <img src={require("../../../assets/images/RF5_5.png")} alt=""/>
                        <div>
                            <h4 style={{marginTop:"15%"}}>✔ Free From Traditional Preservatives</h4>
                            <p>
                            Reduce the potential risk of skin allergies, and use with greater peace of mind
                            </p>
                        </div>
                        <img src={require("../../../assets/images/RF5_6.png")} alt=""/>
                    </div>
                    
                </div>

                {/**直接用的RF3的样式 */}
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
                                <h4>USE IN COMBINATION WITH GEL</h4>
                                <p>
                                To achieve better results with the radiofrequency beauty device, please apply the specialized gel first. The gel not only facilitates energy conduction but also provides timely hydration to the skin.
                                </p>
                                <div className="Pdetail-RF1-recom-btn-mouble">
                                    <button value="pro6" onClick={this.addToCart}>Add To Cart</button>
                                    <button value="pro6" onClick={this.pageReload}>Learn More</button>
                                </div>
                            </div>
                            <img src={require("../../../assets/images/product/pro6.png")} alt="Peptide Firming Essence"/>
                        </div>
                    </div>
                </div>


            </div>
        );
    }
}

export default PhoneRF5;