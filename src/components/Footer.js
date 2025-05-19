import React , {Component} from "react"
import { Link } from "react-router-dom";
import Register from "./publicCom/Register";
import "../assets/css/footer.css"
class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
        
    }

    componentDidMount(){
        if(this.props.name === "home"){
            this.props.onRef(this);
        }
        
        document.getElementById("footerISOSelect").value = localStorage.getItem("ISO")
    }

    currChange=(e)=>{
        let currNumArr={"USD":1,"EUR":0.91,"GBP":0.79}
        let currISOArr={"USD":"$","EUR":"€","GBP":"£"}
        localStorage.setItem("curr",currISOArr[e.target.value])
        localStorage.setItem("ISO",e.target.value)
        localStorage.setItem("currNum",currNumArr[e.target.value])
        this.props.headCurrChange(currISOArr[e.target.value],currNumArr[e.target.value],e.target.value)
    }

    //要调用子组sign件的方法
    onRef = (ref) => {
        this.childFooter = ref
    }

    footerSignUp=()=>{
        this.childFooter.checkParentEmail(document.getElementById("footer-emial-input").value)
        document.getElementById("footer-sign-mobule").style.display = "block"
    }

    //控制订阅页面隐藏
    isFooterCloseSign=()=>{
        document.getElementById("footer-sign-mobule").style.display = "none"
    }

    //来自home页面的订阅
    parentSubscribe=(e)=>{
        document.getElementById("footer-emial-input").value = e
        this.footerSignUp()
    }

    render() {
        return (
            <footer>
                <div className="footer-text-mobule">
                    
                    <div className="footer-btn-mobule">
                        <h4>Support</h4>
                        <li><Link  to="/">Home</Link></li>
                        <li><Link  to="/contact">Contact Us</Link></li>
                        <li><Link  to="/FAQs">FAQs</Link></li>
                        <li><Link className="headCart" to="/query">Order Tracking</Link></li>
                    </div>
                    <div className="footer-btn-mobule">
                        <h4>Policy</h4>
                        <li><Link  to="/privacy_policy">Privacy Policy</Link></li>
                        <li><Link  to="/return">Return and Refund Policy</Link></li>
                        <li><Link  to="/shipping_policy">Shipping Policy</Link></li>
                    </div>

                   

                    <div className="footer-email-mobule">
                        <h4>BE IN THE KNOW</h4>
                        <div style={{width:"90%"}}>
                            Sign up to get the latest on products, styling and events
                        </div>
                        <div className="footer-email-input">
                            <input id="footer-emial-input" placeholder="Email Address" />
                            <button onClick={this.footerSignUp}>Sign Up</button>
                        </div>
                        <div className="fotter-media-btn-mobule">
                            <a target="_blank" href="https://www.facebook.com/jendey"><img src={require("../assets/images/facebook.png")} alt="facebook icon" loading="lazy" /></a>
                            <a rel="noopener noreferrer" rel="noreferrer" target="_blank" href="https://www.youtube.com/channel/UCx3np1cpajAdYVWg3nIDMHw"><img src={require("../assets/images/youtube.png")} alt="youtube icon" loading="lazy" /></a>
                            <a target="_blank" href="https://www.instagram.com/jendey_jewelry"><img src={require("../assets/images/ins.png")} alt="ins icon" loading="lazy" /></a>
                        </div>
                        
                    </div>
                </div>
                <div className="footer-bottom-mobule">
                    <div style={{marginLeft:"5%",fontWeight:"600",margin:"auto"}}>© 2024 proceast. All rights reserved</div>
                    <div className="footerISO">
                        <img loading="lazy" src={require("../assets/images/iso.png")}/>
                        <select id="footerISOSelect" onChange={this.currChange} value={this.props.ISO}>
                            <option style={{color:"black"}} value="USD">USD($)</option>
                            <option style={{color:"black"}} value="EUR">EUR(€)</option>
                            <option style={{color:"black"}} value="GBP">GBP(£)</option>
                        </select>
                    </div>
                    <div className="footer-card-mobule">
                        <img loading="lazy" src={require("../assets/images/card1.png")} alt="card icon"/>
                        <img loading="lazy" src={require("../assets/images/card2.png")} alt="card icon"/>
                        <img loading="lazy" src={require("../assets/images/card3.png")} alt="card icon"/>
                        <img loading="lazy" src={require("../assets/images/card4.png")} alt="card icon"/>
                        <img loading="lazy" src={require("../assets/images/card5.png")} alt="card icon"/>
                        <img loading="lazy" src={require("../assets/images/card6.png")} alt="card icon"/>
                    </div>
                    
                </div>
                <div id="footer-sign-mobule" className="footer-sign-mobule">
                    <button onClick={this.isFooterCloseSign} className="footer-sign-close-btn">×</button>
                    <Register onRef={this.onRef}/>
                </div>
                
            </footer>
        );
    }
}

export default Footer;