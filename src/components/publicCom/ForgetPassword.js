import axios from "axios";
import React,{Component} from "react";
class ForgetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            signUpMessage:"",
            captchaState:"",
            showPassword:false,
            passwordState:"",
            passwordValue:"",
            passwordSecond:"",
            timingState:true, //这三元运算的参数，用于转换两个标签实现按钮和计数器的切换
            countdown:""   //这是验证码显示计数器
         };
    }

getCode=()=>{
    if(this.state.signUpMessage === "Account does not exist !"){
        return;
    }
    this.setState({
        timingState:false
    })

    let emailadress = document.getElementById("forgetUsername").value;
    axios.post("/api/send_VerificationCode",{
       // user : document.getElementByI("SignUpUsername").value
       user : emailadress
    })
    .then((response)=>{
        //response.data.length字符串长度大于20 返回时发送成功，提示的颜色要变绿色，否则发送失败，提示颜色时本身红色
        if(response.data.length > 20){
            this.setState({
                captchaState : response.data,
            })
            document.getElementById("forgetVerification").style.color = "rgb(13, 214, 29)";
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

//验证验证码是否正确，如果正确将显示密码重置部分
checkVerification=(e)=>{
    if(e.target.value.length < 6){return;}
    let userName = document.getElementById("forgetUsername").value;
    let verification = e.target.value;
    axios.post("/api/forget_verify",{
        user : userName,
        verification : verification
    })
    .then((response)=>{
        if(response.data === "success"){
            this.setState({
                showPassword : true ,
                captchaState : "Verification passed"
            })
            document.getElementById("forgetVerification").style.color = "rgb(13, 214, 29)";
        }
       else if(response.data === "fail"){
            this.setState({
                captchaState : "Verification code error !"
            })
            document.getElementById("forgetVerification").style.color = "red";
        }
    })
    .catch(function (error) {
        alert("Service area is busy !")
    })

}


checkPassword=(e)=>{
    let pwdRegex = new RegExp('(?=.*[0-9])(?=.*[a-zA-Z]).{8,30}');
    if(e.target.value.length < 8||e.target.value.length > 30){
        this.setState({
            passwordState:"Password length should be between 8 and 30"
        })
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

async checkUser(e){
    axios.post("/api/check_user",{
        user : e
    })
    .then((response)=>{
        //如果数据库存在改账户名，返回 error
        if(response.data === "error"){
            this.setState({
                signUpMessage : "Account authentication successful !"
            })
            document.getElementById("forgetState").style.color = "rgb(13, 214, 29)";
        }
        else{
            this.setState({
                signUpMessage : "Account does not exist !"
            })
            document.getElementById("forgetState").style.color = "red";
        }
    })
    .catch(function (error) {
        console.log(error);
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
    }
    else{
        this.checkUser(e.target.value);
    }
}

//提交表单
sendForm=()=>{
    let account = document.getElementById("forgetUsername").value;
    let password = document.getElementById("forgetPassword").value;
    let secondPassword = document.getElementById("forgetConfirm").value;
    if(account.length === 0){
        alert("Account cannot be empty !");
        return;
    }
    if(this.state.signUpMessage !== "Account authentication successful !")
    {
        alert("Account does not exist !");
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
    axios.post("/api/forget_update",{
        user : account,
        password : password,
    })
    .then((response)=>{
        if(response.data === "success"){
            this.props.changePage(0);
        }
        else{
            this.setState({
                captchaState : response.data
            })
            document.getElementById("forgetVerification").style.color = "red";
        }
    })

}

//打开登录界面
changePage=()=>{
    this.props.changePage(0)
}

//样式就和Login用一样的，所以className同样命名
    render() {
        return (
            <form className="LoginForm">
                <h2 className="sign-logo">PorcEast</h2>
                <hr />
                
                <div className="SignUpFormText">
                    <div className="sign-title-mobule">
                        <h2 className="sign-title">Reset Password</h2>
                        <div className="sign-link-text"><i onClick={this.changePage}> Login </i></div>
                    </div>
                    <div>
                        <label>Account:</label><br />
                        <input id="forgetUsername" className="SignUpInput" onBlur={this.checkEmail} placeholder="Email address" ></input><br />
                        <span id="forgetState" className="forgetState">{this.state.signUpMessage}</span>
                    </div>
                    <div style={{marginTop:"3%"}} className="SignUpVerify">
                        <label>Verify Email:</label><br />
                        <input  className="SignUpCaptcha" maxLength="6" placeholder="verification code" onChange={this.checkVerification}></input>
                        {
                            this.state.timingState?<div className="getCaptcha" onClick={this.getCode} >Send Code</div>:<div className="countdownButton" >{this.state.countdown}</div>
                        } 
                       <br /> <span id="forgetVerification" style={{color: "red",fontSize: "14px",marginLeft: "10px"}}>{this.state.captchaState}</span>
                    </div>
                    <div style={this.state.showPassword?{marginTop:"3%"} : {display:"none"}}>
                        <div>
                            <label>Set Password:</label><span style={{color: "red",fontSize: "14px",marginLeft: "10px"}}>{this.state.passwordState}</span><br />
                            <input id="forgetPassword" className="SignUpPassword" type="password" maxLength="30" placeholder="password" onFocus={this.checkPassword} onBlur={this.checkPassword}/><br />
                        </div>
                        <div style={{marginTop:"3%"}}>
                            <label>Confirm Password:</label><span style={{color: "red",fontSize: "14px",marginLeft: "10px"}}>{this.state.passwordSecond}</span><br />
                            <input id="forgetConfirm" className="SignUpConfirm" type="password" maxLength="30" placeholder="Please confirm your password" onBlur={this.confirmPassword} />
                        </div>
                    </div>
                    
                </div>

                <div style={{marginTop:'4%'}} ><input onClick={this.sendForm} className="SignUpSubmit" type="button" value="Submit" ></input></div>

            </form>
        );
    }
}

export default ForgetPassword;