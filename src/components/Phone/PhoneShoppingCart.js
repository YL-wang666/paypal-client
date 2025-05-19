import axios from "axios";
import React,{Component} from "react";
import { Link } from "react-router-dom";
import { reactFacekookPixel } from "../publicCom/ReactFacekookPixel";
import "../../assets/css/phone/phoneShoppingCart.css";
import PhoneHead from "./PhoneHead";
import PhoneFooter from "./PhoneFooter";
//import { reactFacekookPixel } from "./phone/ReactFacekookPixel";
class PhoneShoppingCart extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            cart : [{"indent":"load","proth":"1","title":"title","sale":138,"sum":1}],
            total : 0,
            cartNum : 0,
            curr: localStorage.getItem("curr")?localStorage.getItem("curr"):"$",
            currNum : localStorage.getItem("currNum")?localStorage.getItem("currNum"):1,
            ISO : localStorage.getItem("ISO")?localStorage.getItem("ISO"):"USD",
         };
    }

    componentDidMount(){
        if(localStorage.getItem("cart").length > 0){
            this.getCartInfo()
        }
        //添加监听来变换浮动模块的位置
        document.addEventListener("scroll",this.cartScrollShow)
        //回到顶部
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }

    cartScrollShow=()=>{
        if(document.getElementById("cart-scrollPoint").offsetTop - document.documentElement.scrollTop - document.documentElement.clientHeight  <= 0){
            document.getElementById("cart-fixed-pay-btn").style.bottom = "80%"
        }
        else{
            document.getElementById("cart-fixed-pay-btn").style.bottom = "6px"
        }
    }
    

    getCartInfo=()=>{
        let cartInfoStr = localStorage.getItem("cart")
        let proArr = cartInfoStr.split(",")
        let cartArr = [] 
        let indentArr = []
        let cartNum = 0
        for (let i = 0; i < proArr.length; i++) {
            let proJson = {"indent":"","title":"","proth":"","sale":"","sum":""}
            indentArr[i]= proArr[i].split("=")[0]
            proJson.indent = proArr[i].split("=")[0]
            proJson.proth = proArr[i].split("=")[1].split("s")[0]
            proJson.sum = proArr[i].split("s")[1]
            cartNum = cartNum + Number(proJson.sum)
            cartArr.push(proJson) 
        }

        axios.post("/api/get_cart_info",{
            indentArr : indentArr
        })
        .then((response)=>{
            let resJosnArr = response.data
            //用于计算总金额
            let sum = 0
            for (let i = 0; i < cartArr.length; i++) {
                for (let j = 0; j < resJosnArr.length; j++) {
                    if(cartArr[i].indent === resJosnArr[j].indent){
                        cartArr[i].title = resJosnArr[j].title
                        cartArr[i].sale = resJosnArr[j].sale
                        sum = sum + Number(resJosnArr[j].sale) * Number(cartArr[i].sum)
                    }  
                }
            }
            this.setState({
                cart : cartArr,
                total : sum,
                cartNum : cartNum
            })

        })
        .catch(function (error) {
            console.log(error)
        })

    }

    proSumChange=(e)=>{
        let fun = e.target.value
        let cartIdInfo = this.state.cart[e.target.getAttribute("cartId")]
        let setKey = cartIdInfo.indent + "=" + cartIdInfo.proth
        if(fun === "subtract"){
            this.childhead.shoppingSubtractCart(setKey)
            let cartArr = []
            //用于计算总金额
            let sum = 0
            let cartNum = 0
            for (let i = 0; i < this.state.cart.length; i++) {
                if(i ===Number(e.target.getAttribute("cartId"))){
                    this.state.cart[i].sum = Number(this.state.cart[i].sum) === 1?1:Number(this.state.cart[i].sum) - 1
                }
                cartArr[i] = this.state.cart[i] 
                sum = sum + Number(cartArr[i].sum) * Number(cartArr[i].sale)
                cartNum = cartNum + Number(this.state.cart[i].sum)
            }
            this.setState({
                cart : cartArr,
                total : sum,
                cartNum : cartNum
            })
        }

        if(fun === "add"){
            this.childhead.shoppingAddCart(setKey)
            let cartArr = []
            //用于计算总金额
            let sum = 0
            let cartNum = 0
            for (let i = 0; i < this.state.cart.length; i++) {
                if(i ===Number(e.target.getAttribute("cartId"))){
                    this.state.cart[i].sum = Number(this.state.cart[i].sum) === 9?9:Number(this.state.cart[i].sum) + 1
                }
                cartArr[i] = this.state.cart[i] 
                sum = sum + Number(cartArr[i].sum) * Number(cartArr[i].sale)
                cartNum = cartNum + Number(this.state.cart[i].sum)
            }
            this.setState({
                cart : cartArr,
                total : sum,
                cartNum : cartNum
            })
        }

        if(fun === "delete"){ 
            this.childhead.shoppingDeleteCart(setKey)
            let cartArr = []
            //用于计算总金额
            let sum = 0
            let cartNum = 0
            for (let i = 0; i < this.state.cart.length; i++) {
                if(i ===Number(e.target.getAttribute("cartId"))){
                    continue
                }
                cartArr.push(this.state.cart[i])  
                sum = sum + Number(this.state.cart[i].sum) * Number(this.state.cart[i].sale)
                cartNum = cartNum + Number(this.state.cart[i].sum)
            }
            this.setState({
                cart : cartArr,
                total : sum,
                cartNum : cartNum
            })
        }
        
    }

    //要调用子组件方法要用ref,没研究原理就这么用
    headRef = (ref) => {
        this.childhead = ref
    }

    //改变货币时改变页面所有货币和金额
    headCurrChange=(curr,currNum,ISO)=>{
        this.setState({
            curr : curr,
            currNum : currNum,
            ISO : ISO
        })
        
    }


    payNow=()=>{
        reactFacekookPixel("InitiateCheckout")
        //清除监听
        document.removeEventListener("scroll",this.cartScrollShow)
        //跳转支付页面支付
        window.location.href = `Pay?payNum=c`
    }
    
    //跳转时就是该组件销毁时清除掉本组件的监听
    componentWillUnmount(){
        document.removeEventListener("scroll",this.cartScrollShow)
    }

    render() {
        return (
            <div>
                <div id="head-fixed" style={{borderBottom:"0.2px gray solid"}} className="Phead-fixed" ><PhoneHead name="cart" headRef={this.headRef} ISO={this.state.ISO} headCurrChange={this.headCurrChange} /></div>
                <div style={{marginBottom:"10%"}}>
                    <h1 style={{marginTop:"30%",marginLeft:"8%",color:"rgb(29, 29, 29)",fontSize:"30px",fontFamily:"'Noto Serif SC', serif"}}>Cart</h1>
                    <div className={this.state.total <= 0?"PcartEmpty":"PcartEmptyHidden"}>
                        The cart is empty
                    </div>

                    <div className={this.state.total <= 0?"PcartInfoHidden":"PcartInfoMouble"} style={{width:"100%"}}>
                        <div className="PcartInfoDiv">
                            <div className="Pcart-table-head">
                                <div></div>
                                <div>Product & Quantity</div>
                            </div>
                            {this.state.cart.map((value , key)=>{
                                return <div className="PcartInfo">
                                            <button className="Pcart-delete-btn" value="delete" cartId={key} onClick={this.proSumChange}>X</button>
                                            <div><img src={require("../../assets/images/product/detail/"+value.indent+"/"+"p"+value.proth+".jpg")} alt=""/></div>
                                            <Link  to={"/Detail?pdnum="+value.indent}>
                                                <p className="PcartTitle">{value.title}</p>
                                            </Link>
                                            <div></div>
                                            <div>
                                                <span style={{color:"black",fontFamily:"'Cinzel', serif"}} >{this.state.curr}{(value.sale*this.state.currNum).toFixed(2)}</span>
                                                <strong style={{marginLeft:"30px"}}>{value.sum}</strong>
                                            </div>
                                            <div className="PcartInfoBtn" >
                                                <button value="subtract" cartId={key} onClick={this.proSumChange}>-</button>
                                                <button value="add" cartId={key} onClick={this.proSumChange}>＋</button>
                                            </div>
                                        </div>
                            })}
                        </div>
                        <div id="cart-fixed-pay-btn" className="Pcart-fixed-pay-btn">
                            <div>
                                <div className="Pcart-fixed-pay-btn-svg"><svg t="1710250644177" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10591" width="43" height="43"><path d="M0 0h1024v1024H0z" fill="#21303A" p-id="10592"></path><path d="M419.83 664.74v-57.67h334.92l47.53-236.2H324.4l68.66 335.07h341.8l8.28-41.2H419.83zM818.38 298.21l-64.97-76.91h-37.12l-92.8 109.86h188.26l6.63-32.95z" fill="#F9F9FA" p-id="10593"></path><path d="M450.11 795.94m-55.68 0a55.68 55.68 0 1 0 111.36 0 55.68 55.68 0 1 0-111.36 0Z" fill="#F9F9FA" p-id="10594"></path><path d="M669.48 795.94m-55.68 0a55.68 55.68 0 1 0 111.36 0 55.68 55.68 0 1 0-111.36 0Z" fill="#F9F9FA" p-id="10595"></path><path d="M324.4 370.87l-42.57-85.14h-76.22v-37.08l107.11-4.8 37.08 127.02" fill="#F9F9FA" p-id="10596"></path></svg></div>
                                <div className="Pcart-fixed-pay-btn-info">
                                    <p><i>Total Items In Cart :  <b>{this.state.cartNum}</b></i><br />
                                    <i>Total :  <b>{this.state.curr}{(this.state.total*this.state.currNum).toFixed(2)}</b></i></p>
                                </div>
                            </div>
                            <button onClick={this.payNow}>Pay Now</button>
                        </div>
                    </div>
                </div>
                <div id="cart-scrollPoint"></div>
                <PhoneFooter ISO={this.state.ISO} headCurrChange={this.headCurrChange}/>
                
            </div>
        );
    }
}

export default PhoneShoppingCart;