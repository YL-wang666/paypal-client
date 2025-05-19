import React,{Component} from "react";
import axios from "axios";
import Head from "./Head";
import Footer from "./Footer";
import "../assets/css/contact.css"
class Contact extends Component {
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
            page : "contact"
        })
    }
    
      sendMessage=()=>{
        axios.post("/api/contactForm",{
            form_type : document.getElementById("contactUsForm_1").value,
            form_email : document.getElementById("contactUsForm_2").value,
            form_text : document.getElementById("contactUsForm_3").value.replace(/\n|\r\n/g,"<br />")
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
                <div style={{backgroundColor:"white",borderBottom:"0.2px gray solid"}} id="head-fixed" className="head-fixed" onMouseEnter={this.changeBackwhite} onMouseLeave={this.changeBackOp}>
                    <Head name="home" headRef={this.headRef} ISO={this.state.ISO} headCurrChange={this.headCurrChange} scrollShow={this.scrollShow}/>
                </div>

                <div className="contact-head-mobule">
                    <div className="contact-head-text">
                        <h2>Contact Us</h2>
                        <p>If you have any questions, don't hesitate! You can contact us directly via email or by filling out the contact form below. Our team will get back to you as soon as possible!</p>
                    </div>
                </div>

                <div className="contactUsFormMobule">
                    <div className="contactUsFormMobule-mobule-1">
                        <h3>Contact Form</h3>
                        <div style={{height:"4px",backgroundColor:"orangered",width:"19%",marginBottom:"2%"}}></div>
                        <label>Form Type</label><br />
                        <select id="contactUsForm_1" className="contactUsSelect">
                            <option value="Please select">Please select</option>
                            <option value="Inquiry">Inquiry</option>
                            <option value="After-Sales Service">After-Sales Service</option>
                            <option value="Provide Better Advice">Provide Better Advice</option>
                        </select>
                        <br /><br />
                        <label>Your Message</label><br />
                        <textarea id="contactUsForm_3" className="contactUsTextarea" placeholder="Message" maxLength="3000"/>
                        
                    </div>
                    <div className="contactUsFormMobule-mobule-2">
                        <label>Your Email Address</label><br />
                        <input id="contactUsForm_2" className="contactUsInput" type="text" placeholder="Email address" maxLength="320"/>
                        <br /><br />
                        <button className="contactUsSubmit"  value="Send Message" onClick={this.sendMessage} >Send Message</button>
                        
                    </div>
                </div>

                 {/**提交成功的提示 */}
                <div className={this.state.showPrompt?"contactUsPrompt":"contactUsPromptHidden"}>
                    <b>Submission successful!</b>
                </div>

                <div style={{width:"100%",textAlign:"center",fontSize:"20px",color:"#1A3A64"}}>OR</div>

                <div className="contact-email-mobule">
                    <div className="contact-email-info">
                        <img src={require("../assets/images/contact1.png")} />
                        <p>Pre-sales Consultation</p>
                        <a href="mailto:service@jendey.com">service@proceast.com</a>
                        <div>24-HOUR RESPONSE</div>
                    </div>
                    <div className="contact-email-info">
                        <img src={require("../assets/images/contact2.png")} />
                        <p>After-sales Service</p>
                        <a href="mailto:after-sales@jendey.com">service@proceast.com</a>
                        <div>24-HOUR RESPONSE</div>
                    </div>
                    <div className="contact-email-info">
                        <img src={require("../assets/images/whatsapp.png")} />
                        <p>WhatsApp</p>
                        <a href="mailto:support@jendey.com">+86 15824110364</a>
                        <div>48-HOUR RESPONSE</div>
                    </div>
                </div>
                <p className="contact-worktime-mobule">
                    Our service hours are Beijing Time: 9:00 AM – 12:00 AM<br />
                    (Equivalent to New York Time: 9:00 PM – 11:00 AM,<br />
                    Central European Time: 3:00 AM – 6:00 PM).<br />
                    All inquiries will be handled during this time.
                </p>

                <Footer name="home" onRef={this.onRef} ISO={this.state.ISO} headCurrChange={this.headCurrChange}/>
            </div>
        );
    }
}

export default Contact;