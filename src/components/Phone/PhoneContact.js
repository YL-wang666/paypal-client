import React,{Component} from "react";
import axios from "axios";
import PhoneHead from "./PhoneHead";
import PhoneFooter from "./PhoneFooter";
import "../../assets/css//phone/phoneContact.css"
class PhoneContact extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            curr: localStorage.getItem("curr")?localStorage.getItem("curr"):"$",
            currNum : localStorage.getItem("currNum")?localStorage.getItem("currNum"):1,
            ISO : localStorage.getItem("ISO")?localStorage.getItem("ISO"):"USD",
            showPrompt : false,
            description : "Jendey: Contact Us for Inquiries Regarding Beauty Devices, Skincare, and More"
         };
    }

    componentDidMount(){
        document.querySelector('meta[name="description"]').setAttribute("content", this.state.description);
        this.pageLoad()
      }
    
      //加载一次页面传给后端
      pageLoad=()=>{
        axios.post("/api/page_click",{
            page : "PhoneContact"
        })
    }
    
      sendMessage=()=>{
        axios.post("/api/contactForm",{
            form_type : document.getElementById("contactUsForm_1").value,
            form_email : document.getElementById("contactUsForm_2").value,
            form_text : document.getElementById("contactUsForm_3").value
        })
        .then((response)=>{
            if(response.data == "200"){
                this.setState({
                    showPrompt : true
                },
                    ()=>{
                        for (let i = 3; i <= 3&&i >= 0; i--) {
                            setTimeout(()=> {
                                if(i === 0){
                                   this.setState({
                                        showPrompt : false
                                    }) 
                                }
                            }, 1000 * (3 - i)); 
                        } 
                    }
                )
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    
      }

    //改变货币时改变页面所有货币和金额
    headCurrChange=(curr,currNum,ISO)=>{
        this.setState({
            curr : curr,
            currNum : currNum,
            ISO : ISO
        })
        
    }

    //head的鼠标进出背景白色和透明切换
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

    render() {
        return (
            <div>
                <div style={{backgroundColor:"white",borderBottom:"0.2px gray solid"}} id="head-fixed" className="Phead-fixed" onMouseEnter={this.changeBackwhite} onMouseLeave={this.changeBackOp}>
                    <PhoneHead name="home" headRef={this.headRef} ISO={this.state.ISO} headCurrChange={this.headCurrChange} scrollShow={this.scrollShow}/>
                </div>

                <div className="Pcontact-head-mobule">
                    <img style={{width:"100%"}} src={require("../../assets/images/phoneImg/contact.jpg")} />
                    <div className="Pcontact-head-text">
                        <h1>Contact Us</h1>
                        <p>If you have any questions, don't hesitate, contact us immediately!</p>
                    </div>
                </div>

                <div className="Pcontact-email-mobule">
                    <div className="Pcontact-email-info">
                        <img src={require("../../assets/images/contact1.png")} />
                        <p>Pre-sales Consultation</p>
                        <a href="mailto:service@jendey.com">service@jendey.com</a>
                        <div>24-HOUR RESPONSE</div>
                    </div>
                    <div className="Pcontact-email-info">
                        <img src={require("../../assets/images/contact2.png")} />
                        <p>After-sales Service</p>
                        <a href="mailto:after-sales@jendey.com">after-sales@jendey.com</a>
                        <div>24-HOUR RESPONSE</div>
                    </div>
                    <div className="Pcontact-email-info">
                        <img src={require("../../assets/images/contact3.png")} />
                        <p>Cooperative Promotion</p>
                        <a href="mailto:support@jendey.com">support@jendey.com</a>
                        <div>48-HOUR RESPONSE</div>
                    </div>
                </div>

                <div className="Ppay-payment-divider"><div></div><p style={{fontSize:"18px",color:"#d10483",fontWeight:"700"}}>OR</p><div></div></div>

                <div className="PcontactUsFormMobule">
                    <div className="PcontactUsFormMobule-mobule-1">
                        <h3>Contact Form</h3>
                        <div style={{height:"4px",backgroundColor:"orangered",width:"19%",marginBottom:"2%"}}></div>
                        <label>Form Type</label><br />
                        <select id="contactUsForm_1" className="PcontactUsSelect">
                            <option value="Please select">Please select</option>
                            <option value="Inquiry">Inquiry</option>
                            <option value="After-Sales Service">After-Sales Service</option>
                            <option value="Provide Better Advice">Provide Better Advice</option>
                        </select>
                        <br /><br />
                        <label>Your Message</label><br />
                        <textarea id="contactUsForm_3" className="PcontactUsTextarea" placeholder="Message" maxLength="3000"/>
                        
                    </div>
                    <div className="PcontactUsFormMobule-mobule-2">
                        <label>Your Email Address</label><br />
                        <input id="contactUsForm_2" className="contactUsInput" type="text" placeholder="Email address" maxLength="320"/>
                        <br /><br />
                        <button className="PcontactUsSubmit"  value="Send Message" onClick={this.sendMessage} >Send Message</button>
                        
                    </div>
                </div>

                 {/**提交成功的提示 */}
                <div className={this.state.showPrompt?"PcontactUsPrompt":"PcontactUsPromptHidden"}>
                    <b>Submission successful!</b>
                </div>

                

                <PhoneFooter name="home" onRef={this.onRef} ISO={this.state.ISO} headCurrChange={this.headCurrChange}/>
            </div>
        );
    }
}

export default PhoneContact;