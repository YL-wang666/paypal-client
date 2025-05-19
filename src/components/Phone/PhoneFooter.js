import React , {Component} from "react"
import { Link } from "react-router-dom";
import PhoneRegister from "./publicCom/PhoneRegister";
import "../../assets/css/phone/phoneFooter.css"
class PhoneFooter extends Component {
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
                <div style={{width:"100%",backgroundColor:"#d10483",height:"3px"}}></div>
                <div className="Pfooter-text-mobule">
                    
                    <div className="Pfooter-btn-mobule">
                        <h4>Support</h4>
                        <li><Link rel="noopener noreferrer" rel="noreferrer"  to="/copromo">Co-Promo</Link></li>
                        <li><Link rel="noopener noreferrer" rel="noreferrer"  to="/Blogs">Blogs</Link></li>
                        <li><Link rel="noopener noreferrer" rel="noreferrer"  to="/FAQs">FAQs</Link></li>
                        <li><Link className="headCart" rel="noopener noreferrer" rel="noreferrer" to="/query">Order Tracking</Link></li>
                    </div>
                    <div className="Pfooter-btn-mobule">
                        <h4>Policy</h4>
                        <li><Link rel="noopener noreferrer" rel="noreferrer"  to="/privacy_policy">Privacy Policy</Link></li>
                        <li><Link rel="noopener noreferrer" rel="noreferrer"  to="/return">Return and Refund Policy</Link></li>
                        <li><Link rel="noopener noreferrer" rel="noreferrer"  to="/shipping_policy">Shipping Policy</Link></li>
                        <li><Link className="PheadCart" rel="noopener noreferrer"  rel="noreferrer" to="/warranty_policy">Warranty Policy</Link></li>
                    </div>

                    <div className="Pfooter-contact-mobule">
                        <h4>Contact</h4>
                        <div className="Pfooter-service-email-mobule">
                            <div style={{fontSize:"14px",color:"white",fontWeight:"600"}}>Service :</div>
                            <div className="Pfooter-email-a">
                                <div style={{marginBottom:"5%"}}><a href="mailto:service@jendey.com">service@jendey.com</a></div>
                                <a href="mailto:after-sales@jendey.com">after-sales@jendey.com</a>
                            </div>
                            <div style={{fontSize:"14px",marginTop:"10%",color:"white",fontWeight:"600"}}>Co-Promo :</div>
                            <div className="Pfooter-email-a"><a href="mailto:support@jendey.com">support@jendey.com</a></div>
                        </div>
                    </div>

                    <div className="Pfooter-media-mobule">
                        <h4 style={{fontSize:"20px"}}>Follow Us</h4>
                        <div className="Pfooter-media-btn-mobule">
                            <a target="_blank" href="https://www.facebook.com/jendey"><img src={require("../../assets/images/facebook1.png")} alt="facebook icon" loading="lazy"/></a>
                            <a rel="noopener noreferrer" rel="noreferrer" target="_blank" href="https://www.youtube.com/channel/UCx3np1cpajAdYVWg3nIDMHw"><img src={require("../../assets/images/Youtube2.png")} alt="youtube icon" loading="lazy" /></a>
                            <a target="_blank" href="https://www.instagram.com/jendey_jewelry"><img src={require("../../assets/images/instagram2.png")} alt="ins icon" loading="lazy"/></a>
                        </div>
                    </div>
                </div>

                <div className="Pfooter-email-mobule">
                    <h4>BE IN THE KNOW</h4>
                    <div style={{width:"90%",fontSize:"14px"}}>
                        Sign up to get the latest on products, styling and events
                    </div>
                    <div className="Pfooter-email-input">
                        <input id="footer-emial-input" placeholder="Email Address" />
                        <button onClick={this.footerSignUp}>Sign Up</button>
                    </div>
                </div>

                <div className="Pfooter-card-curr-mobule">
                    <div className="Pfooter-card-mobule">
                        <img src={require("../../assets/images/card1.png")} alt="card icon" loading="lazy"/>
                        <img src={require("../../assets/images/card2.png")} alt="card icon" loading="lazy"/>
                        <img src={require("../../assets/images/card3.png")} alt="card icon" loading="lazy"/>
                        <img src={require("../../assets/images/card4.png")} alt="card icon" loading="lazy"/>
                        <img src={require("../../assets/images/card5.png")} alt="card icon" loading="lazy"/>
                        <img src={require("../../assets/images/card6.png")} alt="card icon" loading="lazy"/>
                    </div>

                    <div className="PfooterISO">
                        
                        <select id="footerISOSelect" onChange={this.currChange} value={this.props.ISO}>
                            <option style={{color:"black"}} value="USD">USD($)</option>
                            <option style={{color:"black"}} value="EUR">EUR(€)</option>
                            <option style={{color:"black"}} value="GBP">GBP(£)</option>
                        </select>
                    </div>

                </div>
                    
                <div className="Pfooter-copyright-mobule">© 2024 Jendey. All rights reserved</div>

                <div id="footer-sign-mobule" className="Pfooter-sign-mobule">
                    <button onClick={this.isFooterCloseSign} className="Pfooter-sign-close-btn">×</button>
                    <PhoneRegister onRef={this.onRef}/>
                </div>
                
            </footer>
        );
    }
}

export default PhoneFooter;