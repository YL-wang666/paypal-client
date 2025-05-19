import React,{Component} from "react";
import axios from "axios";
import Head from "./Head";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import "../assets/css/faqs.css";

class FAQs extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            curr: localStorage.getItem("curr")?localStorage.getItem("curr"):"$",
            currNum : localStorage.getItem("currNum")?localStorage.getItem("currNum"):1,
            ISO : localStorage.getItem("ISO")?localStorage.getItem("ISO"):"USD",
            FAQs:[{"title":"What makes Jingdezhen porcelain different from other porcelain?","text":"Jingdezhen porcelain has a 1900-year legacy and is known as the 'Porcelain Capital of the World.' Its pieces are celebrated for their delicate texture, flawless glaze, and handcrafted perfection, typically fired at 1300°C, making them far superior to industrial porcelain."},
                      {"title":"Are these pieces made by machine?","text":"No. All our pieces are entirely handcrafted by experienced ceramic artists, from shaping and carving to glazing, painting, and firing—often involving dozens of meticulous steps."},
                      {"title":"Why is Jingdezhen porcelain more expensive than regular porcelain?","text":"Because of its handcrafted process, high-temperature firing, time-intensive craftsmanship, and high rejection rate, each piece is a unique work of art. High-end pieces may take 10–30 days to complete."} ,
                      {"title":"Is it safe for drinking tea or coffee?","text":"Absolutely. Our porcelain uses lead-free, food-safe glazes, making it safe for daily use. Handwashing is recommended to preserve the glaze."} ,
                      {"title":"Are they microwave and dishwasher safe?","text":"Yes, our porcelain is safe for use in both microwave ovens and dishwashers. However, for pieces with metallic decoration or delicate craftsmanship, we still recommend handwashing to extend their lifespan."},
                      {"title":"Do you offer customization?","text":"Yes, we offer customization services including personalized engraving, design motifs, and color combinations. Perfect for gifts, commemoratives, or collectors. Please contact us for more information"},
                      {"title":"Do you ship internationally?","text":"Yes, we ship worldwide with secure packaging and optional insurance to ensure each piece arrives safely."} ,
                      {"title":"What happens if the porcelain is damaged during shipping?","text":"We provide damage protection for transit. If your item arrives broken, please contact us with photos within 48 hours and we will arrange a replacement or refund."}
                    ]
         };
    }

    componentDidMount(){
        this.pageLoad()
    }

    pageLoad=()=>{
        axios.post("/api/page_click",{
            page : "faq"
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


    showFAQAns=(e)=>{
        let value = e.currentTarget.getAttribute("value")
        if(document.getElementById("FAQ-show-btn" + value).outerText === "+"){
            document.getElementById("FAQ-show-btn" + value).innerHTML = "-"
            document.getElementById("FAQ-ans" + value).style.display = "block"
        }
        else{
            document.getElementById("FAQ-show-btn" + value).innerHTML = "+"
            document.getElementById("FAQ-ans" + value).style.display = "none"
        }

    }

    render() {
        return (
            <div>
                <div style={{backgroundColor:"white",borderBottom:"0.2px gray solid"}} id="head-fixed" className="head-fixed" onMouseEnter={this.changeBackwhite} onMouseLeave={this.changeBackOp}>
                    <Head name="home" headRef={this.headRef} ISO={this.state.ISO} headCurrChange={this.headCurrChange} scrollShow={this.scrollShow}/>
                </div>

                <div className="FAQ-mobule">
                    <h3>FAQs</h3>
                    <div className="FAQ-info">
                        {
                            this.state.FAQs.map((value , key)=>{
                                return <div className="FAQ-text">
                                            <div value={key} onClick={this.showFAQAns} className="FAQ-title">
                                                <h4>{value.title}</h4>
                                                <div id={"FAQ-show-btn"+key} className="FAQ-show-btn">+</div>
                                            </div>
                                            <p id={"FAQ-ans"+key} dangerouslySetInnerHTML={{__html:value.text}} ></p>
                                        </div>
                            })
                        }
                    </div>
                </div>


                <Footer name="home" onRef={this.onRef} ISO={this.state.ISO} headCurrChange={this.headCurrChange}/>
            </div>
        );
    }
}

export default FAQs;