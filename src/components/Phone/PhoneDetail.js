import React,{Component} from "react";
import PhoneHead from "./PhoneHead";
import PhoneFooter from "./PhoneFooter";
import Review from "../Review";
import Page from "../Page";
import "../../assets/css/phone/phoneDetail.css";
import { Link } from "react-router-dom";
import { reactFacekookPixel } from "../publicCom/ReactFacekookPixel";

import PhoneRF1 from "./detailComponents/PhoneRF1";
import PhoneRF2 from "./detailComponents/PhoneRF2";
import PhoneRF3 from "./detailComponents/PhoneRF3";
import PhoneRF4 from "./detailComponents/PhoneRF4";
import PhoneRF5 from "./detailComponents/PhoneRF5";
import PhoneRF6 from "./detailComponents/PhoneRF6";

import axios from "axios";
class PhoneDetail extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            curr: localStorage.getItem("curr")?localStorage.getItem("curr"):"$",
            currNum : localStorage.getItem("currNum")?localStorage.getItem("currNum"):1,
            ISO : localStorage.getItem("ISO")?localStorage.getItem("ISO"):"USD",
            nowProduct : {"indent":"load","title":"","sale":"","delete_sale":"","video_img":"load.jpg","video":"load.jpg","img_arr":"load.jpg","functions":"","choose":"load.jpg","child_component":"","avgReview":5.0,"reviewSum":0},
            imgIconArr : [],
            imgIconPth : 0,
            choosePth  : 1,
            buySum     : 1,
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
            reviewInfo : [{"indent":"","review_text":"","review_username":"","review_score":"5","review_img":""}],
            pageSum   : 1,
            nowComponent : "",
            //用来标记是否加载
            isMobuleLoad_1 : false,
            isMobuleLoad_2 : false,
            description: "Jendey's multifunctional beauty device combines features such as wrinkle reduction, facial lifting, LED photon skin rejuvenation, and more"
         };
    }

    componentDidMount(){
        document.querySelector('meta[name="description"]').setAttribute("content", this.state.description);
        if(window.location.search){
            let pdnum = window.location.search.split("?pdnum=")[1].split("&cou=")[0];
            //将推广人的cou本地储存
            localStorage.setItem("cou" , window.location.search.split("?pdnum=")[1].split("&cou=")[1])
            //获取详情信息
            this.getDetailInfo(pdnum)
            
        }
        else{
            //没有参数的情况就获取 pro1
            this.getDetailInfo("pro1") 
        }

        //添加监听来变换浮动模块的位置
        document.addEventListener("scroll",this.payScrollShow)
        document.addEventListener("scroll",this.lazyLoad)

    }

    getDetailInfo=(e)=>{
        axios.post("/api/get_detail_product",{
            indent : e
        })
        .then((response)=>{
            this.setState({
                nowProduct : response.data,
                imgIconArr : response.data.img_arr.split(",")
            },
                ()=>{
                    //选择第一个
                    document.getElementsByClassName("Pdetail-choose-pth-img")[0].style.border = "1.5px #d10483 solid"
                    //产品点击数据上传
                    this.pageLoad()
                }
            )
        })
    }

    lazyLoad=()=>{
        if(document.getElementById("PhoneDetail-load-1").offsetTop - document.documentElement.scrollTop - document.documentElement.clientHeight  <= 0 && document.getElementById("PhoneDetail-load-2").offsetTop - document.documentElement.scrollTop - document.documentElement.clientHeight  > 0){
            if(!this.state.isMobuleLoad_1){
                this.getChildCompoent()
                this.setState({
                    isMobuleLoad_1 : true
                })
            }
        }
        if(document.getElementById("PhoneDetail-load-2").offsetTop - document.documentElement.scrollTop - document.documentElement.clientHeight <= 0){
            if(!this.state.isMobuleLoad_2){
                //将评论页数传给page组件显示分页按钮
                this.changePage(Math.ceil(this.state.nowProduct.reviewSum / 5))
                //获取第一页评论
                this.getReviewList()

                this.setState({
                    isMobuleLoad_2 : true
                })
            }
        }
    }

     //点击次数数据
     pageLoad=()=>{
        axios.post("/api/pro_click",{
            proId : this.state.nowProduct.indent,
            cou : localStorage.getItem("cou"),
            page : "PhoneDetail"
        })
       
    }

    //获取产品对应的介绍页面
    getChildCompoent=()=>{
        const compo = {"RF1":<PhoneRF1 addChildCartProInfo={this.addChildCartProInfo}/>,
                        "RF2":<PhoneRF2 addChildCartProInfo={this.addChildCartProInfo}/>,
                        "RF3":<PhoneRF3 addChildCartProInfo={this.addChildCartProInfo}/>,
                        "RF4":<PhoneRF4 addChildCartProInfo={this.addChildCartProInfo}/>,
                        "RF5":<PhoneRF5 addChildCartProInfo={this.addChildCartProInfo}/>,
                        "RF6":<PhoneRF6 addChildCartProInfo={this.addChildCartProInfo}/>
                    }
        this.setState({
            nowComponent : compo[this.state.nowProduct.child_component]
        })
    }

    //获取评论
    getReviewList=(e)=>{
        let pageNum = e?e:1
        axios.post("/api/get_review",{
            indent : this.state.nowProduct.indent,
            pageNum : pageNum,
            pageSum : 5
        })
        .then((response)=>{
            this.setState({
                reviewInfo : response.data
            })
        })
    }

    //改变货币时改变页面所有货币和金额
    headCurrChange=(curr,currNum,ISO)=>{
        this.setState({
            curr : curr,
            currNum : currNum,
            ISO : ISO,
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
    

    //切换图片展示
    showPicture=(e)=>{
        document.getElementById("detail-display-img").src = e.target.src
        const doc = document.getElementsByClassName("Pdetail-icon-img")
        for(let i = 0;i < doc.length;i++){
            doc[i].style.border = "none"
        }
        e.target.style.border = "1px #d10483 solid"
    }

    //点击选择图片
    chooseProduct=(e)=>{
        document.getElementById("detail-display-img").src = e.target.src
        const doc = document.getElementsByClassName("Pdetail-choose-pth-img")
        for(let i = 0;i < doc.length;i++){
            doc[i].style.border = "none"
        }
        e.target.style.border = "2px #d10483 solid"
        this.setState({
            choosePth : e.target.getAttribute("value")
        })
    }

    //显示视频
    showVideo=()=>{
        document.getElementById("detail-video").src = document.getElementById("detail-video").getAttribute("data")
        document.getElementById("detail-video-mobule").style.display = "block"
    }
    
    //关闭视频
    closeVideo=()=>{
        document.getElementById("detail-video").pause()
        document.getElementById("detail-video-mobule").style.display = "none"
    }

    //点击改变数量的增加或减少的按钮
    changeBuySum=(e)=>{
        if(e.target.value === "add"){
            this.setState({
                buySum : this.state.buySum === 9?9:this.state.buySum + 1
            })
            return
        }
        if(e.target.value === "down"){
            this.setState({
                buySum : this.state.buySum === 1?1:this.state.buySum - 1
            })
            return
        }
        if(Number(e.target.value) || e.target.value === ""){
            if(e.target.value === ""){
                this.setState({
                    buySum : ""
                })
                return
            }
            this.setState({
                buySum : e.target.value <= 0?1:(e.target.value > 9?9:e.target.value)
            })
        }
        
    }

    //如果输入框里面删除没有数字，那么默认自动添写1
    onBlurBuySum=(e)=>{
        if(e.target.value === ""){
            this.setState({
                buySum : 1
            })
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

    //总页数传给分页组件
    changePage = (countPage) => {
        this.child.getCountPage(countPage)
    }

    //点击页码后传回父组件
    getPageInfo=(pageNum)=>{
        //根据页码获取相应的信息
        this.getReviewList(pageNum)
    }

    onRef = (ref) => {
        this.child = ref
    }

    //添加购物车产品信息
    addCartProInfo=()=>{
        reactFacekookPixel("AddToCart")
        this.childhead.shoppingAddCart(this.state.nowProduct.indent + "=" + this.state.choosePth)
        //购物车的产品数据传到后台
        axios.post("/api/cart_click",{
            proId : this.state.nowProduct.indent
        })
    }

    //6个子组件在点击推荐产品加入购物车时调佣这个方法
    addChildCartProInfo=(e)=>{
        this.childhead.shoppingAddCart(e + "=" + "1")
    }

    buyNow=()=>{
        reactFacekookPixel("InitiateCheckout")
        window.location.href = `/pay?payNum=b${this.state.nowProduct.indent}=${this.state.choosePth}s${this.state.buySum}`
    }

    //悬浮支付
    payScrollShow=()=>{
        if(document.getElementById("PDeatil-fixed-pay-btn-show-point").offsetTop < document.documentElement.scrollTop ){
            
            if(document.getElementById("PDeatil-fixed-pay-btn-show-point-2").offsetTop - document.documentElement.scrollTop - document.documentElement.clientHeight  <= 0){
                document.getElementById("PDetail-fixed-pay-btn").style.display = "none"
            }
            else{
                document.getElementById("PDetail-fixed-pay-btn").style.display = "grid"
            }

        }
        else{
            document.getElementById("PDetail-fixed-pay-btn").style.display = "none"
        }
    }

    //跳转时就是该组件销毁时清除掉本组件的监听
    componentWillUnmount(){
        document.removeEventListener("scroll",this.payScrollShow)
        document.removeEventListener("scroll",this.lazyLoad)
    }

    render() {
        return (
            <div>
                <div id="head-fixed" style={{borderBottom:"0.2px gray solid"}} className="Phead-fixed"><PhoneHead name="detail" headRef={this.headRef} ISO={this.state.ISO} headCurrChange={this.headCurrChange} /></div>
                <div className="Pdetail-product-mobule">
                    <div className="Pdetail-product-img-mobule">
                        {/**这个div是播放视频的，刚开始是隐藏的，只有点击会出现 */}
                        <div id="detail-video-mobule" className="Pdetail-video-mobule">
                            <button onClick={this.closeVideo} className="Pdetail-close-video-btn">X</button>

                            <video id="detail-video" 
                                src=""
                                data={this.state.nowProduct.video ? require("../../assets/images/product/detail/"+this.state.nowProduct.indent+"/"+this.state.nowProduct.video) : ""} 
                                style={{width:"94%",marginLeft:"3%",marginTop:"30%",border:"1.5px whitesmoke solid",borderRadius:"10px"}} 
                                controls 
                            /> 

                        </div>
                        {/**这个是大图，显示小图标的图片 */}
                        <img id="detail-display-img"  className="Pdetail-display-img" src={require("../../assets/images/product/detail/"+this.state.nowProduct.indent+"/p1.jpg")} alt={this.state.nowProduct.title + "picture"} />
                        {/**这是大图下面小图标 */}
                        <div className="Pdetail-img-bottom-mobule">
                            <div style={{width:"100%",overflow:"hidden",marginLeft:"6px"}}>
                                <div id="detail-icon-mobule" className="Pdetail-icon-mobule">
                                    <img className="Pdetail-video-icon-btn" onClick={this.showVideo} style={this.state.nowProduct.video_img?{}:{display:"none"}} src={this.state.nowProduct.video_img?require("../../assets/images/product/detail/"+this.state.nowProduct.indent+"/"+this.state.nowProduct.video_img) : ""} alt="product video" />
                                    {
                                        this.state.imgIconArr.map((value)=>{
                                            return <img className="Pdetail-icon-img" onClick={this.showPicture} src={require("../../assets/images/product/detail/"+this.state.nowProduct.indent+"/"+value)} alt="skincare picture"/>
                                        })
                                    }
                                </div>
                            </div>
                        </div>

                    </div>

                    {/**这是右边产品信息 */}
                    <div className="Pdetail-product-info-mouble">
                        <h1>{this.state.nowProduct.title}</h1><br />
                        <Review  score = {this.state.nowProduct.avgReview === 0.0 ? "5" : this.state.nowProduct.avgReview} /><span style={{fontSize:"18px",fontWeight:"600",color:"gray"}}> ({this.state.nowProduct.avgReview === 0.0 ? "Currently no comments" : this.state.nowProduct.avgReview})</span><br />
                        <div className="Pdetail-info-price-mobule">
                            <div className="Pdetail-price">{this.state.curr}{Number(this.state.nowProduct.sale*this.state.currNum).toFixed(2)}</div>
                            <div style={Number(this.state.nowProduct.delete_sale) === 0?{display:"none"}:{}} className="detail-delete-price">{this.state.curr}{Number(this.state.nowProduct.delete_sale*this.state.currNum).toFixed(2)} </div>
                            <div style={Number(this.state.nowProduct.delete_sale) === 0?{display:"none"}:{}} className="detail-save">SAVE ${Number(this.state.nowProduct.delete_sale) - Number(this.state.nowProduct.sale)}</div>
                        </div>
                        <div className="Pdetail-line"></div>
                        <div className="Pdetail-func-mobule">
                            <h3>All-In-One</h3>
                            {
                                this.state.nowProduct.functions.split("|").map((value)=>{
                                    return <div className="Pdetail-func-info">
                                                <div></div>
                                                <p>{value}</p>
                                            </div>
                                })
                            }
                        </div>
                        <div className="Pdetail-line"></div>

                        <div id="PhoneDetail-load-1"></div>

                        <div className="Pdetail-choose-mobule">
                            <div>
                                <h3>Choose :</h3>
                                <div className="Pdetail-choose-img">
                                    {
                                        this.state.nowProduct.choose.split(",").map((value , key)=>{
                                            return <img className="Pdetail-choose-pth-img" value={key+1} onClick={this.chooseProduct} src={require("../../assets/images/product/detail/"+this.state.nowProduct.indent+"/"+value)}/>
                                        })
                                    }
                                    
                                </div>
                            </div>
                            <div className="Pdetail-qty-mobule">
                                <h3>Quantity :</h3>
                                <div className="Pdetail-qty-info">
                                    <input onBlur={this.onBlurBuySum} onChange={this.changeBuySum} value={this.state.buySum} className="Pdetail-qty-input" />
                                    <button value="down" onClick={this.changeBuySum} className="Pdetail-qty-Subtract-btn">–</button>
                                    <button value="add" onClick={this.changeBuySum} className="Pdetail-qty-add-btn">+</button>
                                </div>
                            </div>
                        </div>

                        <button className="Pdetail-cart-btn" onClick={this.addCartProInfo}>ADD TO CART</button>
                        <button className="Pdetail-pay-btn" onClick={this.buyNow}>BUY NOW</button>

                        <div id="PDeatil-fixed-pay-btn-show-point"></div>

                        <div className="Pdetail-promise-mobule">
                            <div>
                                <svg t="1707293273688" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2367" width="40" height="40"><path d="M389.569702 659.184529l-19.493957-41.257051H384.103143l6.497985 15.832393c1.856567 4.796132 3.609992 9.385979 5.621273 14.388397h0.360999c2.011281-5.157131 3.970991-9.592264 5.827559-14.388397l6.497985-15.832393h13.511685l-19.5971 41.257051v23.774375h-13.253827zM429.640612 617.979049h39.864626v10.829976h-26.868655v15.007252h22.794521v10.881547h-22.794521v17.379533h27.84851v10.881547h-40.844481v-64.979855zM514.114424 666.30137h-21.092667l-4.538276 16.657534h-13.202256l20.628525-64.979855h15.471394l20.628526 64.979855h-13.356971z m-2.836422-10.314263l-1.908139-7.116841c-2.011281-6.755842-3.764706-14.233683-5.724416-21.247381h-0.360999c-1.650282 7.116841-3.558421 14.491539-5.518131 21.247381l-1.908138 7.116841zM575.329573 682.958904l-13.35697-24.599516h-9.02498v24.599516h-12.995971v-64.979855h22.639807c13.614827 0 24.393231 4.744561 24.393231 19.700242a18.514102 18.514102 0 0 1-12.377115 18.668815l15.471394 26.610798z m-22.38195-34.862208h8.406124c8.354553 0 12.9444-3.506849 12.9444-10.314262s-4.589847-9.43755-12.9444-9.437551h-8.406124zM594.153102 674.707494l7.426269-8.921837a25.785657 25.785657 0 0 0 16.502821 7.168412c6.807413 0 10.314263-2.887994 10.314262-7.47784s-3.91942-6.2917-9.746978-8.767123l-8.66398-3.661564a18.823529 18.823529 0 0 1-13.202257-17.482675c0-10.623691 9.334408-18.823529 22.485093-18.823529a28.725222 28.725222 0 0 1 20.628525 8.354552l-6.549556 8.148268a20.628525 20.628525 0 0 0-13.821112-5.157131c-5.672844 0-9.385979 2.526994-9.385979 6.807413s4.641418 6.343272 10.314262 8.560838l8.509267 3.558421a17.946817 17.946817 0 0 1 13.047542 17.68896c0 10.623691-8.870266 19.64867-23.877518 19.648671a34.398066 34.398066 0 0 1-23.671233-9.489122M415.303787 817.09589l-8.509266 0.979855c0 8.612409-0.360999 12.892828-0.567285 21.505238l8.560838-0.928284c9.128122-1.082998 14.078969-5.672844 14.233683-13.202256s-4.589847-9.385979-13.71797-8.354553M563.674456 795.745367h-0.464142c-1.804996 8.663981-3.816277 18.307816-5.775987 26.559226-0.670427 2.784851-0.979855 4.177276-1.650282 7.013699l16.399678-2.269138c-0.77357-2.578566-1.134569-3.91942-1.856567-6.497986-2.269138-7.684126-4.435133-16.966962-6.6527-24.857373M491.010475 807.039484l-8.560838 1.237712v21.505238l8.560838-1.186141c9.179694-1.340854 13.975826-6.033844 14.027398-13.563255s-4.796132-9.282836-13.872684-7.993554M342.846092 822.304593c-2.269138 8.457695-4.847703 17.946817-7.219984 25.785657l-2.062853 6.858984c6.549557 0 9.850121-0.412571 16.399678-0.773569-0.567284-2.681708-0.876712-4.022562-1.443997-6.6527-1.804996-7.83884-3.455278-17.327961-5.157131-25.424657" fill="#2c2c2c" p-id="2368"></path><path d="M860.467365 749.53747c-234.185334-54.253022-464.399678 55.851732-698.533441 1.547139q-7.116841 77.924255-14.285254 155.693796c243.468171 58.224013 483.635778-56.728445 727.15552 1.59871l-14.233682-158.839645M264.457695 887.697019c-2.062853-14.078969-3.042707-21.092667-5.157131-35.223208-0.876712-6.188558-1.547139-12.738114-1.908139-18.771958h-0.515713c-1.392425 5.930701-2.784851 12.273973-4.33199 18.307817-3.713135 13.666398-5.621273 20.628525-9.385979 34.088638-9.592264-0.928284-14.388396-1.495568-23.980661-2.887994-3.558421-32.696213-5.157131-49.044319-8.612409-81.895246 7.787268 1.340854 11.706688 1.908139 19.493956 2.939565 0.928284 14.800967 1.443997 22.175665 2.423852 36.925061 0.567284 10.314263 0.825141 15.471394 1.443997 25.785657H234.546334c2.114424-8.302981 4.33199-16.657534 6.497985-24.754231 4.280419-14.182111 6.394843-21.298952 10.623691-35.532635 6.343272 0.567284 9.540693 0.825141 15.935536 1.18614 2.423852 14.749396 3.661563 22.124093 6.085415 36.821918 1.134569 8.25141 2.011281 16.915391 3.14585 25.785657h0.515713c1.495568-8.509267 3.094279-16.966962 4.538275-25.218372l7.219984-36.09992c7.219984 0 10.881547 0.257857 18.101531 0.257857-7.168413 31.974214-10.829976 47.90975-18.204673 79.780822-9.79855 0-14.646253-0.412571-24.444803-1.031427m92.157937-1.134569c-1.598711-7.219984-2.37228-10.881547-3.970991-18.101531-9.489122 0.567284-14.233683 0.77357-23.774375 1.082998-2.217566 7.426269-3.300564 11.139404-5.518131 18.514102-7.890411 0-11.861402 0.257857-19.751813 0.257856 11.706688-31.974214 17.431104-48.064464 28.776793-80.399678 9.076551-0.309428 13.666398-0.515713 22.742949-1.082997 8.560838 31.40693 12.9444 47.033038 21.917808 78.233682-8.199839 0.670427-12.273973 0.979855-20.628525 1.495568m72.560838-6.962127c-5.724416-10.314263-8.560838-15.832393-14.182111-26.456084l-9.282837 1.031427-0.773569 28.209508c-7.787268 0.825141-11.655117 1.18614-19.442386 1.908139 1.031426-32.025786 1.547139-48.012893 2.526995-80.038679 11.655117-1.082998 17.431104-1.701853 29.086221-3.042707 16.915391-1.95971 30.942788 1.95971 30.530217 21.298952a27.951652 27.951652 0 0 1-14.13054 24.908945c6.858985 11.809831 10.314263 17.688961 17.379533 29.395648-8.663981 1.18614-13.047542 1.701853-21.711523 2.784851m76.892828-10.314263c-5.930701-10.314263-8.870266-15.471394-14.749395-25.785656l-9.231265 1.289283v28.209508l-19.442386 2.681708c0.360999-31.974214 0.567284-48.012893 0.979855-80.038678 11.603546-1.598711 17.431104-2.423852 29.03465-4.125705 16.915391-2.475423 30.942788 1.289283 30.942788 20.628525a27.848509 27.848509 0 0 1-13.717969 25.11523c7.168413 11.655117 10.778405 17.482675 18.049959 29.137792l-21.763094 3.14585m74.881547-10.314263l-5.157131-17.740532c-9.489122 1.237712-14.233683 1.856567-23.774376 3.197422-1.753425 7.632554-2.681708 11.39726-4.486704 19.029815l-19.751813 2.784851c9.901692-33.418211 14.749396-50.127317 24.238517-83.493957 9.128122-1.289283 13.666398-1.908139 22.794521-3.094279 10.314263 30.942788 15.471394 46.001612 26.404512 76.841257-8.199839 0.928284-12.273973 1.443997-20.628525 2.475423m73.334408-7.684125c-8.560838-14.800967-12.789686-22.175665-21.19581-36.87349-3.352135-6.704271-5.157131-10.056406-8.354553-16.760676h-0.567284c1.134569 8.870266 3.094279 19.64867 3.352135 29.344077l0.77357 26.507655c-7.374698 0.721998-11.036261 1.134569-18.462531 1.95971-0.77357-31.974214-1.18614-47.961322-1.959709-79.935536 7.735697-0.876712 11.603546-1.340854 19.339242-2.062852l21.041096 36.460918 8.509267 17.121676h0.515713a250.481869 250.481869 0 0 1-3.661563-29.344077c-0.360999-10.314263-0.567284-15.883965-0.928284-26.456084 7.219984-0.567284 10.829976-0.77357 18.04996-1.18614 1.340854 31.974214 2.011281 47.961322 3.300564 79.935536-7.890411 0.464142-11.861402 0.721998-19.751813 1.289283m139.242546 1.908138c-7.735697-0.979855-11.603546-1.392425-19.339243-2.062852-0.721998-11.345689-1.082998-17.018533-1.856567-28.364223L745.102337 770.062853c0.360999 6.085415 0.567284 9.282836 0.928283 15.471394-8.663981-0.360999-12.9444-0.515713-21.60838-0.618856 1.392425 25.785657 2.114424 38.523771 3.506849 64.154714h-19.442385c-1.289283-25.785657-1.908139-38.4722-3.197421-64.103143-8.560838 0-12.892828 0-21.453667 0.618856-0.309428-6.343272-0.412571-9.540693-0.721998-15.883965a586.881547 586.881547 0 0 1 61.885576 0c7.941982 0.360999 12.016116 0.618856 20.00967 1.289283 3.14585 7.323127 4.69299 10.98469 7.787268 18.359388l7.684126 18.514101h0.721998c1.804996-6.033844 3.558421-11.39726 5.414988-17.173247l5.157132-17.018534c7.993554 1.031426 11.964545 1.650282 19.906526 2.991137-7.941982 19.184529-12.016116 28.879936-20.267526 48.425463 0.825141 11.345689 1.237712 17.070105 2.011282 28.415794M570.224013 926.530218c-19.390814 16.760677-38.730056 33.676068-58.224013 50.849315q-22.330379-19.751813-44.609186-39.091056-29.550363 3.352135-59.461725 5.982272c34.707494 27.023368 69.518131 53.634166 104.070911 79.729251 45.073328-33.985496 90.559226-68.899275 135.632554-104.43191-25.785657 1.753425-51.571313 4.177276-77.35697 6.962128M921.11523 123.255439h0.773569a923.796938 923.796938 0 0 1-204.5834-35.32635 912.812248 912.812248 0 0 1-190.81386-79.883964L512.257857 0 497.560032 8.045125a918.794521 918.794521 0 0 1-190.81386 79.935536 925.086221 925.086221 0 0 1-101.182917 23.361805c-8.560838 1.340854-17.121676 2.784851-25.785656 4.074134l-25.785657 3.300564-25.785657 2.630137-25.682514 1.908138h0.412571L79.832393 149.556809l32.747784 247.903304 16.399678 123.771152 4.074134 30.942788 1.082997 7.787269 1.237712 8.148267c0.928284 5.157131 1.547139 10.829976 2.733279 16.193392a484.409347 484.409347 0 0 0 16.657535 63.58743 465.327961 465.327961 0 0 0 37.801772 83.2361 589.35697 589.35697 0 0 0 60.080581 7.684126 419.068493 419.068493 0 0 1-53.737309-105.927478 437.892023 437.892023 0 0 1-15.007252-57.192587c-1.082998-4.847703-1.598711-9.746978-2.475423-14.646253l-1.134569-7.271555-1.031426-7.735697-4.074134-30.942788-16.399678-123.771152-29.395649-222.427075h1.856568l27.332796-1.753425 27.281225-2.526994c9.128122-0.979855 18.153102-2.217566 27.229653-3.300565a971.758259 971.758259 0 0 0 107.784045-20.628525A971.809831 971.809831 0 0 0 512 69.930701a972.5834 972.5834 0 0 0 191.071716 70.446414A976.296535 976.296535 0 0 0 894.659146 168.896052l-29.395649 222.478646-16.348106 123.771152-4.125705 30.942788-1.031427 7.735697-1.134568 7.271555c-0.825141 5.157131-1.392425 9.79855-2.423852 14.646253a438.356164 438.356164 0 0 1-15.058824 57.192587 415.097502 415.097502 0 0 1-36.099919 79.007252q25.424658 2.526994 49.560032 6.910556a455.529412 455.529412 0 0 0 30.942788-70.910556 492.867043 492.867043 0 0 0 16.709106-63.587429c1.134569-5.157131 1.804996-10.829976 2.681708-16.193393l1.289283-8.148267 1.031426-7.787269 4.125705-30.942788 16.348107-123.771152L944.167607 149.556809z" fill="#2c2c2c" p-id="2369"></path><path d="M587.036261 557.692184h-73.746978V253.060435H437.01531v-56.728445l150.020951-13.150685z" fill="#2c2c2c" p-id="2370"></path></svg>
                                <br /><span>One-Year Warranty</span>
                            </div>
                            <div>
                                <svg t="1708339185366" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7590" width="40" height="40"><path d="M261.12 367.616c-8.704 0-13.312 0.512-15.872 1.024v43.52h13.824c17.92 0 28.16-8.704 28.16-22.528 0-14.848-9.728-22.016-26.112-22.016z" p-id="7591"></path><path d="M1007.104 536.576L869.376 302.08c-5.12-9.216-14.848-14.336-25.6-14.336H645.632V176.64c0-16.384-13.312-29.696-29.696-29.696H42.496c-16.384 0-29.696 13.312-29.696 29.696v592.384c0 16.384 13.312 29.696 29.696 29.696h115.2c16.384 0 29.184-12.8 29.696-29.184 1.024-68.096 56.832-123.904 125.44-123.904 68.096 0 124.416 55.296 125.44 123.904 0 16.384 13.312 29.184 29.696 29.184h150.016c16.384 0 29.696-13.312 29.696-29.696V346.112h181.248l124.928 213.504V739.84h-13.312c-16.384 0-29.696 13.312-29.696 29.696s13.312 29.696 29.696 29.696h42.496c16.384 0 29.696-13.312 29.696-29.696v-217.6c-1.536-5.632-3.072-10.752-5.632-15.36zM183.296 371.712H122.88v35.84h56.32v28.672h-56.32V499.2H87.04V342.528h95.744v29.184zM292.352 499.2c-2.56-4.608-6.144-17.408-10.752-36.352-4.096-19.456-10.752-25.088-25.6-25.088h-10.752v61.952H209.92V344.576c11.264-2.048 28.16-3.072 47.104-3.072 23.04 0 39.424 3.584 50.688 12.288 9.216 7.68 14.336 18.432 14.336 32.768 0 19.968-14.336 33.792-27.648 38.912v0.512c10.752 4.608 16.896 14.848 20.992 29.184 5.12 17.92 9.728 38.4 12.8 44.032h-35.84z m156.16 0H348.16V342.528h96.768v29.184H384v32.768h57.856v28.672H384v37.376h64.512V499.2z m123.904 0h-99.84V342.528h96.768v29.184h-61.44v32.768h57.856v28.672h-57.856v37.376h64.512V499.2z" p-id="7592"></path><path d="M791.552 539.136c16.384 0 29.696-13.312 29.696-29.696v-65.024c0-16.384-13.312-29.696-29.696-29.696h-65.536c-16.384 0-29.696 13.312-29.696 29.696v65.536c0 16.384 13.312 29.696 29.696 29.696h65.536zM311.808 887.808c-61.44 0-111.616-50.176-111.616-111.616s50.176-111.616 111.616-111.616 111.616 50.176 111.616 111.616-50.176 111.616-111.616 111.616z m0-162.304c-27.648 0-50.176 22.528-50.176 50.176s22.528 50.176 50.176 50.176 50.176-22.528 50.176-50.176-22.528-50.176-50.176-50.176zM778.24 887.808c-61.44 0-111.616-50.176-111.616-111.616S716.8 664.576 778.24 664.576s111.616 50.176 111.616 111.616S839.68 887.808 778.24 887.808z m0-162.304c-27.648 0-50.176 22.528-50.176 50.176s22.528 50.176 50.176 50.176 50.176-22.528 50.176-50.176-22.528-50.176-50.176-50.176z" p-id="7593"></path></svg>
                                <br /><span>Free Worldwide Delivery</span>
                            </div>
                            <div>
                                <svg t="1708338233171" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3408" width="40" height="40"><path d="M502.987488 797.163799c-1.730813 0-3.446523-0.154051-5.245804-0.471216C488.787571 795.092663 278.115694 753.752508 278.115694 431.966254l0-88.427535c0-8.067059 3.41531-15.859242 9.368945-21.376902 5.506584-5.117931 12.691623-7.934152 20.243164-7.934152 0.682659 0 1.382435 0.038261 1.97649 0.074509 0.645405 0.039268 6.530572 0.382611 15.614573 0.382611 15.30647 0 45.168282-1.020968 73.192553-7.86065 25.508098-6.22247 55.621628-25.741692 87.085375-56.447264 0.496388-0.484305 1.005865-0.9817 1.293831-1.25557 4.787677-3.081029 10.356686-4.720216 16.095857-4.720216 5.888188 0 11.567954 1.712689 16.425105 4.954818 2.523221 1.678456 6.982658 5.363608 12.144891 9.628718 18.515371 15.299422 49.505887 40.9072 78.017485 47.851596 28.035347 6.839682 57.55885 7.86065 72.661932 7.86065 8.49498 0 14.396257-0.301055 15.569263-0.384625 0.810532-0.047323 1.470033-0.069474 2.071136-0.069474 7.517307 0 14.678181 2.803132 20.164628 7.89287 5.982834 5.533769 9.40922 13.333 9.40922 21.40308l0 88.427535c0 321.606024-212.196281 363.118354-221.229938 364.728342C506.520602 797.001692 504.717294 797.163799 502.987488 797.163799M301.604006 431.97733c0 157.706377 54.133472 242.16885 99.545417 285.252907 49.577375 47.03603 98.698637 56.213669 100.765746 56.580171l1.056209 0.188285 1.056209-0.187278c2.083218-0.367508 51.580044-9.546154 101.546072-56.574129 45.782474-43.089091 100.354942-127.555592 100.354942-285.260962l0-94.935956-6.480229 0.460141c-0.06444 0.004027-6.717851 0.465175-17.211472 0.465175-19.734693 0-49.338747-1.484129-78.295381-8.555392-47.129669-11.477335-96.223746-59.511175-96.715099-59.994474l-4.343646-4.286255-4.250007 4.378887c-0.468196 0.482292-47.497178 48.457733-94.520118 59.900835-30.462915 7.445819-62.449228 8.557406-78.804859 8.557406-10.517786 0-17.157101-0.461147-17.222547-0.465175l-6.479222-0.458127L301.604006 431.97733zM475.144454 597.294653c-4.178519 0-8.109348-1.61603-11.067538-4.550055-0.934377-0.935384-1.784177-2.042943-2.504091-3.271327l-0.398721-0.679639-80.41082-79.832875c-2.949128-2.927984-4.57422-6.820552-4.578247-10.96081-0.003021-4.152341 1.625092-8.063032 4.585296-11.011153 2.960204-2.943087 6.912177-4.565158 11.120902-4.565158 4.208725 0 8.159691 1.623078 11.123923 4.569186l72.715296 72.192729 142.262973-141.234956c2.972286-2.950135 6.925266-4.57422 11.133992-4.57422 4.207719 0 8.162712 1.625092 11.132985 4.57422 2.960204 2.938053 4.59033 6.840689 4.589323 10.990009-0.001007 4.144286-1.630126 8.040881-4.585296 10.971885L490.300899 588.801687l-0.401742 0.688701c-0.705817 1.211267-1.546556 2.30473-2.502077 3.25119-2.968259 2.936039-6.898081 4.553076-11.062504 4.553076-0.001007 0-0.594055-0.011076-0.594055-0.011076S475.28743 597.294653 475.144454 597.294653" fill="#272636" p-id="3409"></path><path d="M503.782917 16.445242c-278.538077 0-504.3372 225.799123-504.3372 504.3372S225.24484 1025.120649 503.782917 1025.120649s504.3372-225.80013 504.3372-504.338207S782.320994 16.445242 503.782917 16.445242M503.782917 994.860115c-261.826014 0-474.077673-212.251659-474.077673-474.077673S241.95791 46.705776 503.782917 46.705776s474.077673 212.250652 474.077673 474.076666S765.60893 994.860115 503.782917 994.860115" p-id="3410"></path></svg>
                                <br /><span>Secure Payment</span>
                            </div>
                        </div>
                    </div>

                </div>

                <div>
                {/**下面是产品对应的介绍页面 */
                    this.state.nowComponent
                }
                </div>
                <div id="detail-rest-info" className="Pdetail-rest-info">
                    <div className="Pdetail-rest-text">
                        <div id="detail-rest-summarize">
                            <h4>Better protect facial skin</h4>
                            <p>
                                If Jendey were your friend, then staying up late and having a poor diet would be your biggest enemies. Therefore, maintaining good lifestyle habits while taking care of your skin can better protect your youthful facial appearance ...
                                <button onClick={this.showAllText}>Show More</button>
                            </p>
                            
                        </div>
                        <h4 id="detail-rest-all-title" className="Pdetail-rest-all-title">Impact on facial skin</h4>
                        <p id="detail-rest-text-all" className="Pdetail-rest-text-all-hidden" >
                            Staying up late: Sleep is nature's beauty treatment. Between 10 p.m. and 2 a.m. is when cell metabolism is most active, and it's also when the skin begins to repair itself. Staying up late disrupts the body's biological rhythm, preventing the skin from self-repairing and leading to a series of skin problems.
                            <br /><br />
                            dietary habits: Healthy dietary habits are crucial for skin health. Consuming plenty of fruits, vegetables, and foods rich in antioxidants (such as vitamin C, vitamin E, and beta-carotene), while limiting sugar intake—sugar can affect collagen, leading to glycation of collagen fibers and the formation of Advanced Glycation End Products (AGEs), thereby reducing skin elasticity and causing wrinkles. Increasing intake of healthy fats and protein, and maintaining adequate hydration, can help improve skin quality, slow down the aging process, and keep the skin healthy and youthful.
                            <br /><br />
                            Ultraviolet Radiation: UV radiation has a significant impact on skin aging. UV radiation can be divided into two types, UVA and UVB, both of which can penetrate the atmosphere and directly reach the Earth's surface. The main effect of UV radiation is to cause damage to the DNA of skin cells, promote the degradation of collagen and elastic fibers in the skin, resulting in dryness, sagging, wrinkles, pigmentation, and loss of elasticity in the skin, among other aging phenomena.
                            <br /><br />
                            Therefore, avoiding staying up late, maintaining a healthy diet, and protecting against UV radiation can better preserve our facial skin !
                        </p>
                    </div>
                    <img id="PhoneDetail-rest-back-img" src={require("../../assets/images/phoneImg/phonerest1.jpg")} loading="lazy" alt="Better protect facial skin" />
                </div>

                <div id="PhoneDetail-load-2"></div>

                {/**把shop页面的FAQ直接拿过来 */}
                <div className="Pdetail-FAQ-mobule">
                    <h3>FAQs</h3>
                    <div className="Pdetail-FAQ-info">
                        {
                            this.state.FAQs.map((value , key)=>{
                                return <div className="Pdetail-FAQ-text">
                                            <div value={key} onClick={this.showFAQAns} className="Pdetail-FAQ-title">
                                                <h4>{value.title}</h4>
                                                <div id={"shop-FAQ-show-btn"+key} className="Pdetail-FAQ-show-btn">+</div>
                                            </div>
                                            <p id={"FAQ-ans"+key} dangerouslySetInnerHTML={{__html:value.text}} ></p>
                                        </div>
                            })
                        }
                    </div>
                </div>

                <div className="PdetailReview">
                    <div className="PdetailReviewTitle">
                        <div className="PdetailReviewHead">
                            Reviews<br />
                            <div>
                                <Review  score = {this.state.nowProduct.avgReview} />
                            </div>
                            <br />
                            <div>({this.state.nowProduct.avgReview})</div>
                        </div>
                        
                        <div style={{position:"relative"}}>
                            <Link  to="/setReview"><button>Write a review</button></Link>
                        </div>
                    </div>
                    
                    {/**当评论为0时显示 */}
                    <div style={this.state.reviewInfo.length > 0?{display:"none"}:{display:"block"}}>
                        <div style={{width:"98%",paddingLeft:"2%",paddingTop:"5%",paddingBottom:"5%",fontSize:"20px",backgroundColor:"whitesmoke"}}>
                            No reviews have been left at the moment
                        </div>
                    </div>

                    <div style={this.state.reviewInfo.length > 0?{display:"block"}:{display:"none"}} className="PdetailReviewInfo">
                        
                        {this.state.reviewInfo.map((value , key)=>{
                            return <div key={key} className="PdetailReviewText">
                                        <div><b>{value.review_username}</b> <Review  score = {value.review_score} /><br /></div>
                                        <div style={{marginTop:"6%",width:"95%"}}>
                                            {value.review_text}
                                            <br /><br />
                                            <div style={{display:value.review_img?"block":"none"}}>
                                                {
                                                    value.review_img ? value.review_img.split(",").map((value)=>{
                                                        return <img src={"https://www.jendey.com/reviewImg/"+this.state.nowProduct.indent+"/"+value}  alt="review"/>
                                                    }) 
                                                    : ""
                                                }
                                            </div>
                                        </div>
                                    </div>
                        })}
                    </div>
                    <div style={this.state.reviewInfo.length > 0?{}:{display:"none"}}><Page getPageInfo={this.getPageInfo} onRef={this.onRef}  /></div>
                </div>
                <div className="Pdetail-nav-mobule">
                    <div><Link rel="noopener noreferrer" rel="noreferrer"  to="/"><i>Home</i></Link></div><div>{" › "}</div>
                    <div><Link rel="noopener noreferrer" rel="noreferrer"  to="/shop"><i>Shop</i></Link></div><div>{" › "}</div>
                    <div><Link rel="noopener noreferrer" rel="noreferrer" to={"/detail?pdnum="+this.state.nowProduct.indent}>{this.state.nowProduct.title}</Link></div>
                </div>

                <div id="PDetail-fixed-pay-btn" className="PDetail-fixed-pay-btn">
                    <div className="PDetail-fixed-pay-btn-svg"><svg t="1710250644177" onClick={this.addCartProInfo} class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10591" width="43" height="43"><path d="M0 0h1024v1024H0z" fill="#21303A" p-id="10592"></path><path d="M419.83 664.74v-57.67h334.92l47.53-236.2H324.4l68.66 335.07h341.8l8.28-41.2H419.83zM818.38 298.21l-64.97-76.91h-37.12l-92.8 109.86h188.26l6.63-32.95z" fill="#F9F9FA" p-id="10593"></path><path d="M450.11 795.94m-55.68 0a55.68 55.68 0 1 0 111.36 0 55.68 55.68 0 1 0-111.36 0Z" fill="#F9F9FA" p-id="10594"></path><path d="M669.48 795.94m-55.68 0a55.68 55.68 0 1 0 111.36 0 55.68 55.68 0 1 0-111.36 0Z" fill="#F9F9FA" p-id="10595"></path><path d="M324.4 370.87l-42.57-85.14h-76.22v-37.08l107.11-4.8 37.08 127.02" fill="#F9F9FA" p-id="10596"></path></svg></div>
                    <div className="PDetail-fixed-pay-num">{this.state.curr}{Number(this.state.nowProduct.sale*this.state.currNum).toFixed(2)}</div>
                    <button onClick={this.buyNow}>Pay Now</button>
                </div>

                <div id="PDeatil-fixed-pay-btn-show-point-2"></div>
                <PhoneFooter name="detail" ISO={this.state.ISO} headCurrChange={this.headCurrChange}/>
            </div>
        );
    }
}

export default PhoneDetail;