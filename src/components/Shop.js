import React,{Component} from "react";
import Head from "./Head";
import Footer from "./Footer";
import { reactFacekookPixel } from "./publicCom/ReactFacekookPixel";
import "../assets/css/shop.css";
import axios from "axios";
import { Link } from "react-router-dom";
class Shop extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            curr: localStorage.getItem("curr")?localStorage.getItem("curr"):"$",
            currNum : localStorage.getItem("currNum")?localStorage.getItem("currNum"):1,
            ISO : localStorage.getItem("ISO")?localStorage.getItem("ISO"):"USD",
            productArr : [{"indent":"load","img":"load.jpg","title":"ZH - Home RF Beauty Device","func":"Reduce nasolabial lines , Color light skin rejuvenation , Tighten the skin,Nutrient delivery","sale":209,"delete_sale":259,"off":"50"}],
            nowCategory : "all",
            nowSerise : "all",
            description: "High-end porcelain from Jingdezhen , Blue-and-white porcelain , Luxury tableware"
         };
    }

    componentDidMount(){
        document.querySelector('meta[name="description"]').setAttribute("content", this.state.description);
        //获取产品信息
        if(window.location.search){
            let category = window.location.search.split("?category=")[1].split("&cou=")[0];
            //获取详情信息
            this.setState({
                nowCategory : category
            },
                ()=>{
                    this.getProductInfo()
                }
            )
            
        }
        else{
            this.getProductInfo() 
        }
        this.pageLoad()
    }

    pageLoad=()=>{
        axios.post("/api/page_click",{
            page : "shop"
        })
    }

    //选择产品类别时
    selectCategory=(e)=>{
        this.setState({
            nowCategory : e.target.value
        },
            ()=>{
                this.getProductInfo()
            }
        )
    }

    //选择系列时
    selectSeries=(e)=>{
        this.setState({
            nowSerise : e.target.value
        },
            ()=>{
                this.getProductInfo()

            }
        )
    }

    //获取产品信息
    getProductInfo=()=>{
        if(this.state.nowCategory === "all" && this.state.nowSerise === "all" ){
            axios.post("/api/get_all_products")
                .then((response)=>{
                    this.setState({
                        productArr : response.data
                    })
            })

            return
        }

            axios.post("/api/get_condition_products",{
                category : this.state.nowCategory === "all" ? "" : this.state.nowCategory,
                series : this.state.nowSerise === "all" ? "" : this.state.nowSerise
            })
                .then((response)=>{
                    this.setState({
                        productArr : response.data
                    })
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
                <div id="head-fixed" className="head-fixed" onMouseEnter={this.changeBackwhite} onMouseLeave={this.changeBackOp}>
                    <Head name="shop" headRef={this.headRef} ISO={this.state.ISO} headCurrChange={this.headCurrChange} shopScrollShow={this.shopScrollShow}/>
                </div>

                <h2 className="shop-promise-title">CRAFTED BY TRADITION</h2>
                <p className="shop-promise-info">All of our pieces are made in Jingdezhen using high-fired porcelain (above 1300°C), and each one is crafted entirely by hand using traditional techniques, reflecting the timeless craftsmanship and artistic heritage of China’s porcelain capital.</p>

                <div className="shop-choose-mobule">
                    <select onChange={this.selectCategory}>
                        <option value="all">All</option>
                        <option value="plate">Plate</option>
                        <option value="bowl">Bowl</option>
                        <option value="cup">Tea & Water Cups</option>
                        <option value="coffee">Coffee Cups</option>
                        <option value="zhen">Classical</option>
                    </select>
                    <div className="shop-choose-btn-mobule">
                        <button value="all" onClick={this.selectSeries}>All</button>
                        <button value="qinghua" onClick={this.selectSeries}>Blue and White</button>
                        <button value="linglong" onClick={this.selectSeries}>LingLong</button>
                        <button value="creativity" onClick={this.selectSeries}>Creativity</button>
                        <button value="falang" onClick={this.selectSeries}>FaLang</button>
                    </div>
                </div>

                <div className="shop-products-mobule">
                    {
                        this.state.productArr.map((value , key)=>{
                            return  <div className="shop-product-info">
                                            <img  value={key + 1} onClick={this.turnDetailPage} src={require("../assets/images/proImg/"+value.indent+"/" + value.img)} alt="china" loading="lazy" />
                                            <div className="shop-product-info-title">{value.title}</div>
                                            <div style={{width:"100%",display:"grid",gridTemplateColumns:"50% 50%",marginTop:"10px"}}>
                                                <div style={{paddingLeft:"50%"}}><b>{this.state.curr}{(value.sale*this.state.currNum).toFixed(2)}</b></div> 
                                                <div className="shop-cart-btn" value={key} onClick={this.addCartProInfo}>
                                                    <svg t="1706870253058" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="32464" width="25" height="25"><path d="M373.845477 766.654864c-52.878324 0-95.745644 42.868343-95.745644 95.751784 0 52.876278 42.866297 95.745644 95.745644 95.745644 52.881394 0 95.747691-42.868343 95.747691-95.745644C469.592145 809.523207 426.725848 766.654864 373.845477 766.654864zM373.845477 915.598104c-29.377074 0-53.193503-23.816428-53.193503-53.197596 0-29.372981 23.816428-53.18941 53.193503-53.18941 29.377074 0 53.193503 23.816428 53.193503 53.18941C427.03898 891.781676 403.222551 915.598104 373.845477 915.598104zM215.001749 192.166671l-22.011316-127.667681L65.324798 64.49899l0 42.558281 88.781022 0 102.716406 595.769892 595.765799 0 0-42.554188L295.709909 660.272975l-11.512195-66.768683 568.389288-60.896952L958.975031 234.724952l0-42.558281L215.001749 192.166671zM831.311443 490.052129l-554.331108 61.58973-54.641481-316.916906 687.532829 0L831.311443 490.052129zM735.561705 766.654864c-52.878324 0-95.747691 42.868343-95.747691 95.751784 0 52.876278 42.868343 95.745644 95.747691 95.745644s95.747691-42.868343 95.747691-95.745644C831.309396 809.523207 788.44003 766.654864 735.561705 766.654864zM735.561705 915.598104c-29.379121 0-53.193503-23.816428-53.193503-53.197596 0-29.377074 23.814382-53.191456 53.193503-53.191456 29.377074 0 53.193503 23.814382 53.193503 53.191456C788.755208 891.781676 764.93878 915.598104 735.561705 915.598104z" fill="#515151" p-id="32465"></path></svg>
                                                    <svg t="1706954481842" id={"addStatus" + key} class="addStatus" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3666" width="16" height="16"><path d="M511.8848 959.7056c-247.1296-0.0192-447.84-200.9088-447.6928-448.096 0.1408-247.2576 200.896-448.192 447.5392-447.936 248.352 0.256 448.6464 200.5824 448.4928 448.5824-0.1536 247.1424-200.8704 447.4688-448.3392 447.4496z m-38.8672-341.4272c-0.8384-0.6528-1.3504-1.0304-1.8304-1.4336-17.4784-14.6752-34.9504-29.3504-52.4288-44.0256-15.1936-12.7552-30.2464-25.6704-45.6256-38.1888-10.5728-8.608-22.5344-10.0032-34.7136-3.8464-12.1856 6.1568-18.0032 16.64-17.504 30.2592 0.3776 10.3488 5.6512 18.1696 13.5232 24.6976 21.2608 17.6256 42.3424 35.4752 63.4944 53.2352 20.0896 16.8704 40.2176 33.696 60.2432 50.6368 6.144 5.1968 12.992 8.64 21.0688 8.9088 13.0944 0.4352 22.9056-5.312 29.7472-16.4352C563.8784 592.8768 618.7904 503.68 673.6896 414.4768c8.4352-13.7024 17.0304-27.3088 25.248-41.1392 6.4832-10.8992 6.5152-22.24-0.0384-33.0752-6.4832-10.7264-16.448-15.9744-28.9856-15.3664-11.7376 0.5696-20.3456 6.5472-26.4896 16.5312-55.872 90.8544-111.8016 181.6768-167.712 272.512-0.832 1.344-1.6704 2.688-2.6944 4.3392z" p-id="3667" fill="#0d9c16"></path></svg>
                                                </div>
                                            </div>
                                            <button value={key + 1} onClick={this.turnDetailPage} onMouseEnter={this.onMouseLeaveBtn} onMouseLeave={this.onMouseEnterBtn}>Learn More</button>
                                        </div>
                        })
                    }
                    
                </div>

               
                <Footer name="shop" onRef={this.onRef} ISO={this.state.ISO} headCurrChange={this.headCurrChange}/>
            </div>
        );
    }
}

export default Shop;