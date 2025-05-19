import React,{Component} from "react";
import "../assets/css/head.css"
import { Link } from "react-router-dom";
import Login from "./publicCom/Login";
import ForgetPassword from "./publicCom/ForgetPassword";
class Head extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            cartNum : 0,  //购物车数量
            aMenuShow : false ,  //控制手工陶瓷菜单显示
            loginState : false,
            login : <Login changePage={this.changePage} logoutChangeState={this.logoutChangeState} loginClosePage={this.loginClosePage}/>
         };
        this.props.onRef && this.props.onRef(this);
        this.hiddenAMenu = null
    }

   

    componentDidMount(){
       /** 
        if(this.props.name === "home" | this.props.name === "shop" | this.props.name === "detail" | this.props.name === "cart"){
            this.props.headRef(this);
        }
        */
        this.props.headRef(this);
        
        if(!localStorage.getItem("cart")){
            localStorage.setItem("cart","")
        }
        else{
            this.getCartProNum()
        }
        //判断是否登录
        this.setState({
            loginState : localStorage.getItem("userName")?true:false
        })
        //动态
        document.addEventListener("scroll",this.headScrollShow)
        //回到顶部
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }

    //获得购物车商品数量
    getCartProNum=()=>{
        let cartInfoStr = localStorage.getItem("cart")
        let cartProNum = 0
        let proArr = cartInfoStr.split(",")
        for (let i = 0; i < proArr.length; i++) {
            cartProNum = cartProNum + Number(proArr[i].split("s")[1]) 
        }
        this.setState({
            cartNum : cartProNum?cartProNum:0
        })
    }

    //添加购物车功能
    shoppingAddCart=(e)=>{
        let cartInfoStr = localStorage.getItem("cart")
        if(cartInfoStr.length < 5){
            localStorage.setItem("cart",e + "s1")
            //更新购物车显示的数量
            this.getCartProNum()
            return;
        }
        let e_num = cartInfoStr.indexOf(e)
        if( e_num < 0){
            localStorage.setItem("cart",cartInfoStr +","+ e + "s1")
            //更新购物车显示的数量
            this.getCartProNum()
            return;
        }
        let proArr = cartInfoStr.split(",")
        let newCartInfoStr = ""
        for (let i = 0; i < proArr.length; i++) {
            if(e === proArr[i].split("s")[0]){
                proArr[i] = proArr[i].split("s")[0] + "s" + (Number(proArr[i].split("s")[1]) >= 9? 9:Number(proArr[i].split("s")[1])+1)
            }
            newCartInfoStr = newCartInfoStr + proArr[i] + ","
        }
        localStorage.setItem("cart",newCartInfoStr.substring(0,newCartInfoStr.length - 1))
        //更新购物车显示的数量
        this.getCartProNum()
    }

    //购物车减商品
    shoppingSubtractCart=(e)=>{
        let cartInfoStr = localStorage.getItem("cart")
        let proArr = cartInfoStr.split(",")
        let newCartInfoStr = ""
        for (let i = 0; i < proArr.length; i++) {
            if(e === proArr[i].split("s")[0]){
                proArr[i] = proArr[i].split("s")[0] + "s" + (Number(proArr[i].split("s")[1]) === 1? 1:Number(proArr[i].split("s")[1])-1)
            }
            newCartInfoStr = newCartInfoStr + proArr[i] + ","
        }
        localStorage.setItem("cart",newCartInfoStr.substring(0,newCartInfoStr.length - 1))
        //更新购物车显示的数量
        this.getCartProNum()
    }

    //删除购物车某个商品
    shoppingDeleteCart=(e)=>{
        let cartInfoStr = localStorage.getItem("cart")
        let proArr = cartInfoStr.split(",")
        let newCartInfoStr = ""
        for (let i = 0; i < proArr.length; i++) {
            if(e === proArr[i].split("s")[0]){
                continue
            }
            newCartInfoStr = newCartInfoStr + proArr[i] + ","
        }
        localStorage.setItem("cart",newCartInfoStr.substring(0,newCartInfoStr.length - 1))
        //更新购物车显示的数量
        this.getCartProNum()
    }

    currChange=(e)=>{
        let currNumArr={"USD":1,"EUR":0.91,"GBP":0.79}
        let currISOArr={"USD":"$","EUR":"€","GBP":"£"}
        localStorage.setItem("curr",currISOArr[e.target.value])
        localStorage.setItem("ISO",e.target.value)
        localStorage.setItem("currNum",currNumArr[e.target.value])
        this.props.headCurrChange(currISOArr[e.target.value],currNumArr[e.target.value],e.target.value)
    }

    //登录需要的方法
    openLogin=()=>{
        //将Login组件添加进来
        this.setState({
            login : <Login changePage={this.changePage} logoutChangeState={this.logoutChangeState} loginClosePage={this.loginClosePage}/>
        })
        document.getElementById("head-login-mobule").style.display = "block"
    }

    //点击了登录按钮的关闭按钮
    closeLogin=()=>{
        document.getElementById("head-login-mobule").style.display = "none"
    }

    //登录成功后将转为已经登录状态然后关闭页面
    loginClosePage=()=>{
        this.setState({
            loginState : true
        })
        document.getElementById("head-login-mobule").style.display = "none"
        //如果是推广账户后台登录的话，登录后要将CoPromoPanel组件的getNowAccount()方法执行以便，获取当前账户的信息
        if(this.props.name === "CoPromoPanel"){
            this.props.getNowAccount()
        }
    }
    //登出后要改变登录状态
    logoutChangeState=()=>{
        this.setState({
            loginState : false
        })
    }

    //切换忘记密码和登录页面
    changePage=(e)=>{
        // e 的值 0 表示 登录页面 , 1 表示忘记密码页面
        if(e === 0){
            this.setState({
                login : <Login changePage={this.changePage} logoutChangeState={this.logoutChangeState} loginClosePage={this.loginClosePage}/>
            })
        }
        if(e === 1){
            this.setState({
                login : <ForgetPassword changePage={this.changePage} />
            })
        }
    }

    //控制head最上面的动态，还有头部的透明或白色
    headScrollShow=(e)=>{
        if(document.documentElement.scrollTop > 10){
            document.getElementById("head-fixed").style.top = "-43px"
           
        }
        else{
            document.getElementById("head-fixed").style.top = "0"
           
        }
    }

    //鼠标进入立即显示分类搜索模块，离开时延时300毫秒后在判断是否关分类搜索模块
    //鼠标进入输入框显示分类搜索
    showMenuDetail =()=>{
        if(this.state.aMenuShow){
            clearTimeout(this.hiddenAMenu); // 取消定时器
        }
        this.setState({
            aMenuShow : true
        })
        
    }

    //鼠标离开按钮控制隐藏菜单
    hiddenMenuDetail=()=>{
        this.hiddenAMenu = setTimeout(()=> {
            if(this.state.aMenuShow){
                this.setState({
                    aMenuShow : false
                })
            }
          }, 200);
    }

    //鼠标进入显示的菜单时
    enterMenu=(e)=>{

        if(e.currentTarget.getAttribute("id") === "head-menu-artisan-details-mobule"){
            clearTimeout(this.hiddenAMenu); // 取消定时器
        }
    }

    //鼠标移出显示的菜单时
    leaveMenu=(e)=>{
        if(e.currentTarget.getAttribute("id") === "head-menu-artisan-details-mobule"){
            this.hiddenAMenu = setTimeout(()=> {
                if(this.state.aMenuShow){
                    this.setState({
                        aMenuShow : false
                    })
                }
            }, 300);
        }
    }

    //跳转时就是该组件销毁时清除掉本组件的监听
    componentWillUnmount(){
        document.removeEventListener("scroll",this.headScrollShow)
    }

    render() {
        return (
            <div className="head-all-mobule">
                <div id="headTop" className="headTop">
                    <div className="headTopInfo">Handcrafted Porcelain from Jingdezhen’s Thousand-Year Legacy</div>
                </div>
                <div id="head-logo-mobule" className="head-logo-mobule">
                    <h1>PorcEast</h1>
                    <div className="headNavBtn">
                        <Link>
                            <button onMouseEnter={this.showMenuDetail}>Modern</button>
                        </Link>
                        <Link to="/shop?category=zhen">
                            <button>Classical</button>
                        </Link>
                        <Link>
                            <button>Personalized</button>
                        </Link>
                        <Link to="/about" >
                            <button>Our Story</button>
                        </Link>
                        
                    </div>

                    <div className="headISOSelect-mobule">
                        <svg t="1744786561607" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2865" width="18" height="18"><path d="M512 0C229.2 0 0 229.2 0 512s229.2 512 512 512 512-229.2 512-512S794.8 0 512 0zM337.6 924.8c-53.3-22.6-101.3-54.9-142.4-96-41.2-41.2-73.5-89.1-96-142.4C75.8 631.2 64 572.5 64 512c0-29 2.7-57.6 8.1-85.5 6.5 2.5 13.8 3.9 20.9 3.9 9.7 0 19.3-2.4 27.1-7.6 8-5.3 17.3-8.1 26.5-8.1 7.9 0 15.8 2.1 22.8 6.4 8.1 5 13.8 11.6 13.8 22.8 0 81.6 2.8 168.7 76.9 169.9 2.2 0 41.2 14.9 59.8 63.3 2.2 5.6 6.4 7.4 12.2 7.4 11.5 0 29-7.4 47.6-7.4 13.9 0 0 23.6 0 74.5C379.8 802 489 880.1 489 880.1c-0.6 32 0.9 58.5 3.3 79.4-53.5-2.2-105.5-13.9-154.7-34.7z m491.2-96c-41.2 41.2-89.1 73.5-142.4 96-24.4 10.3-49.4 18.4-75 24.1-1.5-0.3-3.2-0.4-5-0.4-3.5 0-7.5 0.5-12 1.7 15.5-65.5 22.9-102.4 54.9-130.2 44-38.2 9.7-80.4-24-80.4-1.9 0-3.9 0.1-5.8 0.4-1.5 0.2-2.8 0.3-4 0.3-22.2 0-7.5-34.9-31.1-36.9-24.8-2.1-57.3-51.4-93.4-68.5-19-9-37.5-33.2-67-34.5h-1.7c-18.6 0-42.3 11.1-54.4 11.1-4.8 0-7.8-1.8-7.8-6.7 0-57.1-5.9-97.7-6.8-113.8-0.4-5.5-2-7.1-1.1-7.1 1.2 0 7.2 3.2 27.8 3.7h0.5c18.6 0 9.7-38.5 28.1-40 0.8-0.1 1.6-0.1 2.4-0.1 16.4 0 47.5 11.8 63.8 11.8 3.4 0 6.1-0.5 7.9-1.7 0.2-0.1 0.4-0.2 0.7-0.2 8.8 0 43.4 86.3 62.8 86.3 8 0 13.4-14.7 13.4-56 0-17.1-9-46.9 0-63.3 35.1-64.2 67.9-116.7 65.1-124.1-0.9-2.3-11.3-4.4-25-4.4-11.7 0-25.7 1.5-38.3 5.6-9.4 3.1 2.8 17.7-10.2 20.8-8.7 2-17.2 2.9-25.2 2.9-38.2 0-65.8-20.3-53.3-39.8 15.9-23.9 72.8-10.6 77.9-58.6 2.3-22.2 4.3-47.2 5.8-68.5 0.5-7.7 6.7-13.7 14.4-14.2 37.2-2.7 41-47 6.2-75.3 37.5 5.4 74.1 15.6 109.2 30.5 53.3 22.6 101.3 54.9 142.4 96 37.4 37.4 67.4 80.3 89.6 127.8-5.7-3.5-11.6-5.2-17.4-5.2-28.3 0-54.2 38.4-38 82-133 102-98.9 173.4-55.5 214 12.8 12 25.4 27.4 36.4 42.7 10.6 14.6 17.2 31.5 21 49.2 1.4 6.4 6.4 9.6 13.7 9.6 11 0 27-7.3 43.1-21.7-22.2 50.3-53.4 95.8-92.7 135.1z" p-id="2866"></path></svg>
                        <select className="headISOSelect" id="headISOSelect" onChange={this.currChange} value={this.props.ISO}>
                            <option value="USD">$&nbsp;USD</option>
                            <option value="EUR">€&nbsp;EUR</option>
                            <option value="GBP">£&nbsp;GBP</option>
                        </select>
                    </div>

                    <div className="headNavCart"> 
                        <Link  className="headCart" to="/cart">
                        <svg t="1738489791212" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9915" width="25" height="25"><path d="M828.416 1024H195.584c-100.864 0-182.784-81.92-182.784-182.784V481.28c0-100.864 81.92-182.784 182.784-182.784h39.424c14.848 0 27.136 12.288 27.136 27.136s-12.288 27.136-27.136 27.136h-39.424C124.416 352.256 66.56 410.112 66.56 481.28v359.424c0 71.168 57.856 129.024 129.024 129.024h633.344c71.168 0 129.024-57.856 129.024-129.024V481.28c0-71.168-57.856-129.024-129.024-129.024h-37.376c-14.848 0-27.136-12.288-27.136-27.136s12.288-27.136 27.136-27.136h37.376c100.864 0 182.784 81.92 182.784 182.784v359.424c0 101.888-82.432 183.808-183.296 183.808z" fill="#333333" p-id="9916"></path><path d="M643.072 352.256h-256c-14.848 0-27.136-12.288-27.136-27.136s12.288-27.136 27.136-27.136h255.488c14.848 0 27.136 12.288 27.136 27.136s-11.776 27.136-26.624 27.136z" fill="#333333" p-id="9917"></path><path d="M714.24 541.696c-14.848 0-27.136-12.288-27.136-27.136V229.376c0-96.768-78.848-175.104-175.104-175.104S336.896 132.608 336.896 229.376v285.696c0 14.848-12.288 27.136-27.136 27.136s-27.136-12.288-27.136-27.136V229.376C282.624 102.912 385.536 0 512 0c126.464 0 229.376 102.912 229.376 229.376v285.696c0 14.336-12.288 26.624-27.136 26.624z" fill="#333333" p-id="9918"></path><path d="M312.832 549.376m-49.664 0a49.664 49.664 0 1 0 99.328 0 49.664 49.664 0 1 0-99.328 0Z" fill="#333333" p-id="9919"></path><path d="M711.168 549.376m-49.664 0a49.664 49.664 0 1 0 99.328 0 49.664 49.664 0 1 0-99.328 0Z" fill="#333333" p-id="9920"></path></svg>
                            <div style={{fontSize:"12px",backgroundColor:"rgba(255, 255, 255, 0.048)",borderRadius:"50%"}}>{this.state.cartNum}</div>
                        </Link>
                        
                        <div style={{position:"relative",margin:"auto"}} onClick={this.openLogin} >
                            <svg id="loginState" class="loginState" t="1704423255314" style={this.state.loginState?{display:"block"}:{display:"none"}} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14896" width="15" height="15"><path d="M0 512C0 229.234759 229.234759 0 512 0s512 229.234759 512 512-229.234759 512-512 512S0 794.765241 0 512z m419.310345 194.630621a35.310345 35.310345 0 0 0 49.399172 1.271172l335.518897-311.931586a35.310345 35.310345 0 0 0-48.075035-51.729655l-309.124413 289.544827-145.125518-149.645241a35.310345 35.310345 0 1 0-50.688 49.169655l168.112552 173.320828z" fill="#0dbb19" p-id="14897"></path></svg>
                            <svg t="1706870506955" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="34823" width="27" height="27"><path d="M505.21 550.18c58.63 0 117.26-22.37 161.99-67.1 89.47-89.47 89.47-234.52 0-323.98C622.46 114.37 563.83 92 505.21 92c-58.63 0-117.26 22.37-161.99 67.1-89.47 89.47-89.47 234.52 0 323.98 44.73 44.74 103.36 67.1 161.99 67.1z m-135-364.08c36.06-36.06 84-55.92 134.99-55.92 50.99 0 98.94 19.86 134.99 55.92 74.43 74.44 74.43 195.55 0 269.99-36.06 36.06-84 55.92-134.99 55.92s-98.94-19.86-134.99-55.92c-74.43-74.44-74.43-195.56 0-269.99zM702.91 626.55H321.09C194.57 626.55 92 729.11 92 855.64c0 42.17 34.19 76.36 76.36 76.36h687.27c42.18 0 76.36-34.19 76.36-76.36 0.01-126.53-102.56-229.09-229.08-229.09z m152.73 267.27H168.36c-21.05 0-38.18-17.13-38.18-38.18 0-105.27 85.64-190.91 190.91-190.91h381.82c105.27 0 190.91 85.64 190.91 190.91 0 21.05-17.13 38.18-38.18 38.18z" p-id="34824" fill="#515151"></path></svg>
                        </div>
                    </div>
                </div>

                <div id="head-menu-artisan-details-mobule" className="head-menu-artisan-details-mobule" style={this.state.aMenuShow ? {display:"grid"}:{display:"none"}} onMouseEnter={this.enterMenu} onMouseLeave={this.leaveMenu}>
                    <div className="head-menu-artisan-div-mobule">
                        <Link to="/shop?category=plate">
                            <h3>Dinner Plate</h3>
                            <img className="head-menu-artisan-img" src={require("../assets/images/proImg/C12_1/p0.png")} alt="blue and white porcelain , blue and white china" />
                        </Link>
                    </div>
                    <div className="head-menu-artisan-div-mobule">
                        <Link to="/shop?category=bowl">
                            <h3>Bowl</h3>
                            <img className="head-menu-artisan-img" src={require("../assets/images/proImg/D12_1/p0.png")} alt="blue and white porcelain , blue and white china" />
                        </Link>
                    </div>
                    <div className="head-menu-artisan-div-mobule">
                        <Link to="/shop?category=cup">
                            <h3>Tea & Water Cups</h3>
                            <img className="head-menu-artisan-img" src={require("../assets/images/proImg/B12_2/p0.png")} alt="blue and white porcelain , blue and white china" />
                        </Link>
                    </div>
                    <div className="head-menu-artisan-div-mobule">
                        <Link to="/shop?category=coffee">
                            <h3>Coffee Cups</h3>
                            <img className="head-menu-artisan-img" src={require("../assets/images/proImg/A4_1/p0.png")} alt="blue and white porcelain , blue and white china" />
                        </Link>
                    </div>
                    
                </div>
                

                <div id="head-login-mobule" className="head-login-mobule">
                    <button onClick={this.closeLogin} className="head-login-close-btn">×</button>
                    {this.state.login}
                </div>

            </div>
        );
    }
}

export default Head;