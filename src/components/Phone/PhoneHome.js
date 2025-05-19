import React,{Component} from "react";
import axios from "axios"
import { Link } from "react-router-dom";
import Review from "../Review";
import PhoneHead from "./PhoneHead"
import PhoneFooter from "./PhoneFooter"
import { reactFacekookPixel } from "../publicCom/ReactFacekookPixel";
import "../../assets/css/phone/phoneHome.css";
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            productArr : [{"indent":"pro1","img":"p1.png","title":"ZH- RF beauty device","func":"Reduce nasolabial lines,Skin firming","sale":209,"delete_sale":259},
                            {"indent":"pro2","img":"p2.png","title":"ZM- RF beauty device","func":"Reduce nasolabial lines,Skin rejuvenation","sale":189,"delete_sale":239},
                            {"indent":"pro3","img":"p3.png","title":"Eye beauty pen","func":"Vibration Massage to Reduce Eye Bags","sale":98,"delete_sale":148}
                        ],
            curr: localStorage.getItem("curr")?localStorage.getItem("curr"):"$",
            currNum : localStorage.getItem("currNum")?localStorage.getItem("currNum"):1,
            ISO : localStorage.getItem("ISO")?localStorage.getItem("ISO"):"USD",
            //控制评论去动态
            reviewCss : false,
            //用来控制效果图片轮换的参数
            chanegeEffect : 1,
            description: "Skincare, Skincare Products, Beauty Devices | Radio Frequency Beauty Device, Microcurrent Beauty Device."
         };
    }

    componentDidMount(){
        document.querySelector('meta[name="description"]').setAttribute("content", this.state.description);
        //document.body.scrollTop = document.documentElement.scrollTop = 0;
        document.addEventListener("scroll",this.scrollShow)
        this.pageLoad()
    }

    pageLoad=()=>{
        axios.post("/api/page_click",{
            page : "PhoneHome"
        })
    }


    //改变货币时改变页面所有货币和金额
    headCurrChange=(curr,currNum,ISO)=>{
        this.setState({
            curr : curr,
            currNum : currNum,
            ISO : ISO
        })
        
    }

    //控制css的
    scrollShow=()=>{
        //控制how to word 动画
        if( document.getElementById("home-learn-RF-mobule").offsetTop - document.documentElement.scrollTop - document.documentElement.clientHeight  <= 0){
            document.getElementById("home-learn-RF-mobule").className = "Phome-learn-RF-mobule-move"
            //控制文献部分的动画
            if( document.getElementById("home-pubmed-mobule").offsetTop - document.documentElement.scrollTop - document.documentElement.clientHeight  <= 0){
                document.getElementById("home-pubmed-mobule").className = "Phome-pubmed-mobule-move"
            }
        }
        //控制评论模块动画
        if( document.getElementById("home-review-mobule").offsetTop - document.documentElement.scrollTop - document.documentElement.clientHeight  <= 30){
            this.setState({
                reviewCss : true
            })
            document.removeEventListener("scroll",this.scrollShow)
        }

    }

    //控制效果图片的动态
    changeEffectImg=(e)=>{
        const turn = e.currentTarget.value
        if((this.state.chanegeEffect === 1 && turn === "left") || (this.state.chanegeEffect === 3 && turn === "right")){ return }
        const doc = document.getElementsByClassName("Phome-example-line")
        //用于循环计数的
        let num = this.state.chanegeEffect - 1
        for(let i = 0 ; i < doc.length ; i++){
            doc[i].style.backgroundImage = "linear-gradient(90deg, #d10483 0, #d10483 0%, whitesmoke 0, whitesmoke 0%)"
        }
        if(turn === "left"){
            for (let i = 0; i <= 100; i++) {
                setTimeout(()=> {
                    document.getElementById("Phome-example-img-mouble").style.marginLeft = `${(-num*100) + i}%`
                    doc[num - 1].style.backgroundImage = `linear-gradient(90deg, #d10483 0, #d10483 ${i}%, whitesmoke 0, whitesmoke 100%)`
                }, i*2); 
                
            } 
            
            this.setState({
                chanegeEffect : this.state.chanegeEffect - 1
            })
        }

        if(turn === "right"){
            for (let i = 0; i <= 100; i++) {
                setTimeout(()=> {
                    document.getElementById("Phome-example-img-mouble").style.marginLeft = `${-num*100 - i}%`
                    console.log(`${-num*100 - i}%`)
                    doc[num + 1].style.backgroundImage = `linear-gradient(-90deg, #d10483 0, #d10483 ${i}%, whitesmoke 0, whitesmoke 100%)`
                }, i*2); 
                
            } 

            this.setState({
                chanegeEffect : this.state.chanegeEffect + 1
            })

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

    //点击产品跳转详情页面
    turnDetailPage=(e)=>{
        window.location.href = `detail?pdnum=pro${e.target.getAttribute("value")}`
    }

    //添加购物车产品信息
    addCartProInfo=(e)=>{
        //添加购物车突变变化
        document.getElementById("addStatus" + e.currentTarget.getAttribute("value")).style.display = "block"
        reactFacekookPixel("AddToCart")
        this.childhead.shoppingAddCart(this.state.productArr[e.currentTarget.getAttribute("value")].indent + "=" + "1")
        //购物车的产品数据传到后台
        axios.post("/api/cart_click",{
            proId : e.target.value
        })
    }

    //跳转时就是该组件销毁时清除掉本组件的监听
    componentWillUnmount(){
        document.removeEventListener("scroll",this.scrollShow)
    }

    render() {
        return (
            <div style={{overflow:"hidden"}}> 
                <div id="head-fixed" className="Phead-fixed" >
                    <PhoneHead name="home" headRef={this.headRef} ISO={this.state.ISO} headCurrChange={this.headCurrChange} scrollShow={this.scrollShow}/>
                </div>
                <div className="Phome-back-mobule">
                    <div className="Phome-back-text-mobule">
                        <h2>Limited-time offer</h2>
                        <p>Enjoy $50 Off</p>
                        <button><Link  to="/shop">Shop Now</Link></button>
                    </div>
                    
                    <video className="Phome-video" src={require("../../assets/images/back5.mp4")} style={{width:"100%",height:"600px",objectFit:"cover",position:"absolute",top:"0",left:"0"}} autoplay="autoplay" loop="loop" muted="muted"></video>
                </div>
                
                <div className="Phome-back-slogan-mobule">
                    <div><svg t="1707222811573" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13610" width="40" height="40"><path d="M658.9952 540.7232c39.4752 0 79.0016-14.1312 105.0112-41.8816 9.6768-10.3424 9.1648-26.5216-1.1776-36.1984-10.3424-9.6768-26.5728-9.1648-36.1984 1.1776-32.6656 34.8672-99.9936 31.4368-130.0992 4.2496-10.496-9.472-26.6752-8.6528-36.1984 1.8432-9.472 10.496-8.6528 26.6752 1.8432 36.1984C587.8784 529.2544 623.4624 540.7232 658.9952 540.7232zM977.8176 164.1472c-2.4064-13.8752-15.616-23.1936-29.6448-20.7872-13.9264 2.4576-23.2448 15.7184-20.7872 29.6448 26.5728 151.7568 37.2224 237.568-31.2832 380.0576l-8.0896 16.7936c-44.9536 93.184-84.9408 175.9744-67.4816 254.8224-21.1968-9.7792-44.0832-26.4192-55.2448-54.0672 64.6144-105.6768 103.7824-247.2448 114.9952-364.8 0.1024-0.8704-0.256-1.6896-0.256-2.56 0-1.792-0.1536-3.4816-0.5632-5.1712-0.3584-1.5872-0.768-3.072-1.4336-4.5568-0.6656-1.536-1.3824-2.9184-2.304-4.2496s-1.8944-2.56-3.072-3.7376c-1.1264-1.1264-2.3552-2.0992-3.6864-3.0208-1.4336-0.9728-2.9184-1.7408-4.5568-2.4064-0.8192-0.3584-1.4336-0.9728-2.304-1.2288-133.5808-39.8848-230.4-154.5216-246.8864-242.3296-2.6112-13.8752-15.7696-23.0912-29.8496-20.4288-13.8752 2.6112-23.04 15.9744-20.4288 29.8496 18.1248 96.9216 115.7632 222.0032 262.1952 274.2272-18.8416 158.208-87.0912 353.4336-200.2944 428.3904-87.4496 57.856-117.7088 69.9904-127.6928 69.9904-24.1152 0-75.9296-34.9184-106.8544-55.7568l-18.176-12.1344c-69.376-45.6192-107.4688-140.7488-151.5008-250.88L212.2752 573.952c-5.3248-13.1584-20.224-19.4048-33.3312-14.1824-13.1072 5.3248-19.456 20.224-14.1824 33.28l10.2912 25.7024c21.4528 53.6064 42.496 105.6256 67.328 151.5008-55.2448-32.9728-128.3584-99.6352-167.2704-232.2432-3.9424-13.568-18.1248-21.2992-31.7952-17.3568-13.568 3.9936-21.3504 18.2272-17.3568 31.7952 67.6864 230.6048 231.0144 286.2592 269.9776 296.4992 15.0528 17.0496 31.488 32.3072 50.1248 44.544l17.664 11.776c54.2208 36.5568 98.6112 64.512 135.4752 64.512 30.976 0 82.6368-30.0544 157.9008-79.872 27.6992-18.3296 52.7872-43.264 75.5712-72.3968 42.9568 61.4912 123.8016 70.9632 127.6928 71.3728 0.9216 0.1024 1.8432 0.1536 2.7136 0.1536 8.6016 0 16.7424-4.352 21.504-11.7248 5.2736-8.0896 5.4784-18.4832 0.5632-26.8288-41.5744-70.912-1.6384-153.6512 48.9472-258.4064l8.1408-16.8448C1017.3952 418.9184 1005.4656 321.9968 977.8176 164.1472zM399.7184 766.8224c-7.3216 12.0832-3.4304 27.8528 8.6528 35.1744 2.3552 1.3824 39.424 23.296 89.856 23.296 27.1872 0 58.2656-6.3488 89.8048-25.7536 12.032-7.424 15.8208-23.1424 8.448-35.2256-7.4752-12.032-23.2448-15.9232-35.2256-8.3968-63.0784 38.656-123.9552 3.6864-126.5152 2.1504C422.656 750.848 406.9888 754.7392 399.7184 766.8224zM156.928 348.5184 252.928 384.5632l36.9664 124.8256c3.2256 10.8544 13.2096 18.3296 24.5248 18.3296 0 0 0.0512 0 0.1024 0 11.3664-0.0512 21.3504-7.5776 24.5248-18.4832l35.9424-124.6208 96.8192-36.0448c10.0352-3.7376 16.7424-13.3632 16.6912-24.1152S481.6896 304.128 471.6032 300.4928L374.9888 265.3696 339.0464 139.9296C335.9232 129.024 325.9392 121.4464 314.5728 121.3952c-0.0512 0-0.0512 0-0.0512 0-11.3664 0-21.3504 7.4752-24.576 18.3808L252.928 265.3696 157.1328 300.4928C147.0976 304.1792 140.3904 313.7024 140.3392 324.4032S146.8928 344.7296 156.928 348.5184zM282.6752 308.992C290.304 306.176 296.1408 299.9296 298.4448 292.1984l15.7184-53.3504 15.2064 53.1456c2.2528 7.8848 8.1408 14.1824 15.872 16.9984l43.52 15.8208L345.0368 341.0944C337.408 343.9104 331.6224 350.1568 329.3696 357.9904L314.112 410.7776 298.4448 357.7856c-2.2528-7.68-8.0384-13.8752-15.5648-16.6912L239.5136 324.8128 282.6752 308.992z" fill="#d10483" p-id="13611"></path></svg></div>
                    <p>Keep your facial skin supple, luminous, and delay the signs of aging gracefully</p>
                </div>

                <div className="Phome-product-mobule">
                    {
                        this.state.productArr.map((value , key)=>{
                            return  <div className="Phome-product-info">
                                        <div className="Phome-product-off-label">$50 OFF</div>
                                        <img value={key + 1} onClick={this.turnDetailPage} style={{width:"250px",height:"272px"}} src={require("../../assets/images/" + value.img)} alt="RF_picture" loading="lazy" />
                                        <p>{value.title}</p>
                                        <div className="Phome-product-func">{value.func}</div>
                                        <div style={{width:"100%",display:"grid",gridTemplateColumns:"50% 50%",marginTop:"10px"}}>
                                            <div style={{paddingLeft:"50%"}}><b>{this.state.curr}{(value.sale*this.state.currNum).toFixed(2)}</b><span>{this.state.curr}{(value.delete_sale*this.state.currNum).toFixed(2)}</span></div> 
                                            <div className="Phome-cart-btn" value={key} onClick={this.addCartProInfo}>
                                                <svg t="1706870253058" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="32464" width="25" height="25"><path d="M373.845477 766.654864c-52.878324 0-95.745644 42.868343-95.745644 95.751784 0 52.876278 42.866297 95.745644 95.745644 95.745644 52.881394 0 95.747691-42.868343 95.747691-95.745644C469.592145 809.523207 426.725848 766.654864 373.845477 766.654864zM373.845477 915.598104c-29.377074 0-53.193503-23.816428-53.193503-53.197596 0-29.372981 23.816428-53.18941 53.193503-53.18941 29.377074 0 53.193503 23.816428 53.193503 53.18941C427.03898 891.781676 403.222551 915.598104 373.845477 915.598104zM215.001749 192.166671l-22.011316-127.667681L65.324798 64.49899l0 42.558281 88.781022 0 102.716406 595.769892 595.765799 0 0-42.554188L295.709909 660.272975l-11.512195-66.768683 568.389288-60.896952L958.975031 234.724952l0-42.558281L215.001749 192.166671zM831.311443 490.052129l-554.331108 61.58973-54.641481-316.916906 687.532829 0L831.311443 490.052129zM735.561705 766.654864c-52.878324 0-95.747691 42.868343-95.747691 95.751784 0 52.876278 42.868343 95.745644 95.747691 95.745644s95.747691-42.868343 95.747691-95.745644C831.309396 809.523207 788.44003 766.654864 735.561705 766.654864zM735.561705 915.598104c-29.379121 0-53.193503-23.816428-53.193503-53.197596 0-29.377074 23.814382-53.191456 53.193503-53.191456 29.377074 0 53.193503 23.814382 53.193503 53.191456C788.755208 891.781676 764.93878 915.598104 735.561705 915.598104z" fill="#515151" p-id="32465"></path></svg>
                                                <svg t="1706954481842" id={"addStatus" + key} class="PaddStatus" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3666" width="16" height="16"><path d="M511.8848 959.7056c-247.1296-0.0192-447.84-200.9088-447.6928-448.096 0.1408-247.2576 200.896-448.192 447.5392-447.936 248.352 0.256 448.6464 200.5824 448.4928 448.5824-0.1536 247.1424-200.8704 447.4688-448.3392 447.4496z m-38.8672-341.4272c-0.8384-0.6528-1.3504-1.0304-1.8304-1.4336-17.4784-14.6752-34.9504-29.3504-52.4288-44.0256-15.1936-12.7552-30.2464-25.6704-45.6256-38.1888-10.5728-8.608-22.5344-10.0032-34.7136-3.8464-12.1856 6.1568-18.0032 16.64-17.504 30.2592 0.3776 10.3488 5.6512 18.1696 13.5232 24.6976 21.2608 17.6256 42.3424 35.4752 63.4944 53.2352 20.0896 16.8704 40.2176 33.696 60.2432 50.6368 6.144 5.1968 12.992 8.64 21.0688 8.9088 13.0944 0.4352 22.9056-5.312 29.7472-16.4352C563.8784 592.8768 618.7904 503.68 673.6896 414.4768c8.4352-13.7024 17.0304-27.3088 25.248-41.1392 6.4832-10.8992 6.5152-22.24-0.0384-33.0752-6.4832-10.7264-16.448-15.9744-28.9856-15.3664-11.7376 0.5696-20.3456 6.5472-26.4896 16.5312-55.872 90.8544-111.8016 181.6768-167.712 272.512-0.832 1.344-1.6704 2.688-2.6944 4.3392z" p-id="3667" fill="#0d9c16"></path></svg>
                                            </div>
                                        </div>
                                        <button value={key + 1} onClick={this.turnDetailPage}>Learn More</button>
                                    </div>
                        })
                    }
                    
                </div>
                <h4 className="Phome-more-product">
                    <Link to="/shop">
                        <i>More Products {">>"}</i>
                    </Link>
                </h4>
                <div id="home-learn-RF-mobule" className="Phome-learn-RF-mobule">
                    <div id="home-work-mobule" className="Phome-work-mobule-move">
                        <h3>How it works for you?</h3>
                        <img style={{width:"100%"}} src={require("../../assets/images/e3.jpg")} alt="Anti-aging skincare beauty device" loading="lazy" />
                        <p>The radiofrequency(RF) beauty device targets the deep-layer collagen of the skin, stimulating its regeneration to enhance skin elasticity and tightness</p>
                        <Link to="/blog_info?bn=10">
                            <button>Learn more</button>
                        </Link>
                    </div>
                </div>
                <div id="home-pubmed-mobule" className="Phome-pubmed-mobule">
                    <img className="Phome-pubmed-back-img" src={require("../../assets/images/pubmed.jpg")} loading="lazy" alt="experiment"/>
                    <div>
                        <p>Radiofrequency is a mature technology, and its effectiveness in facial rejuvenation has been documented on the world-renowned medical literature database PubMed : 
                            <br /><br />Most studies demonstrated radiofrequency treatment of acne, scars, or facial rhytids had positive subjective improvement ratings. Objective studies demonstrated reduction of acne, decreased scarring, lifting effect, improvement in elasticity and collagen, volumetric fat changes, and wrinkle reduction.
                        </p>
                        <a href="https://pubmed.ncbi.nlm.nih.gov/34923652/" target="_blank"><button>Learn more</button></a>
                    </div>
                </div>

                <div style={{backgroundColor:"white",paddingTop:"15%"}}>
                    <h3 className="Phome-example-title">40-Day Test</h3>
                    <div className="Phome-example-line-mobule">
                        <div style={{backgroundColor:"#d10483"}} className="Phome-example-line"></div>
                        <div className="Phome-example-line"></div>
                        <div className="Phome-example-line"></div>
                    </div>
                    <div className="Phome-example-mobule">
                        <div id="Phome-example-img-mouble" className="Phome-example-img-mouble">
                            <div style={{display:"grid",gridTemplateColumns:"50% 50%"}}>
                                <img src={require("../../assets/images/phoneImg/example1_1.jpg")} loading="lazy" alt="Skincare:Diminishing Wrinkle Effect"/>
                                <img src={require("../../assets/images/phoneImg/example1_2.jpg")} loading="lazy" alt="Skincare:Diminishing Wrinkle Effect"/>
                            </div>
                            <div style={{display:"grid",gridTemplateColumns:"50% 50%"}}>
                                <img src={require("../../assets/images/phoneImg/example2_1.jpg")} loading="lazy" alt="Skincare:Facial Pore Transformation"/>
                                <img src={require("../../assets/images/phoneImg/example2_2.jpg")} loading="lazy" alt="Skincare:Facial Pore Transformation"/>
                            </div>
                            <div style={{display:"grid",gridTemplateColumns:"50% 50%"}}>
                                <img src={require("../../assets/images/phoneImg/example3_1.jpg")} loading="lazy" alt="Skincare:Facial Contour Lifting Effect"/>
                                <img src={require("../../assets/images/phoneImg/example3_2.jpg")} loading="lazy" alt="Skincare:Facial Contour Lifting Effect"/>
                            </div>
                            
                        </div>
                        <button onClick={this.changeEffectImg} value="left" className="Phome-example-left-btn">
                            <svg  t="1713170342203" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="19169" width="50" height="50"><path d="M575.913 703.549l45.28-45.28-146.536-146.536 146.536-146.536-45.28-45.28-191.808 191.824z" p-id="19170" fill="#e6e6e6"></path></svg>
                        </button>
                        <button onClick={this.changeEffectImg} value="right" className="Phome-example-right-btn">
                            <svg t="1713170342203" style={{transform:"rotate(180deg)"}} class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="19169" width="50" height="50"><path d="M575.913 703.549l45.28-45.28-146.536-146.536 146.536-146.536-45.28-45.28-191.808 191.824z" p-id="19170" fill="#e6e6e6"></path></svg>
                        </button>
                    </div>
                    <div style={{width:"90%",textAlign:"center",fontSize:"12px",color:"gray",marginLeft:"5%",marginTop:"20px",marginBottom:"5%"}}>
                        * Due to individual differences in skin conditions, subtle variations in improvement results may occur over different time periods
                    </div>


                    <div className={this.state.reviewCss?"Phome-review-hidden-mobule":"Phome-review-hidden"}>
                        <div className="Phome-review-title">customer reviews</div>
                        <div id="home-review-mobule" className="Phome-review-mobule">
                            <div className="Phome-review-info">
                                <Review  score = {"5.0"} /><br />
                                <p>
                                    It's been 50 days since I bought it, and I've been using it all along. My skin has indeed changed. The pimples disappeared quickly, and my skin has become smoother and tighter. I will continue to use it.
                                </p>
                                <img loading="lazy" src={require("../../assets/images/20230115.jpg")} loading="lazy" alt="review-picture"/>
                                <div className="Phome-review-name">-- Aurora</div>
                            </div>
                            <div className="Phome-review-info">
                                <Review  score = {"5.0"} /><br />
                                <p>
                                    My sis recommended what I bought, and it's quite useful. The yellow light has a slight tingling sensation, but you can lower the intensity. The red light gives a slight electric heating sensation. Overall, it's very good. After using it, my skin becomes much brighter.
                                </p>
                                <img loading="lazy" src={require("../../assets/images/20230119.jpg")} loading="lazy" alt="review-picture"/>
                                <div className="Phome-review-name">-- Seraphina</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="Phome-email-mobule">
                    <div className="Phome-email-input">
                        <h3>20% OFF <br />Sign up for 20% off your first purchase</h3>
                        <span>Subscribe and get notified at first on the latest update and offers!</span>
                        <br /><input id="home-email-input" placeholder="Enter Your Email Address" /><br />
                        <button onClick={this.signUp}>Subscribe Now</button>
                    </div>
                </div>

                <div className="Phome-warranty-mobule">
                    <div className="Phome-commitment-warranty">
                        <svg t="1707293273688" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2367" width="100" height="100"><path d="M389.569702 659.184529l-19.493957-41.257051H384.103143l6.497985 15.832393c1.856567 4.796132 3.609992 9.385979 5.621273 14.388397h0.360999c2.011281-5.157131 3.970991-9.592264 5.827559-14.388397l6.497985-15.832393h13.511685l-19.5971 41.257051v23.774375h-13.253827zM429.640612 617.979049h39.864626v10.829976h-26.868655v15.007252h22.794521v10.881547h-22.794521v17.379533h27.84851v10.881547h-40.844481v-64.979855zM514.114424 666.30137h-21.092667l-4.538276 16.657534h-13.202256l20.628525-64.979855h15.471394l20.628526 64.979855h-13.356971z m-2.836422-10.314263l-1.908139-7.116841c-2.011281-6.755842-3.764706-14.233683-5.724416-21.247381h-0.360999c-1.650282 7.116841-3.558421 14.491539-5.518131 21.247381l-1.908138 7.116841zM575.329573 682.958904l-13.35697-24.599516h-9.02498v24.599516h-12.995971v-64.979855h22.639807c13.614827 0 24.393231 4.744561 24.393231 19.700242a18.514102 18.514102 0 0 1-12.377115 18.668815l15.471394 26.610798z m-22.38195-34.862208h8.406124c8.354553 0 12.9444-3.506849 12.9444-10.314262s-4.589847-9.43755-12.9444-9.437551h-8.406124zM594.153102 674.707494l7.426269-8.921837a25.785657 25.785657 0 0 0 16.502821 7.168412c6.807413 0 10.314263-2.887994 10.314262-7.47784s-3.91942-6.2917-9.746978-8.767123l-8.66398-3.661564a18.823529 18.823529 0 0 1-13.202257-17.482675c0-10.623691 9.334408-18.823529 22.485093-18.823529a28.725222 28.725222 0 0 1 20.628525 8.354552l-6.549556 8.148268a20.628525 20.628525 0 0 0-13.821112-5.157131c-5.672844 0-9.385979 2.526994-9.385979 6.807413s4.641418 6.343272 10.314262 8.560838l8.509267 3.558421a17.946817 17.946817 0 0 1 13.047542 17.68896c0 10.623691-8.870266 19.64867-23.877518 19.648671a34.398066 34.398066 0 0 1-23.671233-9.489122M415.303787 817.09589l-8.509266 0.979855c0 8.612409-0.360999 12.892828-0.567285 21.505238l8.560838-0.928284c9.128122-1.082998 14.078969-5.672844 14.233683-13.202256s-4.589847-9.385979-13.71797-8.354553M563.674456 795.745367h-0.464142c-1.804996 8.663981-3.816277 18.307816-5.775987 26.559226-0.670427 2.784851-0.979855 4.177276-1.650282 7.013699l16.399678-2.269138c-0.77357-2.578566-1.134569-3.91942-1.856567-6.497986-2.269138-7.684126-4.435133-16.966962-6.6527-24.857373M491.010475 807.039484l-8.560838 1.237712v21.505238l8.560838-1.186141c9.179694-1.340854 13.975826-6.033844 14.027398-13.563255s-4.796132-9.282836-13.872684-7.993554M342.846092 822.304593c-2.269138 8.457695-4.847703 17.946817-7.219984 25.785657l-2.062853 6.858984c6.549557 0 9.850121-0.412571 16.399678-0.773569-0.567284-2.681708-0.876712-4.022562-1.443997-6.6527-1.804996-7.83884-3.455278-17.327961-5.157131-25.424657" fill="#2c2c2c" p-id="2368"></path><path d="M860.467365 749.53747c-234.185334-54.253022-464.399678 55.851732-698.533441 1.547139q-7.116841 77.924255-14.285254 155.693796c243.468171 58.224013 483.635778-56.728445 727.15552 1.59871l-14.233682-158.839645M264.457695 887.697019c-2.062853-14.078969-3.042707-21.092667-5.157131-35.223208-0.876712-6.188558-1.547139-12.738114-1.908139-18.771958h-0.515713c-1.392425 5.930701-2.784851 12.273973-4.33199 18.307817-3.713135 13.666398-5.621273 20.628525-9.385979 34.088638-9.592264-0.928284-14.388396-1.495568-23.980661-2.887994-3.558421-32.696213-5.157131-49.044319-8.612409-81.895246 7.787268 1.340854 11.706688 1.908139 19.493956 2.939565 0.928284 14.800967 1.443997 22.175665 2.423852 36.925061 0.567284 10.314263 0.825141 15.471394 1.443997 25.785657H234.546334c2.114424-8.302981 4.33199-16.657534 6.497985-24.754231 4.280419-14.182111 6.394843-21.298952 10.623691-35.532635 6.343272 0.567284 9.540693 0.825141 15.935536 1.18614 2.423852 14.749396 3.661563 22.124093 6.085415 36.821918 1.134569 8.25141 2.011281 16.915391 3.14585 25.785657h0.515713c1.495568-8.509267 3.094279-16.966962 4.538275-25.218372l7.219984-36.09992c7.219984 0 10.881547 0.257857 18.101531 0.257857-7.168413 31.974214-10.829976 47.90975-18.204673 79.780822-9.79855 0-14.646253-0.412571-24.444803-1.031427m92.157937-1.134569c-1.598711-7.219984-2.37228-10.881547-3.970991-18.101531-9.489122 0.567284-14.233683 0.77357-23.774375 1.082998-2.217566 7.426269-3.300564 11.139404-5.518131 18.514102-7.890411 0-11.861402 0.257857-19.751813 0.257856 11.706688-31.974214 17.431104-48.064464 28.776793-80.399678 9.076551-0.309428 13.666398-0.515713 22.742949-1.082997 8.560838 31.40693 12.9444 47.033038 21.917808 78.233682-8.199839 0.670427-12.273973 0.979855-20.628525 1.495568m72.560838-6.962127c-5.724416-10.314263-8.560838-15.832393-14.182111-26.456084l-9.282837 1.031427-0.773569 28.209508c-7.787268 0.825141-11.655117 1.18614-19.442386 1.908139 1.031426-32.025786 1.547139-48.012893 2.526995-80.038679 11.655117-1.082998 17.431104-1.701853 29.086221-3.042707 16.915391-1.95971 30.942788 1.95971 30.530217 21.298952a27.951652 27.951652 0 0 1-14.13054 24.908945c6.858985 11.809831 10.314263 17.688961 17.379533 29.395648-8.663981 1.18614-13.047542 1.701853-21.711523 2.784851m76.892828-10.314263c-5.930701-10.314263-8.870266-15.471394-14.749395-25.785656l-9.231265 1.289283v28.209508l-19.442386 2.681708c0.360999-31.974214 0.567284-48.012893 0.979855-80.038678 11.603546-1.598711 17.431104-2.423852 29.03465-4.125705 16.915391-2.475423 30.942788 1.289283 30.942788 20.628525a27.848509 27.848509 0 0 1-13.717969 25.11523c7.168413 11.655117 10.778405 17.482675 18.049959 29.137792l-21.763094 3.14585m74.881547-10.314263l-5.157131-17.740532c-9.489122 1.237712-14.233683 1.856567-23.774376 3.197422-1.753425 7.632554-2.681708 11.39726-4.486704 19.029815l-19.751813 2.784851c9.901692-33.418211 14.749396-50.127317 24.238517-83.493957 9.128122-1.289283 13.666398-1.908139 22.794521-3.094279 10.314263 30.942788 15.471394 46.001612 26.404512 76.841257-8.199839 0.928284-12.273973 1.443997-20.628525 2.475423m73.334408-7.684125c-8.560838-14.800967-12.789686-22.175665-21.19581-36.87349-3.352135-6.704271-5.157131-10.056406-8.354553-16.760676h-0.567284c1.134569 8.870266 3.094279 19.64867 3.352135 29.344077l0.77357 26.507655c-7.374698 0.721998-11.036261 1.134569-18.462531 1.95971-0.77357-31.974214-1.18614-47.961322-1.959709-79.935536 7.735697-0.876712 11.603546-1.340854 19.339242-2.062852l21.041096 36.460918 8.509267 17.121676h0.515713a250.481869 250.481869 0 0 1-3.661563-29.344077c-0.360999-10.314263-0.567284-15.883965-0.928284-26.456084 7.219984-0.567284 10.829976-0.77357 18.04996-1.18614 1.340854 31.974214 2.011281 47.961322 3.300564 79.935536-7.890411 0.464142-11.861402 0.721998-19.751813 1.289283m139.242546 1.908138c-7.735697-0.979855-11.603546-1.392425-19.339243-2.062852-0.721998-11.345689-1.082998-17.018533-1.856567-28.364223L745.102337 770.062853c0.360999 6.085415 0.567284 9.282836 0.928283 15.471394-8.663981-0.360999-12.9444-0.515713-21.60838-0.618856 1.392425 25.785657 2.114424 38.523771 3.506849 64.154714h-19.442385c-1.289283-25.785657-1.908139-38.4722-3.197421-64.103143-8.560838 0-12.892828 0-21.453667 0.618856-0.309428-6.343272-0.412571-9.540693-0.721998-15.883965a586.881547 586.881547 0 0 1 61.885576 0c7.941982 0.360999 12.016116 0.618856 20.00967 1.289283 3.14585 7.323127 4.69299 10.98469 7.787268 18.359388l7.684126 18.514101h0.721998c1.804996-6.033844 3.558421-11.39726 5.414988-17.173247l5.157132-17.018534c7.993554 1.031426 11.964545 1.650282 19.906526 2.991137-7.941982 19.184529-12.016116 28.879936-20.267526 48.425463 0.825141 11.345689 1.237712 17.070105 2.011282 28.415794M570.224013 926.530218c-19.390814 16.760677-38.730056 33.676068-58.224013 50.849315q-22.330379-19.751813-44.609186-39.091056-29.550363 3.352135-59.461725 5.982272c34.707494 27.023368 69.518131 53.634166 104.070911 79.729251 45.073328-33.985496 90.559226-68.899275 135.632554-104.43191-25.785657 1.753425-51.571313 4.177276-77.35697 6.962128M921.11523 123.255439h0.773569a923.796938 923.796938 0 0 1-204.5834-35.32635 912.812248 912.812248 0 0 1-190.81386-79.883964L512.257857 0 497.560032 8.045125a918.794521 918.794521 0 0 1-190.81386 79.935536 925.086221 925.086221 0 0 1-101.182917 23.361805c-8.560838 1.340854-17.121676 2.784851-25.785656 4.074134l-25.785657 3.300564-25.785657 2.630137-25.682514 1.908138h0.412571L79.832393 149.556809l32.747784 247.903304 16.399678 123.771152 4.074134 30.942788 1.082997 7.787269 1.237712 8.148267c0.928284 5.157131 1.547139 10.829976 2.733279 16.193392a484.409347 484.409347 0 0 0 16.657535 63.58743 465.327961 465.327961 0 0 0 37.801772 83.2361 589.35697 589.35697 0 0 0 60.080581 7.684126 419.068493 419.068493 0 0 1-53.737309-105.927478 437.892023 437.892023 0 0 1-15.007252-57.192587c-1.082998-4.847703-1.598711-9.746978-2.475423-14.646253l-1.134569-7.271555-1.031426-7.735697-4.074134-30.942788-16.399678-123.771152-29.395649-222.427075h1.856568l27.332796-1.753425 27.281225-2.526994c9.128122-0.979855 18.153102-2.217566 27.229653-3.300565a971.758259 971.758259 0 0 0 107.784045-20.628525A971.809831 971.809831 0 0 0 512 69.930701a972.5834 972.5834 0 0 0 191.071716 70.446414A976.296535 976.296535 0 0 0 894.659146 168.896052l-29.395649 222.478646-16.348106 123.771152-4.125705 30.942788-1.031427 7.735697-1.134568 7.271555c-0.825141 5.157131-1.392425 9.79855-2.423852 14.646253a438.356164 438.356164 0 0 1-15.058824 57.192587 415.097502 415.097502 0 0 1-36.099919 79.007252q25.424658 2.526994 49.560032 6.910556a455.529412 455.529412 0 0 0 30.942788-70.910556 492.867043 492.867043 0 0 0 16.709106-63.587429c1.134569-5.157131 1.804996-10.829976 2.681708-16.193393l1.289283-8.148267 1.031426-7.787269 4.125705-30.942788 16.348107-123.771152L944.167607 149.556809z" fill="#2c2c2c" p-id="2369"></path><path d="M587.036261 557.692184h-73.746978V253.060435H437.01531v-56.728445l150.020951-13.150685z" fill="#2c2c2c" p-id="2370"></path></svg>
                    </div>
                    <div className="Phome-warranty-text" >1-Year Warranty Period</div>
                    
                    <div className="PhomeAdvantage"> 
                        <div id="homeAdvantage_1" >
                            <img id="homeAdvantageImg_1" className={this.state.rotate1?"forward":"reverse"} src={require("../../assets/images/11.png")} loading="lazy" alt="logistics"/><br /><br />
                            <span>Free delivery</span>
                        </div>
                       
                        <div id="homeAdvantage_4">
                            <img id="homeAdvantageImg_4" className={this.state.rotate4?"forward":"reverse"} src={require("../../assets/images/percentage.png")} loading="lazy" alt="logistics"/><br /><br />
                            <span>100% Refund Policy</span>
                        </div>
                    </div>

                </div>

                <PhoneFooter name="home" onRef={this.onRef} ISO={this.state.ISO} headCurrChange={this.headCurrChange}/>

            </div>
        );
    }
}

export default Home;