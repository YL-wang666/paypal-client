import React,{Component} from "react";
import { Link } from "react-router-dom";
import "../../../assets/css/phone/detailComponentsCss/pRF2.css";
class PhoneRF2 extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            
         };
    }


    //动态切换全文
    showAllText=()=>{
        let doc = document.getElementById("detail-rest-summarize")
        for(let i = 1 ; i <= 100 ; i++){
            setTimeout(()=>{
                doc.style.opacity = `${1 -  i*0.01}`
                document.getElementById("detail-rest-info").style.height = `${500 + 2*i}px`
                if(i == 100){
                    doc.style.display = "none"
                    document.getElementById("detail-rest-all-title").style.display = "block"
                    document.getElementById("detail-rest-info").style.height = "100%"
                    document.getElementById("detail-rest-text-all").className = "detail-rest-text-all"
                }
            },i*3)
        }
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
                <div className="Pdetail-RF2-colorLight-mobule">
                    <div>
                        <p>
                            <h4>Red Light</h4>
                            Dynamic radiofrequency directly targets the dermis, allowing regenerated collagen to combat wrinkles and tighten your skin
                        </p>
                    </div>
                    <div>
                        <p>
                            <h4>Blue Light</h4>
                            465 ± 3nm blue light + vibration + magnetic absorption design. Makeup removal cleansing, deep cleaning of facial skin, reducing oil secretion
                        </p>
                    </div> 
                </div>

                <div className="Pdetail-RF2-effect">
                    <div>
                        <h3>Delay the aging of your facial skin</h3>
                        <img src={require("../../../assets/images/product/detail/pro2/p11.jpg")} alt="facial skin"/>
                        <p>
                            Improving the skin takes time, and according to feedback from numerous users, significant results can be seen around 40 days. Of course, everyone's skin is different, so results may vary
                        </p>
                    </div>
                    
                </div>

                <div className="Pdetail-order-mobule">
                    <div className="Pdetail-order-text">
                        <h2>Facial Skin Issues</h2>
                        <p>
                            Once women reach the age of 28, facial skin may start to show issues such as dryness, fine lines, and dullness, due to the loss of collagen. Collagen, a vital protein in the skin, plays a crucial role in providing structural support and elasticity. As age advances, collagen gradually diminishes, resulting in loss of skin firmness and elasticity.
                            <br /><br />
                            Using a radiofrequency skincare device can stimulate collagen regeneration to some extent, aiding facial skin. However, it's worth noting that this process may take some time to yield noticeable results.
                        </p>
                    </div>
                    <video src={require("../../../assets/images/RF2.mp4")} style={{width:"100%",height:"100%",objectFit:"none",position:"absolute",top:"0%",left:"0"}} autoplay="autoplay" loop="loop" muted="muted"></video>
                </div>

                <h3 className="Pdetail-RF1-recom-title">Recommended Sets</h3>
                <div className="Pdetail-gel-mobule">
                    <div className="Pdetail-RF1-gel-info">
                        <div className="Pdetail-RF1-gel-text">
                            <h4>USE IN COMBINATION WITH GEL</h4>
                            <p>
                            To achieve better results with the radiofrequency beauty device, please apply the specialized gel first. The gel not only facilitates energy conduction but also provides timely hydration to the skin.
                            </p>
                            <div className="Pdetail-RF1-recom-btn-mouble">
                                <button value="pro6" onClick={this.addToCart}>Add To Cart</button>
                                <button value="pro6" onClick={this.pageReload}>Learn More</button>
                            </div>
                        </div>
                        <img  src={require("../../../assets/images/product/pro6.png")} alt="use in combination with gel"/>
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
        );
    }
}

export default PhoneRF2;