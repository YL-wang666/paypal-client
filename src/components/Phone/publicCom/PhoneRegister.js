import axios from "axios";
import React,{Component} from "react";
import "../../../assets/css/phone/phoneRegister.css"
class PhoneRegister extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            signUpMessage:"",
            captchaState:"",
            passwordState:"",
            passwordValue:"",
            passwordSecond:"",
            timingState:true, //这三元运算的参数，用于转换两个标签实现按钮和计数器的切换
            countdown:""   //这是验证码显示计数器
         };
    }

componentDidMount(){
    this.props.onRef(this);
}

//验证父组件传过来的email
checkParentEmail=(e)=>{
    document.getElementById("SignUpUsername").value = e
    if(e.length < 2){return;}
    let str = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+/;
    if(!str.test(e)){
        this.setState({
            signUpMessage : "Please input the correct email address !"
        })
        document.getElementById("SignUpState").style.color = "red";
    }
    else{
        this.checkUser(e);
    }
}

getCode=()=>{
    if(this.state.signUpMessage === "Account already exists !" || document.getElementById("SignUpUsername").value.length <= 5){
        return;
    }
    this.setState({
        timingState:false
    })
    let emailadress = document.getElementById("SignUpUsername").value;
    axios.post("/api/send_VerificationCode",{
       // user : document.getElementByI("SignUpUsername").value
       user : emailadress
    })
    .then((response)=>{
        //response.data.length字符串长度大于20 返回时发送成功，提示的颜色要变绿色，否则发送失败，提示颜色时本身红色
        if(response.data.length > 20){
            this.setState({
                captchaState : response.data
            })
            document.getElementById("verificationState").style.color = "rgb(13, 214, 29)";
        }
        else{
            this.setState({
                captchaState : response.data
            })
        }
    })
    .catch(function (errorInfo) {
        alert(errorInfo);
    });

    for (let i = 60; i <= 60&&i >= 0; i--) {
        setTimeout(()=> { 
            this.setState({
                countdown:i
            })
            if(i === 0){
                this.setState({
                    timingState:true
                })
            }
        }, 1000 * (60 - i)); 
    } 


}

async checkUser(e){
    axios.post("/api/check_user",{
        user : e
    })
    .then((response)=>{
        if(response.data === "success"){
            this.setState({
                signUpMessage : "Account authentication successful !"
            })
            document.getElementById("SignUpState").style.color = "rgb(13, 214, 29)";
        }
        else{
            this.setState({
                signUpMessage : "Account already exists !"
            })
            document.getElementById("SignUpState").style.color = "red";
        }
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
        document.getElementById("SignUpState").style.color = "red";
    }
    else{
        this.checkUser(e.target.value);
    }
}

checkPassword=(e)=>{
    let pwdRegex = new RegExp('(?=.*[0-9])(?=.*[a-zA-Z]).{8,20}');
    if(e.target.value.length < 8||e.target.value.length > 30){
        this.setState({
            passwordState:"Password length should be between 8 and 20"
        })
        console.log(e.target.value.length)
        return
    }
    if(!pwdRegex.test(e.target.value)){
        this.setState({
            passwordState:"Must contain characters and numbers"
        })
        return
    }
    this.setState({
        passwordState:"",
        passwordValue:e.target.value
    })

}

confirmPassword=(e)=>{
    if(e.target.value !== this.state.passwordValue||this.state.passwordValue ===""){
        this.setState({
            passwordSecond:"The two passwords do not match"
        })
        return
    }
    this.setState({
        passwordSecond:""
    })
}


//提交表单
sendForm=()=>{
    let account = document.getElementById("SignUpUsername").value;
    let verification = document.getElementById("SignUpCaptcha").value;
    let password = document.getElementById("SignUpPassword").value;
    let secondPassword = document.getElementById("SignUpSecondPassword").value;
    if(account.length === 0){
        alert("Account cannot be empty !");
        return;
    }
    if(this.state.signUpMessage !== "Account authentication successful !")
    {
        alert("Account already exists !");
        return;
    }
    if(verification.length < 6){
        alert("The verification code length cannot be less than 6 !");
        return;
    }
    if(password.length <= 0 & secondPassword.length <= 0){
        alert("Password can not be blank !");
        return;
    }
    if(this.state.passwordState.length > 0){
        alert("Please reset your password !");
        return;
    }
    if(this.state.passwordSecond.length > 0){
        alert("Two passwords entered are different !");
        return;
    }

    axios.post("/api/register_form",{
        user : account,
        password : password,
        verificationCode : verification
    })
    .then((response)=>{
        if(response.data === "success"){
            localStorage.setItem("userName",account)
            document.location.reload()
            //注册成功直接关闭注册页面
            //document.getElementById("footer-sign-mobule").style.display = "none"
            //将登录状态改变为登录状态，就是Head组件中那个绿色对号的svg显示,如果是在支付页面则不用
            //document.getElementById("loginState") ? (document.getElementById("loginState").style.display = "block") : document.getElementById("SignUpSubmit").disabled = true
            //document.getElementById("SignUpSubmit").disabled = true 
        }
        else{
            this.setState({
                captchaState : response.data
            })
            document.getElementById("verificationState").style.color = "red";
        }
    })
    
}

//打开head组件的的登录页面关闭注册页面
openLogin=()=>{
    document.getElementById("footer-sign-mobule").style.display = "none"
    document.getElementById("head-login-mobule").style.display = "block"
}

//这个手机注册页面与PC注册页面公用css文件，注意
    render() {
        return (
            <form className="PSignUpForm" >
                    
                    <h2 className="Psign-logo">Jendey</h2>
                    <hr />
                    <div className="PSignUpFormText">
                        <div className="Psign-title-mobule">
                            <h2 className="Psign-title">Register</h2>
                            <div className="Psign-link-text"><i onClick={this.openLogin}> Login </i></div>
                        </div>
                        <div>
                            <label>Account:</label><br />
                            <input id="SignUpUsername" className="PSignUpInput" onBlur={this.checkEmail} placeholder="Email address"></input><br />
                            <span id="SignUpState" className="PSignUpState">{this.state.signUpMessage}</span>
                        </div>
                        <div className="PSignUpVerify">
                            <label>Verify Email:</label><br />
                            <input id="SignUpCaptcha" className="PSignUpCaptcha" placeholder="code" maxLength="6"></input>
                            {
                                this.state.timingState?<div className="PgetCaptcha" onClick={this.getCode} >Send Code</div>:<div className="PcountdownButton" >{this.state.countdown}</div>
                            } 
                            <br/><span id="verificationState" style={{color: "red",fontSize: "14px",marginLeft: "10px"}}>{this.state.captchaState}</span>
                        </div>

                        <div style={{marginTop:"2%"}}>
                            <div>
                                <label>Set Password:</label><span style={{color: "red",fontSize: "14px",marginLeft: "10px"}}>{this.state.passwordState}</span><br />
                                <input id="SignUpPassword" className="PSignUpPassword" type="password" maxLength="30" placeholder="password" onFocus={this.checkPassword} onBlur={this.checkPassword}/><br />
                            </div>
                            <div style={{marginTop:"3%"}}>
                                <label>Confirm Password:</label><span style={{color: "red",fontSize: "14px",marginLeft: "10px"}}>{this.state.passwordSecond}</span><br />
                                <input id="SignUpSecondPassword" className="PSignUpConfirm" type="password" maxLength="30" placeholder="Please confirm your password" onBlur={this.confirmPassword} />
                            </div>
                        </div>
                    </div>
                    <div>
                        <input id="SignUpSubmit" className="PSignUpSubmit" onClick={this.sendForm} type="button" value="Subscribe Now" ></input>
                        <p id="subscribeState" style={{textAlign:"center",width:"100%",color:"teal"}}></p>    
                    </div>
                    <p className="Psign-prompt">
                        When your subscription is complete, you will receive an email notification from us.<br /> At the same time, the discount coupon will be credited to your account
                    </p>
            </form>
        );
    }
}

export default PhoneRegister;