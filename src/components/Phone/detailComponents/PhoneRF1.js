import React,{Component} from "react";
import { Link } from "react-router-dom";
import "../../../assets/css/phone/detailComponentsCss/pRF1.css";
class PhoneRF1 extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            //控制图片变换方向
            toDir      : -1,
            moveNum    : 0,
         };
    }


    //切换效果图
    changeEffect=(e)=>{
        //如果当前鼠标进入的按钮与图片对应就不变化
        if(e.target.value === "redImg" && this.state.toDir === -1){
            return
        }
        if(e.target.value === "blueImg" && this.state.toDir === 1){
            return
        }
        document.getElementById("detail-red-btn").style.backgroundColor = "white"
        document.getElementById("detail-red-btn").style.color = "black"
        document.getElementById("detail-blue-btn").style.backgroundColor = "white"
        document.getElementById("detail-blue-btn").style.color = "black"
        e.target.style.backgroundColor = "#d10483"
        e.target.style.color = "white"
        document.getElementById("detail-redImg").style.backgroundColor = "rgb(221, 205, 205)"
        document.getElementById("detail-blueImg").style.backgroundColor = "rgb(221, 205, 205)"
        document.getElementById("detail-"+e.target.value).style.backgroundColor = "#d10483"
        for(let i = 1 ; i <= 100 ; i++){
            setTimeout(()=>{
                document.getElementById("detail-effect-move-img").style.marginLeft = `${this.state.moveNum - i*this.state.toDir}%`
            },i*2) 
        }
        this.setState({
            toDir : e.target.value === "redImg" ? -1 : 1,
            moveNum : e.target.value === "redImg" ? -100 : 0
        })
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
                <div className="Pdetail-colorLight-mobule">
                <video src={require("../../../assets/images/RF1_1.mp4")} style={{width:"100%",height:"100%"}} autoplay="autoplay" loop="loop" muted="muted"></video>
                    <div>
                        <div>
                            <h4>Red Light</h4>
                            <p id="detail-red-text" className="RF1-light-text">Dynamic radiofrequency directly targets the dermis, allowing regenerated collagen to combat wrinkles and tighten your skin</p>
                        </div>
                        <div>
                            <h4>Blue Light</h4>
                            <p id="detail-blue-text" className="RF1-light-text">470nm blue light ion cleansing, reduces oil secretion, clears pores, anti-inflammatory and removes acne</p>
                        </div>
                        <div>
                            <h4>Yellow Light</h4>
                            <p id="detail-yellow-text" className="RF1-light-text">Diminishes scars, brightens complexion, reduces redness. Can be left slightly longer on areas of dullness, pigmentation, and scars</p>
                        </div>
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
                    <video src={require("../../../assets/images/RF2.mp4")} style={{width:"100%",height:"100%",objectFit:"none"}} autoplay="autoplay" loop="loop" muted="muted"></video>
                </div>

                <div className="Pdetail-effect-mouble">
                    <div className="Pdetail-effect-left">
                        <h4>40-Day Test</h4>
                        <p>Here's the effect after 40 days of use by volunteers. Because everyone's skin condition is different, the time to achieve the effect varies from person to person</p>
                        <div className="Pdetail-effect-btn-mobule">
                            <button id="detail-red-btn" value="redImg" onMouseEnter={this.changeEffect} style={{backgroundColor:"#d10483",color:"white"}}>Facial lifting</button>
                            <button id="detail-blue-btn" value="blueImg" onMouseEnter={this.changeEffect} style={{marginTop:"3%"}}>Get rid of acne</button>
                        </div>
                    </div>
                    <div>
                        <div className="Pdetail-effect-img-mobule">
                            <div id="detail-effect-move-img" className="Pdetail-effect-move-img">
                                <img  src={require("../../../assets/images/redImg.jpg")} alt="anti-aging,Anti-inflammatory acne treatmen"/>
                                <img  src={require("../../../assets/images/blueImg.jpg")} alt="anti-aging,Anti-inflammatory acne treatmen"/>
                            </div>
                        </div>
                        <div style={{display:"grid",gridTemplateColumns:"17% 17%",marginTop:"10px",marginLeft:"40%"}}>
                            <div id="detail-redImg" className="Pdetail-effect-sign" style={{backgroundColor:"#d10483"}}></div>
                            <div id="detail-blueImg" className="Pdetail-effect-sign"></div>
                        </div>
                    </div>
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

export default PhoneRF1;