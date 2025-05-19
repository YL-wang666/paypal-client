import axios from "axios";
import React,{Component} from "react";
import "../../assets/css/register.css";
import GoogleSign from "./GoogleSign";
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            signUpMessage:"",
            logStatus : true,
            passwordMessage:"",
            //显示登录页面会将googleLod参数进行GoogleSign组件的赋值
            googleLog : "",
            //显示一登录页面时将googleLogout参数进行GoogleSign组件的赋值
            googleLogout : ""
         };
    }

componentDidMount(){
    this.setState({
        logStatus : localStorage.getItem("userName") ? true:false,
        googleLog : localStorage.getItem("userName") ? "" : <GoogleSign googleLog={this.googleLog} name={true} />,
        googleLogout : localStorage.getItem("userName") ? <GoogleSign logout={this.logout} name={false} /> : ""
    })
}

//谷歌登录后
googleLog=(e)=>{
    this.setState({
        logStatus : true,
        googleLog : "",
        googleLogout : <GoogleSign logout={this.logout} name={false} />
    })
    //谷歌登录查看是否之前登录过,如果没登录过，那么执行注册流程，发放订阅的20%优惠卷
    axios.post("/api/googleLog",{
        user : e
    })
    .then((res)=>{
        //因为除了pay页面注册都是由head组件负责,所以注册之后需要将head的登录状态改变就是this.props.loginClosePage()
        if(this.props.name !== "pay"){
            this.props.loginClosePage()
        }
        
    })
}

//登出
logout=()=>{
    
    this.setState({
        logStatus : false,
        googleLog : <GoogleSign googleLog={this.googleLog} name={true} />,
        googleLogout : ""
    })
    //因为除了pay页面注册都是由head组件负责,所以注册之后需要将head的登录状态改变就是this.props.logoutChangeState()
    if(this.props.name !== "pay"){
        this.props.logoutChangeState()
    }
}

//打开footer的注册页面关闭登录页面
openSignUp=()=>{
    document.getElementById("footer-sign-mobule").style.display = "block"
    document.getElementById("head-login-mobule").style.display = "none"
}

//打开修改密码页面
changePage=()=>{
    this.props.changePage(1)
}


async checkUser(e){
    axios.post("/api/check_user",{
        user : e
    })
    .then((response)=>{
        if(response.data === "success"){
            this.setState({
                signUpMessage : "Account not found !"
            })
            document.getElementById("loginState").style.color = "red";
        }
        else{
            this.setState({
                signUpMessage : ""
            })
            document.getElementById("loginState").style.color = "rgb(13, 214, 29)";
        }
    })
    .catch(function (error) {
        alert(error);
    })
}


//验证邮箱
checkEmail=(e)=>{
    if(e.target.value.length < 2){return;}
    let str = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+/;
    if(!str.test(e.target.value)){
        this.setState({
            signUpMessage : "Please input the correct email address !"
        })
        document.getElementById("loginState").style.color = "red";
    }
    else{
        this.checkUser(e.target.value);
    }
}

//提交表单
sendForm=()=>{
    let account = document.getElementById("loginUserName").value;
    let password = document.getElementById("loginPassWord").value;
    if(account.length === 0){
        alert("Account cannot be empty !");
        return;
    }
    if(this.state.signUpMessage === "Account not found !")
    {
        alert("Account not found !");
        return;
    }
    if(password.length < 8){
        alert("Password length is less than 8 !");
        return;
    }

    axios.post("/api/login_form",{
        user : account,
        password : password
    })
    .then((response)=>{
        if(response.data === "success"){
            localStorage.setItem("userName",account)
            if(this.props.name === "pay"){
               //关闭登录界面
               this.setState({
                    logStatus : true,
                    googleLog : "",
                    googleLogout : <GoogleSign logout={this.logout} name={false} />
                })
               document.getElementById("head-login-mobule").style.display = "none"
            }
            else{
                //如果不是支付页面就要给Head组件传状态然后关闭登录页面
                this.setState({
                    logStatus : true,
                    googleLog : "",
                    googleLogout : <GoogleSign logout={this.logout} name={false} />
                })
                this.props.loginClosePage()
            }
        }
        else{
            this.setState({
                passwordMessage : response.data
            })
            document.getElementById("passwordState").style.color = "red";
        }
    })
    
}


//这个手机注册页面与PC注册页面公用css文件，注意
    render() {
        return (
            <div className="LoginForm" >
                
                <h2 className="sign-logo">PorcEast</h2>
                <hr />
                <div style={this.state.logStatus ? {} : {display:"none"}} className="sign-logged-mobule">
                    <h3>You are now logged in</h3>
                    <p>{localStorage.getItem("userName")}</p>
                    {
                        this.state.googleLogout
                    }
                </div>
                <div style={this.state.logStatus ? {display:"none"} : {}}>
                    <div className="SignUpFormText">
                        <h2 className="sign-title">Login</h2>
                        <div>
                            <label>Account:</label><br />
                            <input id="loginUserName" className="SignUpInput" onBlur={this.checkEmail} placeholder="Email address"></input><br />
                            <span id="loginState" className="SignUpState">{this.state.signUpMessage}</span>
                        </div>
                        <div>
                            <label>Password:</label><br />
                            <input id="loginPassWord" className="SignUpInput" type="password" maxLength="30" placeholder="Password"></input><br />
                            <span id="passwordState" >{this.state.passwordMessage}</span>
                        </div>
                    </div>
                    <div>
                        <input id="loginSubmit" className="SignUpSubmit" onClick={this.sendForm} type="button" value="Login" />
                        <div style={{marginTop:"3%",marginBottom:"5%",width:"100%",textAlign:"center"}}>
                            {
                                this.state.googleLog
                            }
                        </div>
                    </div>
                    <div className="login-link-mobule">
                        <div className="log-to-sign"><i onClick={this.changePage}>Forgot password ?</i></div>
                        <div className="log-to-sign"><i onClick={this.openSignUp}> Register Now</i></div>
                    </div>
                </div> 
                <p className="sign-prompt">
                    Only after logging in can you view and use discount coupons, and at the same time, it allows you to conveniently check your orders and other information
                </p>
                
            </div>
        );
    }
}

export default Login;