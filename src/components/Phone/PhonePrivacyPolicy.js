import React,{Component} from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import PhoneHead from "./PhoneHead";
import PhoneFooter from "./PhoneFooter";

class PhonePrivacyPolicy extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            curr: localStorage.getItem("curr")?localStorage.getItem("curr"):"$",
            currNum : localStorage.getItem("currNum")?localStorage.getItem("currNum"):1,
            ISO : localStorage.getItem("ISO")?localStorage.getItem("ISO"):"USD",
            description : "Jendey : Privacy Policy"
         };
    }

    
    componentDidMount(){
        document.querySelector('meta[name="description"]').setAttribute("content", this.state.description);
       this.pageLoadAdd()
    }

   //加载一次页面传给后端
   pageLoadAdd=()=>{
        axios.post("/api/page_click",{
            page : "PhonePrivacyPolicy"
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
                <div style={{backgroundColor:"white",borderBottom:"0.2px gray solid"}} id="head-fixed" className="Phead-fixed" >
                    <PhoneHead name="home" headRef={this.headRef} ISO={this.state.ISO} headCurrChange={this.headCurrChange} scrollShow={this.scrollShow}/>
                </div>
            <div style={{marginBottom:"30%",marginTop:"45%"}}>
                <div></div>
                <h3 style={{fontSize:"30px",width:"90%",marginLeft:"5%",marginTop:"20%",fontWeight:"500",fontFamily:"'Noto Serif SC', serif"}}>Privacy Policy</h3>
                
                <p style={{lineHeight:"25px",width:"90%",marginLeft:"5%",marginTop:"20%",letterSpacing:"0.6px"}}>
                    
                    <b>Introduction</b>
                    <br /><br />
                    Welcome to Jendey. We highly value your privacy and are committed to protecting your personal information. This privacy policy is designed to help you understand how we collect, use, and protect your personal information. Please read this privacy policy carefully before using this site.
                    <br /><br />
                    <b>Information Collection and Use</b>
                    <br /><br />
                    We may collect your personal information, including but not limited to, in the following ways:
                    <br />
                    Access Information: When you visit this site, we may collect information about your computer and your access, including your IP address, browser type, operating system, access date, and time.
                    <br />
                    Registration Information: If you choose to register an account on this site, we will collect your name, email address, password, and other such information.
                    <br />
                    Transaction Information: If you engage in transactions or purchase products or services on this site, we may collect your payment information(We will not collect any banking card information), shipping address, and related details.
                    <br />
                    Cookies and Similar Technologies: We use cookies and similar technologies to track your online activities and provide an improved user experience. 
                    <br />
                    Other Information: You may also voluntarily provide other information, such as participating in surveys or subscribing to email newsletters.
                    <br /><br />
                    <b>The primary purposes for collecting this information are:</b>
                    <br /><br />
                    To provide, maintain, and improve the services on this site.<br />
                    To process your orders and transactions.<br />
                    To send you relevant information, notifications, and updates.<br />
                    To communicate with you and respond to your requests.<br />
                    To enhance the user experience and personalize services.
                    <br /><br />
                    Information Sharing and Disclosure:
                    <br />
                    We do not sell, exchange, or rent your personal information to third parties. However, we may share your information with the following parties
                    <br /><br />
                    Third-party service providers: We may share necessary information with third-party partners such as payment processors and logistics companies to complete transactions and provide services.
                    <br /><br />
                    <b>Information Protection</b>
                    <br /><br />
                    We take reasonable security measures to protect your personal information from unauthorized access, use, or disclosure.
                    <br /><br />
                    <b>Privacy Updates</b>
                    <br /><br />
                    We may periodically update this privacy policy to reflect changes in the law, improvements to website functionality, or changes in our privacy practices. The updated privacy policy will be published on this website and will take effect on January 1, 2022. Please check the privacy policy regularly for the latest information.
                    <br /><br />
                    <b>Contact Us</b>
                    <br /><br />
                    If you have any questions or concerns about this privacy policy or your personal information, please contact us via email at service@jendey.com
                </p>
            </div>

            <div className="Pshipping-nav-mobule">
                <div><Link to="/"><i>Home</i></Link></div><div>{" › "}</div>
                <div><Link to="/privacy_policy"><i>Privacy Policy</i></Link></div><div></div>
            </div>
            <PhoneFooter name="home" onRef={this.onRef} ISO={this.state.ISO} headCurrChange={this.headCurrChange}/>
        </div>
        );
    }
}

export default PhonePrivacyPolicy;