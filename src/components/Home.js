import React,{Component} from "react";
import axios from "axios"
import { Link } from "react-router-dom";
import Review from "./Review";
import Head from "./Head"
import Footer from "./Footer"
import { reactFacekookPixel } from "./publicCom/ReactFacekookPixel";
import "../assets/css/home.css";
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            productArr : [{"indent":"C12_2","img":"p0.png","title":"Wanshou flower dinner plate","sale":112},
                            {"indent":"A1_3","img":"p0.png","title":"Blue and White Porcelain Mirror-Reflection Coffee Cup Set (Pair)","sale":109},
                            {"indent":"Zhen1","img":"p0.png","title":"Blue and White Landscape Tea Set","sale":221}
                        ],
            curr: localStorage.getItem("curr")?localStorage.getItem("curr"):"$",
            currNum : localStorage.getItem("currNum")?localStorage.getItem("currNum"):1,
            ISO : localStorage.getItem("ISO")?localStorage.getItem("ISO"):"USD",
            automatic : null , //用于定义轮播图自动播放方法

            //控制评论去动态
            reviewCss : false,
            //下面是旋转效果参数，通过控制classname来实现样式更换
            rotate1 : false,
            rotate2 : false,
            rotate3 : false,
            rotate4 : false,
            description: "Skincare, Skincare Products, Beauty Devices | Radio Frequency Beauty Device, Microcurrent Beauty Device."
         };
    }

    
    componentDidMount(){
        document.querySelector('meta[name="description"]').setAttribute("content", this.state.description);
        //document.body.scrollTop = document.documentElement.scrollTop = 0;
        //this.pageLoad()
        this.Carousel(1)
    }


    //记录访问页面的次数用的
    pageLoad=()=>{
        axios.post("/api/page_click",{
            page : "home"
        })
    }

    //banner轮播
    Carousel=(e)=>{
        const doc = document.getElementById("home-back-Slideshow-mobule")
        const img1 = document.getElementById("home-back-Slideshow-1")
        const img2 = document.getElementById("home-back-Slideshow-2")
        const line1 = document.getElementById("home-back-Slideshow-index-line-1")
        const line2 = document.getElementById("home-back-Slideshow-index-line-2")
        const line3 = document.getElementById("home-back-Slideshow-index-line-3")
        let index = Number(e);
        this.state.automatic = setInterval(()=>{
            for(let i = 0 ; i <= 100 ; i++){
                setTimeout(()=>{
                    doc.style.left = `-${i}%`
                    if(i === 100){
                        img1.src = require(`../assets/images/home_back_${index + 1}.jpg`)
                        doc.style.left = "0%"
                        img2.src = require(`../assets/images/home_back_${index + 2 > 3 ? 1 :  index + 2}.jpg`)
                        //下面是下边轮播条
                        line1.style.backgroundColor = index === 0 ? "#F7F4EF" : "#1D3F75"
                        line2.style.backgroundColor = index === 1 ? "#F7F4EF" : "#1D3F75"
                        line3.style.backgroundColor = index === 2 ? "#F7F4EF" : "#1D3F75"
                        index = index === 2 ? 0 : index + 1
                    }
                },i*6)
            }
        },3000)
    }

    //停止轮播并显示当前图片
    stopAutomatic=(e)=>{
        clearInterval(this.state.automatic)
        document.getElementById("home-back-Slideshow-mobule").style.left = "0"
        document.getElementById("home-back-Slideshow-1").src = require(`../assets/images/home_back_${e.target.getAttribute("value")}.jpg`)
        document.getElementById("home-back-Slideshow-2").src = require(`../assets/images/home_back_${Number(e.target.getAttribute("value")) === 3 ? 1 : Number(e.target.getAttribute("value")) + 1 }.jpg`)
        for(let i = 1; i <= 3; i++){
            document.getElementById(`home-back-Slideshow-index-line-${i}`).style.backgroundColor = "#224b81"
        }
        e.target.style.backgroundColor = "#F7F4EF"
    }

    //鼠标离开显示条，重新开始轮播
    starAutomatic=(e)=>{
        this.Carousel(e.target.getAttribute("value") === "3" ? 0 :  e.target.getAttribute("value"))
    }

    //改变货币时改变页面所有货币和金额
    headCurrChange=(curr,currNum,ISO)=>{
        this.setState({
            curr : curr,
            currNum : currNum,
            ISO : ISO
        })
        
    }


    //learn more改变按钮样式
    onMouseEnterBtn=(e)=>{
        for(let i = 1 ; i <= 100 ; i++){
            setTimeout(()=>{
                e.target.style.backgroundImage = `linear-gradient(90deg, #F5F8FB 0, #F5F8FB ${i}%, #002D5C 0, #002D5C 100%)`
            },i*3)
            
        }
    }

    onMouseLeaveBtn=(e)=>{
        for(let i = 0 ; i <= 100 ; i++){
            setTimeout(()=>{
                e.target.style.backgroundImage = `linear-gradient(-90deg, #002D5C 0, #002D5C ${i}%, #F5F8FB 0, #F5F8FB 100%)`
            },i*3)
            
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
                <div id="head-fixed" className="head-fixed" >
                    <Head name="home" headRef={this.headRef} ISO={this.state.ISO} headCurrChange={this.headCurrChange} scrollShow={this.scrollShow}/>
                </div>
                <div className="home-back-mobule">
                    <div className="home-back-top-line-mobule"></div>
                    <div id="home-back-Slideshow-mobule" className="home-back-Slideshow-mobule">
                        <img id="home-back-Slideshow-1" className="home-back-img" src={require("../assets/images/home_back_1.jpg")} alt="proceast picture"/>
                        <img id="home-back-Slideshow-2" className="home-back-img" src={require("../assets/images/home_back_2.jpg")} alt="jingdezhen Porcelain"/>
                    </div>
                    {/**是banner的下边框，也是轮播图的index */}
                    <div id="home-back-Slideshow-index-line-mobule" className="home-back-Slideshow-index-line-mobule">
                        <div id="home-back-Slideshow-index-line-1" value="1" style={{backgroundColor:"#F7F4EF"}} onMouseEnter={this.stopAutomatic} onMouseLeave={this.starAutomatic}></div>
                        <div id="home-back-Slideshow-index-line-2" value="2" onMouseEnter={this.stopAutomatic} onMouseLeave={this.starAutomatic}></div>
                        <div id="home-back-Slideshow-index-line-3" value="3"  onMouseEnter={this.stopAutomatic} onMouseLeave={this.starAutomatic}></div>
                    </div>

                    {/**下面是banner的标语 */}
                    <div className="home-back-tagline-mobule">
                        <h2>Experience a Thousand Years<br /> of Porcelain</h2>
                        <p>Discover the unique beauty of Jingdezhen porcelain <br />— where tradition meets refined living.</p>
                        <Link to="/shop"><button>View Pieces</button></Link>
                    </div>

                </div>

                <div className="home-four-series-mobule">
                    <h3>Major Series</h3>
                    <p>These two styles represent some of the most iconic and time-honored porcelain traditions of Jingdezhen</p>
                    <div className="home-series-qinghua-mobule">
                        <img src={require("../assets/images/122.png")} alt="Blue and White Porcelain"/>
                        <div>
                            <p>
                                Originally known in China as Qinghua Ci (blue flower porcelain), this iconic ceramic style has a history of over 1,300 years and was once used exclusively by the imperial court. Introduced to Europe in the 16th century, it captivated collectors with its striking cobalt-on-white design and became widely known as Blue and White Porcelain.
                            </p>
                            <button onMouseEnter={this.onMouseEnterBtn} onMouseLeave={this.onMouseLeaveBtn}>Blue and White Porcelain</button>
                        </div>
                        
                    </div>

                    <div className="home-series-linglong-mobule">
                        <div>
                            <p>
                                Linglong porcelain, a distinctive category of traditional Chinese ceramics, dates back to the Ming dynasty and was once favored by the royal court. Known for its delicate openwork patterns carved directly into the porcelain body and combined with underglaze blue decoration, it allows light to pass through the tiny pierced holes, creating a refined, jade-like translucency. This intricate craftsmanship makes each piece both artistic and timeless.
                            </p>
                            <button onMouseEnter={this.onMouseLeaveBtn} onMouseLeave={this.onMouseEnterBtn}>Linglong Porcelain</button>
                        </div>
                        <img src={require("../assets/images/133.png")} alt="linglong Porcelain"/>
                    </div>
                </div>
                
                <div className="home-about-jingdezhen-mobule">
                    <h2>Jingdezhen Porcelain Culture</h2>
                    <p>
                        As the birthplace of porcelain, Jingdezhen has upheld an unbroken legacy for over a thousand years. Today, its timeless ceramic art has long been deeply woven into everyday life.
                    </p>
                    
                    <Link style={{width:"100%"}} to="/about1"><button>Learn More</button></Link>
                    
                </div>

                <div className="home-recommend-mobule">
                    <h3>Recommend Porcelain</h3>
                    <div className="home-recommend-products-mobule">
                        {
                            this.state.productArr.map((value , key)=>{
                                return  <div className="home-product-info">
                                            <img  value={key + 1} onClick={this.turnDetailPage} src={require("../assets/images/proImg/"+value.indent+"/" + value.img)} alt="china" loading="lazy" />
                                            <div className="home-product-info-title">{value.title}</div>
                                            <div style={{width:"100%",display:"grid",gridTemplateColumns:"50% 50%",marginTop:"10px"}}>
                                                <div style={{paddingLeft:"50%"}}><b>{this.state.curr}{(value.sale*this.state.currNum).toFixed(2)}</b></div> 
                                                <div className="home-cart-btn" value={key} onClick={this.addCartProInfo}>
                                                    <svg t="1706870253058" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="32464" width="25" height="25"><path d="M373.845477 766.654864c-52.878324 0-95.745644 42.868343-95.745644 95.751784 0 52.876278 42.866297 95.745644 95.745644 95.745644 52.881394 0 95.747691-42.868343 95.747691-95.745644C469.592145 809.523207 426.725848 766.654864 373.845477 766.654864zM373.845477 915.598104c-29.377074 0-53.193503-23.816428-53.193503-53.197596 0-29.372981 23.816428-53.18941 53.193503-53.18941 29.377074 0 53.193503 23.816428 53.193503 53.18941C427.03898 891.781676 403.222551 915.598104 373.845477 915.598104zM215.001749 192.166671l-22.011316-127.667681L65.324798 64.49899l0 42.558281 88.781022 0 102.716406 595.769892 595.765799 0 0-42.554188L295.709909 660.272975l-11.512195-66.768683 568.389288-60.896952L958.975031 234.724952l0-42.558281L215.001749 192.166671zM831.311443 490.052129l-554.331108 61.58973-54.641481-316.916906 687.532829 0L831.311443 490.052129zM735.561705 766.654864c-52.878324 0-95.747691 42.868343-95.747691 95.751784 0 52.876278 42.868343 95.745644 95.747691 95.745644s95.747691-42.868343 95.747691-95.745644C831.309396 809.523207 788.44003 766.654864 735.561705 766.654864zM735.561705 915.598104c-29.379121 0-53.193503-23.816428-53.193503-53.197596 0-29.377074 23.814382-53.191456 53.193503-53.191456 29.377074 0 53.193503 23.814382 53.193503 53.191456C788.755208 891.781676 764.93878 915.598104 735.561705 915.598104z" fill="#515151" p-id="32465"></path></svg>
                                                    <svg t="1706954481842" id={"addStatus" + key} class="addStatus" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3666" width="16" height="16"><path d="M511.8848 959.7056c-247.1296-0.0192-447.84-200.9088-447.6928-448.096 0.1408-247.2576 200.896-448.192 447.5392-447.936 248.352 0.256 448.6464 200.5824 448.4928 448.5824-0.1536 247.1424-200.8704 447.4688-448.3392 447.4496z m-38.8672-341.4272c-0.8384-0.6528-1.3504-1.0304-1.8304-1.4336-17.4784-14.6752-34.9504-29.3504-52.4288-44.0256-15.1936-12.7552-30.2464-25.6704-45.6256-38.1888-10.5728-8.608-22.5344-10.0032-34.7136-3.8464-12.1856 6.1568-18.0032 16.64-17.504 30.2592 0.3776 10.3488 5.6512 18.1696 13.5232 24.6976 21.2608 17.6256 42.3424 35.4752 63.4944 53.2352 20.0896 16.8704 40.2176 33.696 60.2432 50.6368 6.144 5.1968 12.992 8.64 21.0688 8.9088 13.0944 0.4352 22.9056-5.312 29.7472-16.4352C563.8784 592.8768 618.7904 503.68 673.6896 414.4768c8.4352-13.7024 17.0304-27.3088 25.248-41.1392 6.4832-10.8992 6.5152-22.24-0.0384-33.0752-6.4832-10.7264-16.448-15.9744-28.9856-15.3664-11.7376 0.5696-20.3456 6.5472-26.4896 16.5312-55.872 90.8544-111.8016 181.6768-167.712 272.512-0.832 1.344-1.6704 2.688-2.6944 4.3392z" p-id="3667" fill="#0d9c16"></path></svg>
                                                </div>
                                            </div>
                                            <button value={key + 1} onClick={this.turnDetailPage} onMouseEnter={this.onMouseLeaveBtn} onMouseLeave={this.onMouseEnterBtn}>Learn More</button>
                                        </div>
                            })
                        }
                    </div>
                </div>

               

                <Footer name="home" onRef={this.onRef} ISO={this.state.ISO} headCurrChange={this.headCurrChange}/>

            </div>
        );
    }
}

export default Home;