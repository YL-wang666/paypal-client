import React,{Component} from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import PhoneHead from "./PhoneHead";
import PhoneFooter from "./PhoneFooter"
import "../../assets/css/phone/phoneAbout.css"
class PhoneAbout extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            curr: localStorage.getItem("curr")?localStorage.getItem("curr"):"$",
            currNum : localStorage.getItem("currNum")?localStorage.getItem("currNum"):1,
            ISO : localStorage.getItem("ISO")?localStorage.getItem("ISO"):"USD",
            description: "Jendey contributes to the skincare and facial improvement of women, providing value to a wide range of female consumers"
         };
    }

    componentDidMount(){
        document.querySelector('meta[name="description"]').setAttribute("content", this.state.description);
        this.pageLoad()
    }

    pageLoad=()=>{
        axios.post("/api/page_click",{
            page : "PhoneAbout"
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

    //跳转时就是该组件销毁时清除掉本组件的监听
    componentWillUnmount(){
        //document.removeEventListener("scroll",this.scrollShow)
    }


    render() {
        return (
            <div>
                <div style={{backgroundColor:"white"}} id="head-fixed" className="Phead-fixed" onMouseEnter={this.changeBackwhite} onMouseLeave={this.changeBackOp}>
                    <PhoneHead name="home" headRef={this.headRef} ISO={this.state.ISO} headCurrChange={this.headCurrChange} scrollShow={this.scrollShow}/>
                </div>
                
                <div className="Pabout-mouble-1">
                    <img style={{width:"100%"}} src={require("../../assets/images/phoneImg/about.jpeg")} />
                    <div className="Pabout-values-mobule">
                        <h1>Our Values</h1>
                        <p>
                            <i>
                                Our mission is to delay aging and restore vitality to facial skin. Youthful beauty is the right of every woman, and we are committed to contributing to this.
                            </i>
                        </p>
                    </div>
                </div>

                <div className="Pabout-info-mobule">
                    <div className="Pabout-mobule-2">
                        <div className="Pabout-mobule-2-title">
                            THE GREATEST GIFT
                        </div>
                        <p  className="Pabout-mobule-2-text">
                            A youthful, beautiful appearance is the greatest gift in every woman's life. However, as age advances, although we cannot prevent its disappearance, we can slow down its pace.
                        </p>
                    </div>
                    <div style={{width:"100%",height:"1.5px",backgroundColor:"#DCDCDC"}}></div>
                    <div className="Pabout-mobule-3">
                        <div className="Pabout-mobule-3-title">
                            FACING ISSUES
                        </div>
                        <p  className="Pabout-mobule-3-text">
                            The signs of aging typically first manifest on the face, as the gradual reduction of collagen leads to issues such as wrinkles and skin sagging, which every woman inevitably has to confront.
                        </p>
                    </div>
                </div>

                    <div className="Pabout-mobule-4"> 
                        <p>
                            <h3>About Us</h3>

                            At Jendey, we are dedicated to addressing facial skin concerns, collaborating with the technologically advanced team at Goodwind, who possess over 20 years of expertise in research and development. Together, we have introduced a multifunctional home beauty device aimed at improving facial skin conditions.

                            Our device harnesses the power of mature RF (Radio Frequency) technology alongside EMS (Electrical Muscle Stimulation) technology. This combination stimulates collagen regeneration while lifting and tightening the skin, effectively combating facial aging issues.

                            Today, the Jendey team proudly serves consumers in over a dozen countries, including the United States, United Kingdom, and Germany. Moving forward, we are committed to continually innovating solutions tailored to facial concerns.

                            Every positive change you make empowers us, and we look forward to accompanying you on your journey towards radiant skin.
                        </p>
                        <div>
                            <img  src={require("../../assets/images/product/pro1.png")} />
                            <p>ZH - Home RF Beauty Device</p>
                            <Link rel="noopener noreferrer" rel="noreferrer" to="/detail?pdnum=pro1"><button>Learn More</button></Link>
                        </div>
                    </div>
                
                   

                    <PhoneFooter name="about" ISO={this.state.ISO} headCurrChange={this.headCurrChange}/>

            </div>
        );
    }
}

export default PhoneAbout;