import React,{Component} from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../assets/css/pay.css"
import Login from "./publicCom/Login";
import ForgetPassword from "./publicCom/ForgetPassword";
import Register from "./publicCom/Register";
import Shipping from "./payPolicyComponents/Shipping";
import Returned from "./payPolicyComponents/Returned";
import Provacy from "./payPolicyComponents/Provacy";
import ContactInfo from "./payPolicyComponents/ContactInfo";


class Pay extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            //用于提交后台结账产品信息字符串
            payProStr : null,
            //要结账的产品信息
            nowPayPro : [{"indent":"load","title":"","sale":"","series":"","video_img":"load.jpg","video":"load.jpg","img_arr":"load.jpg","functions":"","choose":"load.jpg","sum":0,"proth":"0"}],
            //总金额
            payNumber : 0,
            //没有优惠的金额
            payDeleteNumber : 0,
            //因为有些产品限时优惠 $50 有些没有,所以要统计有多少个存在优惠$50的产品,好计算一共优惠了多少
            ltoProNum : 0, 
            //选择了优惠劵，没有就是 1 , 20%卷就是 0.8
            saveNum : 1,
            
            //当前点击选择查看的政策
            chooseProvacy: "",
            //控制登录显示的
            login : "",

            discount : [{"saveNum" : 1,"title":"No coupons available"}],
            curr: localStorage.getItem("curr")?localStorage.getItem("curr"):"$",
            currNum : localStorage.getItem("currNum")?localStorage.getItem("currNum"):1,
            ISO : localStorage.getItem("ISO")?localStorage.getItem("ISO"):"USD"
         };
    }

    componentDidMount(){
        if(window.location.search){
            let payNum = window.location.search.split("?payNum=")[1];
            this.getCartInfo(payNum)
            
        }
        //获取折扣
        this.getDiscount()
        
        this.pageLoadAdd()
   }

   //加载一次页面传给后端
   pageLoadAdd=()=>{
        axios.post("/api/page_click",{
            page : "pay"
        })
    }

    //获取折扣
    getDiscount=()=>{
        if(!localStorage.getItem("userName")){
            
            return
        }
        axios.post("/api/get_discount",{
            user : localStorage.getItem("userName")
        })
        .then((res)=>{
            if(!res.data){
                this.setState({
                    discount : [{"saveNum" : 1,"title":"No coupons available"}],
                    saveNum : 1
                })
            }
            else{
                
                let dArr = [{"saveNum" : 1,"title":"No coupons available"}]
                let resArr = res.data.split("%")
                for(let i = 0;i < resArr.length - 1;i++){
                    let discount = {"saveNum" : 1,"title":"No coupons available"}
                    discount.saveNum = (1 - resArr[i]/100).toFixed(2)
                    discount.title = "Discount Coupon - Save" + resArr[i] + "%"
                    dArr.push(discount)
                }
                this.setState({
                    discount : dArr
                })
            }
        })
    }

   
   //获取要付款信息,如果产品界面跳转过来的就e的第一字母是b直接去产品信息,如果c就从本地过去信息
   getCartInfo=(e)=>{
        let proArr = []
        if(e === "c"){
            proArr = localStorage.getItem("cart").split(",")
            this.setState({
                payProStr : localStorage.getItem("cart")
            })
        }
        else{
            proArr.push(e.substring(1,e.length))
            this.setState({
                payProStr : e.substring(1,e.length)
            })
        }
        let cartArr = [] 
        let indentArr = []
        for (let i = 0; i < proArr.length; i++) {
            let proJson = {"indent":"","title":"","proth":"","sale":"","sum":""}
            indentArr[i]= proArr[i].split("=")[0]
            proJson.indent = proArr[i].split("=")[0]
            proJson.proth = proArr[i].split("=")[1].split("s")[0]
            proJson.sum = proArr[i].split("s")[1]
            cartArr.push(proJson) 
        }

        axios.post("/api/get_cart_info",{
            indentArr : indentArr
        })
        .then((response)=>{
            let resJosnArr = response.data
            //用于计算总金额
            let sum = 0
            //用于计算没有优惠的金额
            let dSum = 0
            //因为有些产品限时优惠 $50 有些没有,所以要统计有多少个存在优惠$50的产品,好计算一共优惠了多少
            let ltoProNum = 0
            for (let i = 0; i < cartArr.length; i++) {
                for (let j = 0; j < resJosnArr.length; j++) {
                    if(cartArr[i].indent === resJosnArr[j].indent){
                        cartArr[i].title = resJosnArr[j].title
                        cartArr[i].sale = resJosnArr[j].sale
                        cartArr[i].delete_sale = resJosnArr[j].delete_sale
                        sum = sum + Number(resJosnArr[j].sale) * Number(cartArr[i].sum)
                        //计算没有限时优惠的金额,delete_sale == 0 是判断是否是存在优惠产品，=0是没有优惠就直接在sale价格
                        dSum = dSum + (Number(resJosnArr[j].delete_sale) === 0 ? Number(resJosnArr[j].sale):Number(resJosnArr[j].delete_sale)) * Number(cartArr[i].sum)
                        ltoProNum = ltoProNum + Number(resJosnArr[j].delete_sale) === 0 ? 0 : 1* Number(cartArr[i].sum)
                    }  
                }
            }
            this.setState({
                nowPayPro : cartArr,
                payNumber : sum,
                payDeleteNumber : dSum,
                ltoProNum : ltoProNum
            })

        })
        .catch(function (error) {
            console.log(error)
        })
    }

    changeSaveNum=(e)=>{
        this.setState({
            saveNum : e.target.value
        })
        document.getElementById("pay-coupon").innerText = e.target.getAttribute("title")
    }

    //发起付款
    paymentNow=(e)=>{
        if(this.state.payProStr === null){
            alert("You haven't selected any products yet")
            return
        }
        //防止重复提交
        e.target.disabled = true ;
        for (let i = 4; i <= 4&&i >= 0; i--) {
            setTimeout(()=> {
                if(i === 0){
                    e.target.disabled=false;
                }
            }, 1000 * (4 - i)); 
        } 
        axios.post("/api/paypal/create_payment",{
            payMethod : e.currentTarget.getAttribute("value"),
            payProStr : this.state.payProStr,
            saveNum : this.state.saveNum === 1? ("1.00" + ""):(this.state.saveNum + ""),
            user : localStorage.getItem("userName"),
            curr : this.state.ISO,
            cou : localStorage.getItem("cou")
        })
        .then((response)=>{
            localStorage.removeItem("cou")
            window.location.href = `${response.data}`
        })
        .catch(function (error) {
            console.log(error)
        })
        
    }



    isShowAddress=(e)=>{
        if(e.target.value === "close"){
            document.getElementById("payShowAddress").style.display = "none"
        }
        if(e.target.value === "open"){
            document.getElementById("payShowAddress").style.display = "block"
        }
    }

    //改变货币时改变页面所有货币和金额
    currChange=(e)=>{
        let currNumArr={"USD":1,"EUR":0.91,"GBP":0.79}
        let currISOArr={"USD":"$","EUR":"€","GBP":"£"}
        this.setState({
            curr : currISOArr[e.target.value],
            ISO : e.target.value,
            currNum : currNumArr[e.target.value]
        })
        localStorage.setItem("curr",currISOArr[e.target.value])
        localStorage.setItem("ISO",e.target.value)
        localStorage.setItem("currNum",currNumArr[e.target.value])
    }

    //登录需要的方法
    openLogin=()=>{
        //将Login组件添加进来
        this.setState({
            login : <Login name="pay" changePage={this.changePage} getDiscount={this.getDiscount} />
        })
        document.getElementById("head-login-mobule").style.display = "block"
    }

    //切换忘记密码和登录页面
    changePage=(e)=>{
        // e 的值 0 表示 登录页面 , 1 表示忘记密码页面
        if(e === 0){
            this.setState({
                login : <Login changePage={this.changePage} name="pay"  getDiscount={this.getDiscount}/>
            })
        }
        if(e === 1){
            this.setState({
                login : <ForgetPassword changePage={this.changePage} />
            })
        }
    }

    closeLogin=()=>{
        document.getElementById("head-login-mobule").style.display = "none"
    }

    onRef = (ref) => {
        this.childFooter = ref
    }

    //点击政策显示对应页面
    choosePolicyPage=(e)=>{
        let pArr = {"shipping":<Shipping />,"return":<Returned />,"provacy":<Provacy />,"contact":<ContactInfo />}
        this.setState({
            chooseProvacy : pArr[e.target.getAttribute("value")]
        },
            ()=>{
                document.getElementById("pay-policy-btn-info-mobule").style.display = "block"
            }
        )
        
    }

    //关闭政策页面
    closePolicy=()=>{
        document.getElementById("pay-policy-btn-info-mobule").style.display = "none"
    }

    render() {
        return (
            <div>
                <div className="pay-head">
                    <h1>ProcEast</h1>
                    <div className="pay-head-right">
                        <div className="payHeadISO">
                            <div><svg t="1744786561607" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2865" width="20" height="20"><path d="M512 0C229.2 0 0 229.2 0 512s229.2 512 512 512 512-229.2 512-512S794.8 0 512 0zM337.6 924.8c-53.3-22.6-101.3-54.9-142.4-96-41.2-41.2-73.5-89.1-96-142.4C75.8 631.2 64 572.5 64 512c0-29 2.7-57.6 8.1-85.5 6.5 2.5 13.8 3.9 20.9 3.9 9.7 0 19.3-2.4 27.1-7.6 8-5.3 17.3-8.1 26.5-8.1 7.9 0 15.8 2.1 22.8 6.4 8.1 5 13.8 11.6 13.8 22.8 0 81.6 2.8 168.7 76.9 169.9 2.2 0 41.2 14.9 59.8 63.3 2.2 5.6 6.4 7.4 12.2 7.4 11.5 0 29-7.4 47.6-7.4 13.9 0 0 23.6 0 74.5C379.8 802 489 880.1 489 880.1c-0.6 32 0.9 58.5 3.3 79.4-53.5-2.2-105.5-13.9-154.7-34.7z m491.2-96c-41.2 41.2-89.1 73.5-142.4 96-24.4 10.3-49.4 18.4-75 24.1-1.5-0.3-3.2-0.4-5-0.4-3.5 0-7.5 0.5-12 1.7 15.5-65.5 22.9-102.4 54.9-130.2 44-38.2 9.7-80.4-24-80.4-1.9 0-3.9 0.1-5.8 0.4-1.5 0.2-2.8 0.3-4 0.3-22.2 0-7.5-34.9-31.1-36.9-24.8-2.1-57.3-51.4-93.4-68.5-19-9-37.5-33.2-67-34.5h-1.7c-18.6 0-42.3 11.1-54.4 11.1-4.8 0-7.8-1.8-7.8-6.7 0-57.1-5.9-97.7-6.8-113.8-0.4-5.5-2-7.1-1.1-7.1 1.2 0 7.2 3.2 27.8 3.7h0.5c18.6 0 9.7-38.5 28.1-40 0.8-0.1 1.6-0.1 2.4-0.1 16.4 0 47.5 11.8 63.8 11.8 3.4 0 6.1-0.5 7.9-1.7 0.2-0.1 0.4-0.2 0.7-0.2 8.8 0 43.4 86.3 62.8 86.3 8 0 13.4-14.7 13.4-56 0-17.1-9-46.9 0-63.3 35.1-64.2 67.9-116.7 65.1-124.1-0.9-2.3-11.3-4.4-25-4.4-11.7 0-25.7 1.5-38.3 5.6-9.4 3.1 2.8 17.7-10.2 20.8-8.7 2-17.2 2.9-25.2 2.9-38.2 0-65.8-20.3-53.3-39.8 15.9-23.9 72.8-10.6 77.9-58.6 2.3-22.2 4.3-47.2 5.8-68.5 0.5-7.7 6.7-13.7 14.4-14.2 37.2-2.7 41-47 6.2-75.3 37.5 5.4 74.1 15.6 109.2 30.5 53.3 22.6 101.3 54.9 142.4 96 37.4 37.4 67.4 80.3 89.6 127.8-5.7-3.5-11.6-5.2-17.4-5.2-28.3 0-54.2 38.4-38 82-133 102-98.9 173.4-55.5 214 12.8 12 25.4 27.4 36.4 42.7 10.6 14.6 17.2 31.5 21 49.2 1.4 6.4 6.4 9.6 13.7 9.6 11 0 27-7.3 43.1-21.7-22.2 50.3-53.4 95.8-92.7 135.1z" p-id="2866"></path></svg></div>
                            <select id="headISOSelect" onChange={this.currChange} value={this.state.ISO}>
                                <option value="USD">USD&nbsp;($)</option>
                                <option value="EUR">EUR&nbsp;(€)</option>
                                <option value="GBP">GBP&nbsp;(£)</option>
                            </select>
                        </div>
                        <div className="pay-cart">
                            <Link  className="headCart" rel="noopener noreferrer"  to="/cart">
                                <svg t="1706870253058" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="32464" width="25" height="25"><path d="M373.845477 766.654864c-52.878324 0-95.745644 42.868343-95.745644 95.751784 0 52.876278 42.866297 95.745644 95.745644 95.745644 52.881394 0 95.747691-42.868343 95.747691-95.745644C469.592145 809.523207 426.725848 766.654864 373.845477 766.654864zM373.845477 915.598104c-29.377074 0-53.193503-23.816428-53.193503-53.197596 0-29.372981 23.816428-53.18941 53.193503-53.18941 29.377074 0 53.193503 23.816428 53.193503 53.18941C427.03898 891.781676 403.222551 915.598104 373.845477 915.598104zM215.001749 192.166671l-22.011316-127.667681L65.324798 64.49899l0 42.558281 88.781022 0 102.716406 595.769892 595.765799 0 0-42.554188L295.709909 660.272975l-11.512195-66.768683 568.389288-60.896952L958.975031 234.724952l0-42.558281L215.001749 192.166671zM831.311443 490.052129l-554.331108 61.58973-54.641481-316.916906 687.532829 0L831.311443 490.052129zM735.561705 766.654864c-52.878324 0-95.747691 42.868343-95.747691 95.751784 0 52.876278 42.868343 95.745644 95.747691 95.745644s95.747691-42.868343 95.747691-95.745644C831.309396 809.523207 788.44003 766.654864 735.561705 766.654864zM735.561705 915.598104c-29.379121 0-53.193503-23.816428-53.193503-53.197596 0-29.377074 23.814382-53.191456 53.193503-53.191456 29.377074 0 53.193503 23.814382 53.193503 53.191456C788.755208 891.781676 764.93878 915.598104 735.561705 915.598104z" fill="#515151" p-id="32465"></path></svg>
                                <div style={{fontSize:"12px",backgroundColor:"rgba(255, 255, 255, 0.048)",borderRadius:"50%"}}>{this.state.cartNum}</div>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="pay-order-mobule">
                    <div className="pay-right-payment-mobule">
                        <div className="pay-payment-paypal-btn-mobule">
                            <h4>Express checkout</h4>
                            <div className="pay-paypal-btn" value="paypal" onClick={this.paymentNow}>
                                <img src={require("../assets/images/Paypal.png")}/>
                            </div>
                            <div className="pay-payment-divider"><div></div><p>OR</p><div></div></div>
                            <div className="pay-credit-btn" value="card" onClick={this.paymentNow}>
                                <img src={require("../assets/images/card.png")}/>
                                <div>Credit or Debit Card</div>
                            </div>
                            
                            <div className="pay-card-secure-hint-mobule">
                                <div><svg t="1710765199511" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5681" width="26" height="26"><path d="M337.541565 985.043478l-5.965913-0.089043A205.913043 205.913043 0 0 1 131.628522 779.130435V512c0-104.292174 77.512348-190.464 178.086956-204.04313V244.869565a205.913043 205.913043 0 0 1 205.913044-205.913043l5.965913 0.089043A205.913043 205.913043 0 0 1 721.541565 244.869565v63.087305c100.574609 13.57913 178.086957 99.773217 178.086957 204.04313v267.130435l-0.089044 5.965913a205.913043 205.913043 0 0 1-205.824 199.94713h-356.173913z m356.173913-623.304348h-356.173913l-5.275826 0.089044A150.26087 150.26087 0 0 0 187.280696 512v267.130435a150.26087 150.26087 0 0 0 150.260869 150.260869h356.173913a150.26087 150.26087 0 0 0 150.26087-150.260869V512a150.26087 150.26087 0 0 0-150.26087-150.26087z m-178.086956 211.478261c15.36 0 27.826087 12.466087 27.826087 27.826087v89.043479l-0.155826 2.849391A27.826087 27.826087 0 0 1 487.802435 690.086957v-89.043479l0.133565-2.849391a27.826087 27.826087 0 0 1 27.692522-24.976696z m0-478.608695l-5.275826 0.089043A150.26087 150.26087 0 0 0 365.367652 244.869565v61.217392h300.521739V244.869565a150.26087 150.26087 0 0 0-150.260869-150.260869z" p-id="5682" fill="#515151"></path></svg></div>
                                <p>Credit card and debit card payments are processed within PayPal, so you don't need to worry about security issues.</p>
                            </div>
                            <div className="pay-card-icon-mobule">
                                <img src={require("../assets/images/card1.png")}/>
                                <img src={require("../assets/images/card2.png")}/>
                                <img src={require("../assets/images/card3.png")}/>
                                <img src={require("../assets/images/card4.png")}/>
                                <img src={require("../assets/images/card5.png")}/>
                                <img src={require("../assets/images/card7.png")}/>
                            </div>

                        </div>

                        <div className="pay-shipping-address-mobule">
                            <h3>Shipping Address</h3> 
                            <p>We will obtain your shipping address from your PayPal account or credit card information.</p>
                        </div>

                        <div className="pay-policy-mobule">
                            <ul>
                                <li value = "return" onClick={this.choosePolicyPage}>Return and Refund Policy</li>
                                <li value = "provacy" onClick={this.choosePolicyPage}>Privacy Policy</li>
                                <li value = "shipping" onClick={this.choosePolicyPage}>Shipping Policy</li>
                                <li value = "contact" onClick={this.choosePolicyPage}>Contact Information</li>
                            </ul>
                        </div>

                    </div>
                    <div className="pay-order-info">
                        {
                            this.state.nowPayPro.map((value)=>{
                                return <div className="pay-product-mobule">
                                            <img src={require("../assets/images/proImg/"+value.indent+"/"+"p"+value.proth+".png")} />
                                            <div className="pay-product-title-total">
                                                <div className="payProInfoTitle">{value.title}</div>
                                                <div className="payProInfoPrice">
                                                    <div><b>{this.state.curr}{(value.sale*this.state.currNum).toFixed(2)}</b></div>
                                                    <div><span style={value.delete_sale  === "0"?{display:"none"}:{}}>{this.state.curr}{(value.delete_sale*this.state.currNum).toFixed(2)}</span></div>
                                                </div>
                                            </div>
                                            <div style={{margin:"auto"}}><span style={{fontSize:"14px"}}>Qty:</span> <b>{value.sum}</b></div>
                                        </div>
                            })
                        }

                        <div style={{width:"82%",marginLeft:"5%",height:"0.5px",backgroundColor:"rgb(182, 182, 182)",marginTop:"2%"}}></div>
                        
                        <div className="pay-discount-mobule">
                            <div>
                                <svg t="1710687655098" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2373" width="20" height="20"><path d="M188.525714 478.153143l284.470857 284.452571L795.611429 440.009143a18.285714 18.285714 0 0 0 5.357714-12.891429l0.585143-259.181714a18.304 18.304 0 0 0-18.322286-18.322286l-259.181714 0.585143a18.285714 18.285714 0 0 0-12.891429 5.357714L188.544 478.153143zM149.76 516.937143l-25.874286 25.874286a18.285714 18.285714 0 0 0 0 25.856L382.482286 827.245714a18.285714 18.285714 0 0 0 25.874285 0l25.856-25.856L149.76 516.937143zM850.468571 138.971429l24.009143 1.28c40.448 2.139429 72.978286 35.766857 73.728 76.251428l4.534857 245.540572a88.722286 88.722286 0 0 1-25.801142 64.548571L541.750857 911.817143c-23.149714 23.149714-60.818286 22.308571-84.150857-1.042286l-30.482286-30.482286a73.179429 73.179429 0 0 1-83.419428-14.226285L85.101714 607.451429a73.142857 73.142857 0 0 1 0-103.442286L472.356571 116.772571a73.142857 73.142857 0 0 1 51.565715-21.430857l259.163428-0.585143a73.161143 73.161143 0 0 1 67.364572 44.233143z m5.851429 55.259428l-0.512 233.014857a73.142857 73.142857 0 0 1-21.412571 51.565715L468.809143 844.379429l27.574857 27.593142c2.304 2.285714 5.248 2.358857 6.582857 1.024L888.137143 487.808c6.381714-6.4 9.910857-15.232 9.728-24.758857l-4.516572-245.540572a23.424 23.424 0 0 0-21.778285-22.473142l-15.250286-0.804572z m-266.953143 167.552a36.571429 36.571429 0 1 0 51.730286-51.712 36.571429 36.571429 0 0 0-51.730286 51.712z m-38.784 38.784a91.428571 91.428571 0 1 1 129.28-129.28 91.428571 91.428571 0 0 1-129.28 129.28z" fill="#515151" p-id="2374"></path></svg>
                                &nbsp;<span style={{fontWeight:"300"}}>Coupon</span> 
                            </div>
                            <select onChange={this.changeSaveNum} onClick={this.getDiscount}>
                                {
                                    this.state.discount.map((value)=>{
                                        return <option  value={value.saveNum} title={value.title}>
                                                    {value.title}
                                                </option>
                                    })
                                }
                            </select>
                            <div className="pay-login"><span onClick={this.openLogin}>Log in</span></div>
                            <div className="pay-login-hint"><span>Login to view coupons</span></div>

                        </div>

                        <div className="pay-payment-info-mobule">
                                <div className="pay-payment-label">Subtotal</div>
                                <div style={{fontSize:"14px",marginTop:"3%",fontWeight:"500"}}>
                                    {this.state.curr}{(this.state.payDeleteNumber*this.state.currNum).toFixed(2)}
                                </div>
                                <div style={{fontSize:"14px",marginTop:"2%"}} className="pay-payment-label">Coupon</div>
                                <div id="pay-coupon" style={{color:"gray",fontSize:"14px",marginTop:"5%"}}>No coupons available</div>
                                <div style={{marginTop:"3%"}} className="pay-payment-label">Shipping fee</div>
                                <div style={{fontSize:"14px",marginTop:"9%",fontWeight:"500",color:"gray"}}>free shipping</div>
                                <div style={{marginTop:"2%"}} className="pay-payment-label">Tax fee</div>
                                <div style={{fontSize:"14px",marginTop:"6%",fontWeight:"500"}}>0</div>
                                <div className="pay-payment-total-label">Total</div>
                                <div className="pay-payment-total">{this.state.ISO} {this.state.curr}{((this.state.payNumber - Number(this.state.payDeleteNumber*(1 - this.state.saveNum)))*this.state.currNum).toFixed(2)}</div>
                        </div>

                    </div>
                </div>

                <div id="head-login-mobule" className="head-login-mobule">
                    <button onClick={this.closeLogin} className="head-login-close-btn">×</button>
                    {
                        this.state.login
                    }
                </div>

                <div id="footer-sign-mobule" className="footer-sign-mobule">
                    <button onClick={this.isFooterCloseSign} className="footer-sign-close-btn">×</button>
                    <Register onRef={this.onRef} getDiscount={this.getDiscount}/>
                </div>

                <div id="pay-policy-btn-info-mobule" className="pay-policy-btn-info-mobule">
                    <button onClick={this.closePolicy}>✖</button>
                    <div className="pay-policy-btn-info">
                        {
                            this.state.chooseProvacy
                        }
                    </div>
                </div>

            </div>
        );
    }
}

export default Pay;