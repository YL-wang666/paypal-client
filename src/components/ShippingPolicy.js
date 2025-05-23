import React , {Component} from "react"
import { Link } from "react-router-dom";
import axios from "axios";
import Head from "./Head";
import Footer from "./Footer";
import "../assets/css/shippingPolicy.css";
class ShippingPolicy extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            curr: localStorage.getItem("curr")?localStorage.getItem("curr"):"$",
            currNum : localStorage.getItem("currNum")?localStorage.getItem("currNum"):1,
            ISO : localStorage.getItem("ISO")?localStorage.getItem("ISO"):"USD",
            description : "Jendey : Shipping Policy"
         };
    }

    componentDidMount(){
        document.querySelector('meta[name="description"]').setAttribute("content", this.state.description);
        this.pageLoad()
    }

    pageLoad=()=>{
        axios.post("/api/page_click",{
            page : "shippingPolicy"
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
                <div style={{backgroundColor:"white",borderBottom:"0.2px gray solid"}} id="head-fixed" className="head-fixed" >
                    <Head name="home" headRef={this.headRef} ISO={this.state.ISO} headCurrChange={this.headCurrChange} scrollShow={this.scrollShow}/>
                </div>

                <div className="shipping-head-mobule">
                    <img style={{width:"100%"}} src={require("../assets/images/ship2.jpg")} alt="Shipping Policy"/>
                    <div className="shipping-head-title-mobule">
                        <div className="shipping-move">
                            <div><svg t="1711529205111" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13295" width="98" height="98"><path d="M512 0.128C229.312 0.128 0.16 229.12 0.16 511.584c0 260.928 195.52 476.224 448.16 507.52 14.24 3.008 31.584 4.768 52.256 4.768 5.792 0 11.392-0.32 16.8-0.864 280.192-2.88 506.464-230.72 506.464-511.424C1023.84 229.12 794.688 0.128 512 0.128zM431.296 973.44C211.04 934.976 43.584 742.944 43.584 511.808c0-33.12 3.456-65.472 10.016-96.64 20.256 21.632 68 21.12 79.616-11.232 20.832 12.416 48.832 14.656 48.832 39.488 0 81.888 2.912 169.696 77.344 171.04 2.08 0 41.472 14.944 60.224 63.552 6.496 16.832 32.128 0 60.256 0 14.048 0 0 23.68 0 74.816 0 50.944 109.856 129.408 109.856 129.408-0.512 33.728 0.864 60.992 3.68 82.784-24.8-0.48-45.696 2.816-62.08 8.416z m196.768-7.296c-2.432-11.904-13.088-18.432-32.48-13.312 15.488-65.952 23.008-102.88 55.36-130.944 46.72-40.544 5.536-85.632-30.048-80.32-28.064 4.256-10.336-34.72-35.36-36.896-25.056-2.08-57.728-51.872-93.76-69.024-19.104-9.056-37.888-33.376-67.36-34.464-26.112-1.024-64.256 22.08-64.256 4.256 0-57.312-5.824-98.24-7.008-114.56-0.96-13.12-8.576-4.416 26.72-3.584 19.2 0.512 9.824-38.592 28.864-40.096 18.656-1.472 63.168 17.472 74.496 9.92 10.56-7.04 77.44 175.584 77.44 30.176 0-17.248-8.96-47.232 0-63.584 35.328-64.544 68.384-117.184 65.44-124.896-1.696-4.32-36.16-7.904-63.744 1.344-9.28 3.136 2.976 17.696-10.4 20.8-50.08 11.584-94.336-13.504-78.848-37.056 15.872-24.128 73.376-10.528 78.4-58.976 2.88-27.744 5.312-59.872 6.912-83.744 67.424 10.528 60-87.488-40.224-97.984 202.752 2.368 374.56 133.312 437.6 315.04a19.104 19.104 0 0 0-11.2-5.12c-30.272-75.68-103.84-20.896-78.88 45.856-133.664 102.784-99.456 174.464-55.552 215.488 23.136 21.568 45.152 54.016 59.52 77.312-15.616 45.536 57.504 27.328 93.6-49.952a469.696 469.696 0 0 1-335.232 324.32z m312.96-546.624a439.904 439.904 0 0 1 9.632 99.296 501.728 501.728 0 0 0-9.984-74.752c0.448-8.672 0.576-16.896 0.352-24.544z" fill="#ffffff" p-id="13296"></path></svg></div>
                            <h1>Worldwide Free Shipping</h1>
                        </div>
                    </div>
                </div>

                <div className="shipping-policy-mobule">
                    <h2>Shipping Policy</h2>
                    <div className="shipping-policy-label">Thank you for choosing the PorcEast brand! Here is our shipping policy to ensure that your orders are delivered safely and promptly</div>
                    <div className="shipping-info-mobule">
                        <div className="shipping-text-mobule">
                            <h4>Delivery Time</h4>
                            <p>
                                PorcEast offers global shipping. Due to the time-intensive nature of handcrafted porcelain, delivery typically takes 12–25 days. Please note that actual delivery times may vary depending on the destination, shipping volume, and other factors.
                            </p>
                        </div>
                        <div className="shipping-text-mobule">
                            <h4>Order Processing</h4>
                            <p>
                                After placing an order, we will confirm and prepare it within 1-2 days. You can track the status and delivery process of your order through the email you provided.
                            </p>
                        </div>
                        <div className="shipping-text-mobule">
                            <h4>Address Modification</h4>
                            <p>
                                To ensure the safe delivery of orders, we do not accept requests to modify shipping addresses during transit.
                            </p>
                        </div>
                        <div className="shipping-text-mobule">
                            <h4>Delivery Anomaly</h4>
                            <p>
                                In the event that the carrier fails to complete the delivery or if a package is lost during transit, we will take full responsibility for arranging a new delivery until the package safely reaches the specified address.
                            </p>
                        </div>
                        <div className="shipping-text-mobule">
                            <h4>Inspection upon Receipt</h4>
                            <p>
                                Upon receiving your goods, please promptly inspect them for integrity and quantity. If you discover any damage, shortages, or other issues, please contact our after-sales service team immediately at <a style={{color:"black"}} href="mailto:service@proceast.com">service@proceast.com</a>.
                            </p>
                        </div>
                        <div className="shipping-text-mobule">
                            <h4>Other</h4>
                            <p>
                            We are committed to providing you with efficient and reliable shipping services. If you have any questions or needs, please feel free to contact us. Once again, thank you for choosing the PorcEast brand!
                            </p>
                        </div>
                    </div>
                </div>

                <div className="shipping-nav-mobule">
                    <div><Link to="/"><i>Home</i></Link></div><div>{" › "}</div>
                    <div><Link to="/shipping_policy"><i>Shipping Policy</i></Link></div><div></div>
                </div>

                <Footer name="home" onRef={this.onRef} ISO={this.state.ISO} headCurrChange={this.headCurrChange}/>
            </div>
        );
    }
}

export default ShippingPolicy;