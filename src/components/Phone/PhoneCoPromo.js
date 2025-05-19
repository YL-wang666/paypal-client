import React,{Component} from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import PhoneHead from "./PhoneHead";
import PhoneFooter from "./PhoneFooter";
import "../../assets/css/phone/phoneCoPromo.css"
class PhoneCoPromo extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            curr: localStorage.getItem("curr")?localStorage.getItem("curr"):"$",
            currNum : localStorage.getItem("currNum")?localStorage.getItem("currNum"):1,
            ISO : localStorage.getItem("ISO")?localStorage.getItem("ISO"):"USD",
            description : "Join Jendey's Affiliate Program and Earn Commissions"
         };
    }

    componentDidMount(){
        document.querySelector('meta[name="description"]').setAttribute("content", this.state.description);
        //回到顶部
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        
        this.pageLoadAdd()
     }
 
    //加载一次页面传给后端
    pageLoadAdd=()=>{
         axios.post("/api/page_click",{
             page : "PhoneCopromo"
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

     //如果没有登录就打开登录页面
     openLogin=()=>{
         if(!localStorage.getItem("userName")){
            this.childhead.openLogin()
            return
         }
         window.location.href = "/panel"
     }
 

    render() {
        return (
            <div>
                <div style={{backgroundColor:"white",borderBottom:"0.2px gray solid"}} id="head-fixed" className="Phead-fixed" >
                    <PhoneHead name="home" headRef={this.headRef} ISO={this.state.ISO} headCurrChange={this.headCurrChange} scrollShow={this.scrollShow}/>
                </div>
                <div className="Pcopromo-mobule-1">
                    
                    <div className="Pcopromo-mobule-1-slogan">
                        <p>Share Our Products , Earn 15% Commission with Your Unique Link!</p>
                        <button onClick={this.openLogin}>Get Link</button>
                    </div>
                </div>

                <h2 className="Pcopromo-program-title">Partner Program Guidelines</h2>
                <div className="Pcopromo-mobule-2">
                    <p>
                        <h4>Partners:</h4>
                        Users who make purchases on our website, website/blog owners, and social media influencers are eligible for partnership.
                        <br /><br />
                        <h4>Get Your Unique Link:</h4>
                        You can register on our website to get your exclusive link. Whenever a user purchases any product through your link (not limited to the products you share), we'll identify it automatically without requiring any extra action from the user (such as filling in a referral code). You'll receive a 15% commission on all qualifying purchases.
                        <br /><br />
                        <h4>Free Samples for Social Media Influencers:</h4>
                        Influencers with over 10K followers on platforms such as YouTube, Instagram, Facebook, and Twitter can apply for free samples. Please contact us at <a href="mailto:support@jendey.com">support@jendey.com</a>, providing your social media information or links. We will evaluate based on your follower count, engagement metrics, and the vertical type of your channel.
                    </p>
                    <div style={{backgroundColor:"rgb(226, 226, 226)",width:"90%",marginLeft:"5%",marginTop:"5%"}}>
                        <div className="Pcopromo-mobule-button-mobule">
                            <h3>After logging in, access your dashboard to obtain your exclusive link !</h3>
                            <button onClick={this.openLogin}>Get Link</button>
                        </div>
                    </div>
                </div>

                <div className="Pshipping-nav-mobule">
                    <div><Link rel="noopener noreferrer" rel="noreferrer"  to="/"><i>Home</i></Link></div><div>{" › "}</div>
                    <div><Link rel="noopener noreferrer" rel="noreferrer"  to="/copromo"><i>Co-Promo</i></Link></div><div></div>
                </div>
                <PhoneFooter name="home" onRef={this.onRef} ISO={this.state.ISO} headCurrChange={this.headCurrChange}/>

            </div>
        );
    }
}

export default PhoneCoPromo;