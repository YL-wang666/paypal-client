import React,{Component} from "react";
import Head from "./Head";
import Footer from "./Footer";
import Review from "./Review";
import Page from "./publicCom/Page";
import "../assets/css/detail.css";
import { Link } from "react-router-dom";
import { reactFacekookPixel } from "./publicCom/ReactFacekookPixel";


import axios from "axios";
class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            curr: localStorage.getItem("curr")?localStorage.getItem("curr"):"$",
            currNum : localStorage.getItem("currNum")?localStorage.getItem("currNum"):1,
            ISO : localStorage.getItem("ISO")?localStorage.getItem("ISO"):"USD",
            nowProduct : {"indent":"C12_1","title":"Blue and white peacock dinner plate","sale":"112","video_img":null,"video":null,"img_arr":"p1.png,p2.jpg,p3.jpg,p4.jpg,p5.jpg,p6.png,p7.jpg,p8.jpg","functions":"","choose":"p0.png","avgReview":5.0,"reviewSum":0},
            imgIconArr : [],
            imgIconPth : 0,
            choosePth  : 0,
            buySum     : 1,
            reviewInfo : [{"indent":"","review_text":"","review_username":"","review_score":"5","review_img":""}],
            pageSum   : 1,
            //是否已将加载过模块
            isMobuleLoad_1 : false,
            isMobuleLoad_2 : false,
            description: "High-end porcelain from Jingdezhen , Blue-and-white porcelain , Luxury tableware"
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
            this.getDetailInfo("C12_2") 
        }

       // document.addEventListener("scroll",this.lazyLoad)
        //回到顶部
        document.body.scrollTop = document.documentElement.scrollTop = 0;
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
                    document.getElementsByClassName("detail-choose-pth-img")[0].style.border = "1.5px #d10483 solid"
                    //产品点击数据上传
                    this.pageLoad()
                }
            )
        })
    }


    lazyLoad=()=>{
        if(document.getElementById("detail-load-1").offsetTop - document.documentElement.scrollTop - document.documentElement.clientHeight  <= 0 && document.getElementById("detail-load-2").offsetTop - document.documentElement.scrollTop - document.documentElement.clientHeight  > 0){
            if(!this.state.isMobuleLoad_1){
                this.getChildCompoent()
                this.setState({
                    isMobuleLoad_1 : true
                })
            }
        }
        if(document.getElementById("detail-load-2").offsetTop - document.documentElement.scrollTop - document.documentElement.clientHeight <= 0){
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
            page : "detail"
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
        const doc = document.getElementsByClassName("detail-icon-img")
        for(let i = 0;i < doc.length;i++){
            doc[i].style.border = "none"
        }
        e.target.style.border = "1px #d10483 solid"
    }

    //点击选择图片
    chooseProduct=(e)=>{
        document.getElementById("detail-display-img").src = e.target.src
        const doc = document.getElementsByClassName("detail-choose-pth-img")
        for(let i = 0;i < doc.length;i++){
            doc[i].style.border = "none"
        }
        e.target.style.border = "2px #d10483 solid"
        this.setState({
            choosePth : e.target.getAttribute("value")
        })
    }

    //图片图标滚动
    turnIcon=(e)=>{
        if(e.target.value === "0"){
            let num = this.state.imgIconPth === 0?0:this.state.imgIconPth - 1
            document.getElementById("detail-icon-mobule").style.marginLeft = `${num*-90}px`
            this.setState({
                imgIconPth : num
            })
        }
        if(e.target.value === "1"){
            let iLength = this.state.nowProduct.video ? 1 : 0 
            let num = this.state.imgIconPth + 6 < this.state.imgIconArr.length + iLength ? this.state.imgIconPth + 1 : this.state.imgIconPth
            document.getElementById("detail-icon-mobule").style.marginLeft = `${num*-90}px`
            this.setState({
                imgIconPth : num
            })
        }
        
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

    //跳转时就是该组件销毁时清除掉本组件的监听
    componentWillUnmount(){
        document.removeEventListener("scroll",this.lazyLoad)
    }

    render() {
        return (
            <div>
                <div id="head-fixed" style={{borderBottom:"0.2px gray solid"}} className="head-fixed"><Head name="detail" headRef={this.headRef} ISO={this.state.ISO} headCurrChange={this.headCurrChange} /></div>
                <div className="detail-product-mobule">
                    <div className="detail-product-img-mobule">
                        {/**这个div是播放视频的，刚开始是隐藏的，只有点击会出现 */}
                        <div id="detail-video-mobule" className="detail-video-mobule">
                            <button onClick={this.closeVideo} className="detail-close-video-btn">X</button>

                            <video id="detail-video" 
                                src=""
                                data={this.state.nowProduct.video ? require("../assets/images/product/detail/"+this.state.nowProduct.indent+"/"+this.state.nowProduct.video) : ""} 
                                style={{width:"72%",marginLeft:"13%",border:"1.5px whitesmoke solid",borderRadius:"10px"}} 
                                controls 
                            /> 

                        </div>
                        {/**这个是大图，显示小图标的图片 */}
                        <img id="detail-display-img"  className="detail-display-img" src={require("../assets/images/proImg/"+this.state.nowProduct.indent+"/p1.png")} alt={this.state.nowProduct.title + "picture"} />
                        {/**这是大图下面小图标 */}
                        <div className="detail-img-bottom-mobule">
                            <button onClick={this.turnIcon} value="0" className="detail-icon-turn-left">{"«"}</button>
                            <div style={{width:"100%",overflow:"hidden",marginLeft:"6px"}}>
                                <div id="detail-icon-mobule" className="detail-icon-mobule">
                                    <img className="detail-video-icon-btn" onClick={this.showVideo} style={this.state.nowProduct.video_img?{}:{display:"none"}} src={this.state.nowProduct.video_img?require("../assets/images/proImg/"+this.state.nowProduct.indent+"/"+this.state.nowProduct.video_img) : ""} alt="product video" />
                                    {
                                        this.state.imgIconArr.map((value)=>{
                                            return <img className="detail-icon-img" onClick={this.showPicture} src={require("../assets/images/proImg/"+this.state.nowProduct.indent+"/"+value)} alt="skincare picture"/>
                                        })
                                    }
                                </div>
                            </div>
                            <button onClick={this.turnIcon} value="1" className="detail-icon-turn-right">{"»"}</button>
                        </div>

                    </div>

                    {/**这是右边产品信息 */}
                    <div className="detail-product-info-mouble">
                        <h1>{this.state.nowProduct.title}</h1><br />
                        <p className="detail-product-info-small-label">Handcrafted in Jingdezhen · High-temperature</p>
                        {/*<Review   score = {this.state.nowProduct.avgReview === 0.0 ? "5" : this.state.nowProduct.avgReview} /><span style={{fontSize:"18px",fontWeight:"600",color:"gray"}}> ({this.state.nowProduct.avgReview === 0.0 ? "Currently no comments" : this.state.nowProduct.avgReview})</span><br />*/}
                        <div className="detail-info-price-mobule">
                            <div className="detail-price">{this.state.curr}{Number(this.state.nowProduct.sale*this.state.currNum)}</div>
                            {/*
                            <div style={Number(this.state.nowProduct.delete_sale) === 0?{display:"none"}:{}} className="detail-delete-price">{this.state.curr}{Number(this.state.nowProduct.delete_sale*this.state.currNum).toFixed(2)} </div>
                            <div style={Number(this.state.nowProduct.delete_sale) === 0?{display:"none"}:{}} className="detail-save">SAVE ${Number(this.state.nowProduct.delete_sale) - Number(this.state.nowProduct.sale)}</div>
                            */}  
                            </div>
                        
                        <div className="detail-line"></div>
                        <div className="detail-func-mobule">
                            <h3>Artwork Description</h3>
                            {
                                this.state.nowProduct.functions.split("|").map((value)=>{
                                    return <div className="detail-func-info">
                                                <div></div>
                                                <p>{value}</p>
                                            </div>
                                })
                            }
                        </div>
                        <div className="detail-line"></div>
                        <div className="detail-choose-mobule">
                            
                            <div style={{display:"none"}}>
                                <h3>Choose :</h3>
                                <div className="detail-choose-img">
                                    {
                                        this.state.nowProduct.choose.split(",").map((value , key)=>{
                                            return <img className="detail-choose-pth-img" value={key+1} onClick={this.chooseProduct} src={require("../assets/images/proImg/"+this.state.nowProduct.indent+"/"+value)}/>
                                        })
                                    }
                                    
                                </div>
                            </div>

                            <div className="detail-qty-mobule">
                                <h3>Quantity :</h3>
                                <div className="detail-qty-info">
                                    <input onBlur={this.onBlurBuySum} onChange={this.changeBuySum} value={this.state.buySum} className="detail-qty-input" />
                                    <button value="down" onClick={this.changeBuySum} className="detail-qty-Subtract-btn">–</button>
                                    <button value="add" onClick={this.changeBuySum} className="detail-qty-add-btn">+</button>
                                </div>
                            </div>
                        </div>
                        
                        <div className="detail-pay-btn-mobule">
                            <button className="detail-pay-btn" onClick={this.buyNow}>BUY NOW</button>
                            <button className="detail-cart-btn" onClick={this.addCartProInfo}>ADD TO CART</button>
                        </div>
                        <div id="detail-load-1"></div>
                    </div>

                </div>

                <div className="detail-different-mobule">
                    <h2>Why We’re Different</h2>
                    <div className="detail-different-text-mobule">
                        <p>
                            <b>Why Jingdezhen High-Fire Porcelain Outshines All Others</b>
                            <br /><br />
                            Most ceramics on the market are low-fired and industrially made—prone to cracking, dull in color, and lacking resonance. Ours is different.
                            <div className="detail-func-info">
                                <div></div>
                                <p>
                                    Fired at over 1300°C (2370°F) using exclusive high-white clay
                                </p>
                                <div></div>
                                <p>
                                    Dense, translucent, and strong—fine porcelain you can hear when tapped
                                </p>
                                <div></div>
                                <p>
                                    Naturally lead-free and heavy-metal-safe, thanks to ultra-high-temperature firing
                                </p>
                                <div></div>
                                <p>
                                    Exceptional hardness and wear resistance—ideal for daily use without scratching
                                </p>
                            </div>
                        </p>
                        <img src={require("../assets/images/proImg/"+this.state.nowProduct.indent+"/p0.png")} />
                    </div>

                    <h2>Linglong Openwork Carving</h2>
                    <p className="detail-linglong-label">The glazed openwork areas are highly translucent, as if pieces of glass were inlaid into the porcelain. When held against the light, their beauty is even more striking—especially in blue-and-white Linglong ware, often hailed as the 'jewel of porcelain</p>
                    
            
                    <div className="detail-linglong-process-mobule">
                        <p>
                            The intricate openwork begins only once the porcelain body has achieved the required strength—each cut must be flawless, with evenly spaced patterns and no room for error. A single slip can compromise the entire piece. The process demands both precision and artistry. For blue-and-white Linglong ware, the cobalt motifs are delicately hand-painted before the piercing begins, blending color and carving into a seamless harmony
                        </p>
                        <img src={require("../assets/images/linglongdk.jpg")} />
                        <img src={require("../assets/images/linglongsy.jpg")} />
                        <p>
                            After carving, a special transparent glaze is carefully applied into each pierced opening. The glaze must have a thermal expansion coefficient precisely matched to that of the porcelain body—any mismatch during high-temperature firing could cause cracking, rendering the piece unusable
                        </p>
                        <p>
                            Finally, the piece must be fired once at a temperature exceeding 1300°C to achieve its final form. The extreme heat required by both the materials and the craftsmanship results in a relatively low yield rate, making each finished piece all the more precious
                        </p>
                    </div>

                </div>

                <h3 className="detail-maybe-like-title">Recommended For You</h3>
                <div className="detail-maybe-like-mobule">
                        <Link to="/detail?pdnum=C12_2">
                            <div>
                                <img src={require("../assets/images/proImg/C12_2/p0.png")} />
                                <p>Blue and white tea cup & water cup</p>
                            </div>
                        </Link>
                        <Link to="/detail?pdnum=D12_1">
                            <div>
                                <img src={require("../assets/images/proImg/D12_1/p0.png")} />
                                <p>Longevity flower bowl</p>
                            </div>
                        </Link>
                        <Link  to="/detail?pdnum=A4_1">
                            <div>
                                <img src={require("../assets/images/proImg/A4_1/p0.png")} />
                                <p>Vintage Enamel Color Coffee Cup</p>
                            </div>
                        </Link>
                        <Link  to="/detail?pdnum=Zhen1">
                            <div>
                                <img src={require("../assets/images/proImg/Zhen1/p0.png")} />
                                <p>Landscape blue and white covered bowl</p>
                            </div>
                        </Link>
                    </div>

               
                <Footer name="detail" ISO={this.state.ISO} headCurrChange={this.headCurrChange}/>

              {/** 
                <div className="detailReview">
                    <div className="detailReviewTitle">
                        <h3>
                            Consumer Reviews<br />
                            <div>
                                <Review  score = {this.state.nowProduct.avgReview} />
                            </div>
                        </h3>
                        <p>({this.state.nowProduct.avgReview})</p>
                        <div style={{position:"relative"}}>
                            <Link  to="/setReview"><button>Write a review</button></Link>
                        </div>
                    </div>
                    
                    
                    <div style={this.state.reviewInfo.length > 0?{display:"none"}:{display:"block"}}>
                        <div style={{width:"98%",paddingLeft:"2%",paddingTop:"5%",paddingBottom:"5%",fontSize:"20px",backgroundColor:"whitesmoke"}}>
                            No reviews have been left at the moment
                        </div>
                    </div>

                    <div style={this.state.reviewInfo.length > 0?{display:"block"}:{display:"none"}} className="detailReviewInfo">
                        
                        {this.state.reviewInfo.map((value , key)=>{
                            return <div key={key} className="detailReviewText">
                                        <div><b>{value.review_username}</b> <Review  score = {value.review_score} /></div>
                                        <div style={{marginTop:"3%",width:"90%"}}>
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
                */}
                
            </div>
        );
    }
}

export default Detail;