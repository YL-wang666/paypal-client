import React,{Component} from "react";
import PhoneHead from "./PhoneHead";
import PhoneFooter from "./PhoneFooter";
import { reactFacekookPixel } from "../publicCom/ReactFacekookPixel";
import "../../assets/css/phone/phoneShop.css";
import axios from "axios";
import { Link } from "react-router-dom";
class PhoneShop extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            curr: localStorage.getItem("curr")?localStorage.getItem("curr"):"$",
            currNum : localStorage.getItem("currNum")?localStorage.getItem("currNum"):1,
            ISO : localStorage.getItem("ISO")?localStorage.getItem("ISO"):"USD",
            productArr : [{"indent":"","img":"pro1.png","title":"ZH - Home RF Beauty Device","func":"Reduce nasolabial lines , Color light skin rejuvenation , Tighten the skin,Nutrient delivery","sale":209,"delete_sale":259,"off":"50"}],
                FAQs:[{"title":"Will using a beauty device cause irreversible damage?","text":"Home radiofrequency beauty devices typically consider safety concerns, so they usually have lower power compared to those used in professional settings. However, the reliability of the product's temperature control system is crucial. If the temperature control is unreliable, the beauty device may expose the skin to temperatures as high as 70°C, leading to burns. Our radiofrequency beauty device has reliable safety features, so you can use it with peace of mind!"},
                      {"title":"What should be paid attention to when using radiofrequency beauty devices?","text":"1.Carefully read the instruction manual before using the device <br />2.Ensure the skin is clean<br /> 3.Use a conductive gel <br />4.Start with the lowest intensity and gradually adapt<br /> 5.Continuously move during use to ensure even heating of the skin<br /> 6.Avoid prolonged use in a single session"},
                      {"title":"Who should avoid using radiofrequency beauty devices?","text":"1.Individuals using medical electronic devices such as pacemakers or artificial cardiopulmonary machines should avoid using it.<br /><br />2.Those with skin diseases, hypertension, internal organ diseases, or telangiectasia should use it with caution.<br /><br />3.It is not recommended for use during pregnancy, menstruation, or lactation.<br /><br />4.After medical cosmetic procedures such as water injection, thread lifting, or photorejuvenation, please consult your physician.<br /><br />5.Those with allergies, sensitive or fragile skin, or allergies to metal materials should use it with caution.<br /><br />6.Those wearing contact lenses, with nearsightedness greater than 600, or with eye diseases such as cataracts, glaucoma, or retinal hemorrhage should use it with caution. Consult a doctor for use during the eye recovery period after surgery.<br /><br />7.Individuals with melasma should not use it."} ,
                      {"title":"Are home radiofrequency beauty devices the same as clinic-grade radiofrequency devices?","text":"Home radiofrequency devices and professional clinic devices both utilize radiofrequency technology to heat the collagen in the dermis, thereby inducing collagen contraction and regeneration. However, they differ in terms of frequency, power, and safety. <br /><br />Clinic devices typically employ single-frequency radiofrequency technology with higher power levels and are operated by trained medical professionals or technicians. As a result, they yield noticeable results after a single session but also carry certain risks.<br /><br />In contrast, home radiofrequency devices usually use dual or multi-frequency technology with lower power levels, prioritizing safety. Consequently, home devices require continuous use over a period of time to achieve desired results, but they are relatively safer."} ,
                      {"title":"Can other substitutes be used instead of gel?","text":"Some individuals may attempt to use other alternatives. Some people use transparent water-based gel or lotions containing water as substitutes. However, it's important to note that these alternatives may not be as effective as specialized conductive gels, leading to poor conduction of radiofrequency waves and potentially affecting the beauty results. Additionally, using untested substitutes may increase the risk of skin discomfort or allergic reactions"},
                      {"title":"How long does delivery take?","text":"Usually 8-15 days"},
                      {"title":"About shipping cost?","text":"We offer free shipping"} ,
                      {"title":"Regarding taxes?","text":"Our prices include taxes"},
                      {"title":"How to process returns and exchanges?","text":"You can contact us for returns and exchanges within 45 days at <b><a href='mailto:after-sales@jendey.com'>after-sales@jendey.com</a></b>"},
                      {"title":"What is your warranty policy?","text":"Within the one-year warranty period, if there is non-human damage, please contact <b><a href='mailto:after-sales@jendey.com'>after-sales@jendey.com</a></b>, and we will confirm with you"}
                    ],
                    description: "A store offering beauty devices, skincare products, and treatments for skin rejuvenation, facial firming, and facial lifting"
         };
    }

    componentDidMount(){
        document.querySelector('meta[name="description"]').setAttribute("content", this.state.description);
        document.addEventListener("scroll",this.shopScrollShow)
        //获取产品信息
        this.getProductInfo()

        this.pageLoad()
    }

    pageLoad=()=>{
        axios.post("/api/page_click",{
            page : "PhoneShop"
        })
    }

    //获取产品信息
    getProductInfo=()=>{
        axios.post("/api/get_all_Product")
        .then((response)=>{
            this.setState({
                productArr : response.data
            })
        })
    }

    shopScrollShow=()=>{
        if(document.getElementById("shop-activity-mobule").offsetTop - document.documentElement.scrollTop - document.documentElement.clientHeight  <= 0){
            document.getElementById("shop-activity-move").className = "shop-activity-move"
            document.removeEventListener("scroll",this.shopScrollShow)
        }
    }

    //改变货币时改变页面所有货币和金额
    headCurrChange=(curr,currNum,ISO)=>{
        this.setState({
            curr : curr,
            currNum : currNum,
            ISO : ISO
        })
        
    }

    changeBackwhite=(e)=>{
        e.currentTarget.style.backgroundColor = "white"
    }

    changeBackOp=(e)=>{
        if(document.documentElement.scrollTop <= 10){
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.005)"
        }
        
    }

    //要调用子组件head方法要用ref
    headRef = (ref) => {
        this.childhead = ref
    }

    //要调用子组sign件的方法
    onRef = (ref) => {
        this.child = ref
    }
    
    signUp=()=>{
        this.child.parentSubscribe(document.getElementById("home-email-input").value)
    }

    //改变按钮样式
    onMouseEnterBtn=(e)=>{
        for(let i = 1 ; i <= 100 ; i++){
            setTimeout(()=>{
                e.target.style.backgroundImage = `linear-gradient(90deg, #d10483 0, #d10483 ${i}%, black 0, black 100%)`
            },i*3)
            
        }
    }

    onMouseLeaveBtn=(e)=>{
        for(let i = 0 ; i <= 100 ; i++){
            setTimeout(()=>{
                e.target.style.backgroundImage = `linear-gradient(-90deg, black 0, black ${i}%, #d10483 0, #d10483 100%)`
            },i*3)
            
        }
    }

    showFAQAns=(e)=>{
        let value = e.currentTarget.getAttribute("value")
        if(document.getElementById("shop-FAQ-show-btn" + value).outerText === "+"){
            document.getElementById("shop-FAQ-show-btn" + value).innerHTML = "-"
            document.getElementById("FAQ-ans" + value).style.display = "block"
        }
        else{
            document.getElementById("shop-FAQ-show-btn" + value).innerHTML = "+"
            document.getElementById("FAQ-ans" + value).style.display = "none"
        }

    }

    //点击产品跳转详情页面
    turnDetailPage=(e)=>{
        window.location.href = `detail?pdnum=pro${e.target.getAttribute("value")}`
    }

    //添加购物车产品信息
    addCartProInfo=(e)=>{
        reactFacekookPixel("AddToCart")
        this.childhead.shoppingAddCart(e.target.value + "=" + "1")
        //购物车的产品数据传到后台
        axios.post("/api/cart_click",{
            proId : e.target.value
        })
    }

    //跳转时就是该组件销毁时清除掉本组件的监听
    componentWillUnmount(){
        document.removeEventListener("scroll",this.shopScrollShow)
    }


    render() {
        return (
            <div>
                <div id="head-fixed" className="Phead-fixed" onMouseEnter={this.changeBackwhite} onMouseLeave={this.changeBackOp}>
                    <PhoneHead name="shop" headRef={this.headRef} ISO={this.state.ISO} headCurrChange={this.headCurrChange} shopScrollShow={this.shopScrollShow}/>
                </div>
                <img style={{width:"100%",marginTop:"28%"}} src={require("../../assets/images/phoneImg/shopBack1.jpg")} alt="Skincare routine" />
                <div className="Pshop-product-mobule">
                    {
                        this.state.productArr.map((value , key)=>{
                            return <div className="Pshop-product-info" key={key}>
                                        <div style={value.off === "0"?{display:"none"}:{}} className="Pshop-product-off-label">{value.off === "0"? "" : `$${value.off} OFF`}</div>
                                        <img className="Pshop-product-img" value={key + 1} onClick={this.turnDetailPage} src={require("../../assets/images/product/" + value.img)} alt={value.title + value.func} />
                                        <div>
                                            <h3>{value.title}</h3>
                                            <p>{value.func}</p>
                                            <div style={{paddingLeft:"25%",marginTop:"5%"}}><b>{this.state.curr}{(value.sale*this.state.currNum).toFixed(2)}</b><span style={value.delete_sale  === "0"?{display:"none"}:{}}>{this.state.curr}{(value.delete_sale*this.state.currNum).toFixed(2)}</span></div>
                                            <div className="Pshop-product-btn-mobule">
                                                <button value={value.indent} onClick={this.addCartProInfo} onMouseEnter={this.onMouseEnterBtn} onMouseLeave={this.onMouseLeaveBtn}>Add to Cart</button>
                                                <button value={key + 1} onClick={this.turnDetailPage} onMouseEnter={this.onMouseEnterBtn} onMouseLeave={this.onMouseLeaveBtn}>Learn More</button>
                                            </div>
                                        </div>
                                    </div>
                        })
                    }
                    
                </div>

                <div id="shop-activity-mobule" className="Pshop-activity-mobule">
                    <img style={{width:"100%"}} src={require("../../assets/images/phoneImg/salesLeft.jpg")} />
                    <div className="Pshop-activity-left">
                        <div id="shop-activity-move" className="Pshop-activity-hidden">
                            <h3>Before December 25, 2024</h3>
                            <div className="Pshop-activity-info">
                                <div>
                                    <p>Discount </p>
                                    Beauty device discounted by<br/><br /> <b>$50</b>
                                </div>
                                <div style={{backgroundColor:"white"}}></div>
                                <div style={{paddingLeft:"8%"}}>
                                    <p>Co-Promo </p>
                                    We offer a 15% return on collaborative promotions with us<br />
                                    <Link rel="noopener noreferrer" rel="noreferrer" to="/copromo"><button>Learn More</button></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="Pshop-FAQ-mobule">
                    <h3>FAQs</h3>
                    <div className="Pshop-FAQ-info">
                        {
                            this.state.FAQs.map((value , key)=>{
                                return <div className="Pshop-FAQ-text">
                                            <div value={key} onClick={this.showFAQAns} className="Pshop-FAQ-title">
                                                <h4>{value.title}</h4>
                                                <div id={"shop-FAQ-show-btn"+key} className="Pshop-FAQ-show-btn">+</div>
                                            </div>
                                            <p id={"FAQ-ans"+key} dangerouslySetInnerHTML={{__html:value.text}} ></p>
                                        </div>
                            })
                        }
                    </div>
                </div>
                <div className="Pshop-nav">
                    <div><Link rel="noopener noreferrer" rel="noreferrer" target="_blank" to="/"><i>Home</i></Link></div><div>{" › "}</div>
                    <div><Link rel="noopener noreferrer" rel="noreferrer" target="_blank" to="/shop"><i>Shop</i></Link></div>
                </div>
                <PhoneFooter name="shop" onRef={this.onRef} ISO={this.state.ISO} headCurrChange={this.headCurrChange}/>
            </div>
        );
    }
}

export default PhoneShop;