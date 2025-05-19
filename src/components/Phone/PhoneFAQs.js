import React,{Component} from "react";
import axios from "axios";
import PhoneHead from "./PhoneHead";
import { Link } from "react-router-dom";
import PhoneFooter from "./PhoneFooter";
import "../../assets/css/phone/phoneFaqs.css";
class PhoneFAQs extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            curr: localStorage.getItem("curr")?localStorage.getItem("curr"):"$",
            currNum : localStorage.getItem("currNum")?localStorage.getItem("currNum"):1,
            ISO : localStorage.getItem("ISO")?localStorage.getItem("ISO"):"USD",
            FAQs:[{"title":"Will using a beauty device cause irreversible damage?","text":"Home radiofrequency beauty devices typically consider safety concerns, so they usually have lower power compared to those used in professional settings. However, the reliability of the product's temperature control system is crucial. If the temperature control is unreliable, the beauty device may expose the skin to temperatures as high as 70°C, leading to burns. Our radiofrequency beauty device has reliable safety features, so you can use it with peace of mind!"},
                      {"title":"What should be paid attention to when using radiofrequency beauty devices?","text":"1.Carefully read the instruction manual before using the device <br />2.Ensure the skin is clean<br /> 3.Use a conductive gel <br />4.Start with the lowest intensity and gradually adapt<br /> 5.Continuously move during use to ensure even heating of the skin<br /> 6.Avoid prolonged use in a single session"},
                      {"title":"Who should avoid using radiofrequency beauty devices?","text":"1.Individuals using medical electronic devices such as pacemakers or artificial cardiopulmonary machines should avoid using it.<br /><br />2.Those with skin diseases, hypertension, internal organ diseases, or telangiectasia should use it with caution.<br /><br />3.It is not recommended for use during pregnancy, menstruation, or lactation.<br /><br />4.After medical cosmetic procedures such as water injection, thread lifting, or photorejuvenation, please consult your physician.<br /><br />5.Those with allergies, sensitive or fragile skin, or allergies to metal materials should use it with caution.<br /><br />6.Those wearing contact lenses, with nearsightedness greater than 600, or with eye diseases such as cataracts, glaucoma, or retinal hemorrhage should use it with caution. Consult a doctor for use during the eye recovery period after surgery.<br /><br />7.Individuals with melasma should not use it."} ,
                      {"title":"Are home radiofrequency beauty devices the same as clinic-grade radiofrequency devices?","text":"Home radiofrequency devices and professional clinic devices both utilize radiofrequency technology to heat the collagen in the dermis, thereby inducing collagen contraction and regeneration. However, they differ in terms of frequency, power, and safety. <br /><br />Clinic devices typically employ single-frequency radiofrequency technology with higher power levels and are operated by trained medical professionals or technicians. As a result, they yield noticeable results after a single session but also carry certain risks.<br /><br />In contrast, home radiofrequency devices usually use dual or multi-frequency technology with lower power levels, prioritizing safety. Consequently, home devices require continuous use over a period of time to achieve desired results, but they are relatively safer."} ,
                      {"title":"Can other substitutes be used instead of gel?","text":"Some individuals may attempt to use other alternatives. Some people use transparent water-based gel or lotions containing water as substitutes. However, it's important to note that these alternatives may not be as effective as specialized conductive gels, leading to poor conduction of radiofrequency waves and potentially affecting the beauty results. Additionally, using untested substitutes may increase the risk of skin discomfort or allergic reactions"},
                      {"title":"How long does delivery take?","text":"Usually 8-15 days"},
                      {"title":"About shipping cost?","text":"We offer free shipping"} ,
                      {"title":"Regarding taxes?","text":"Our prices include taxes"},
                      {"title":"How to process returns and exchanges?","text":"You can contact us for returns and exchanges within 45 days at <b><a href='mailto:after-sales@jendey.com'>after-sales@jendey.com</a></b>"},
                      {"title":"What is your warranty policy?","text":"Within the one-year warranty period, if there is non-human damage, please contact <b><a href='mailto:after-sales@jendey.com'>after-sales@jendey.com</a></b>, and we will confirm with you"}
                    ]
         };
    }

    componentDidMount(){
        this.pageLoad()
    }

    pageLoad=()=>{
        axios.post("/api/page_click",{
            page : "PhoneFaq"
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
                <div style={{backgroundColor:"white",borderBottom:"0.2px gray solid"}} id="head-fixed" className="Phead-fixed" onMouseEnter={this.changeBackwhite} onMouseLeave={this.changeBackOp}>
                    <PhoneHead name="home" headRef={this.headRef} ISO={this.state.ISO} headCurrChange={this.headCurrChange} scrollShow={this.scrollShow}/>
                </div>

                <div className="PFAQ-mobule">
                    <h3>FAQs</h3>
                    <div className="PFAQ-info">
                        {
                            this.state.FAQs.map((value , key)=>{
                                return <div className="PFAQ-text">
                                            <div value={key} onClick={this.showFAQAns} className="PFAQ-title">
                                                <h4>{value.title}</h4>
                                                <div id={"FAQ-show-btn"+key} className="PFAQ-show-btn">+</div>
                                            </div>
                                            <p id={"FAQ-ans"+key} dangerouslySetInnerHTML={{__html:value.text}} ></p>
                                        </div>
                            })
                        }
                    </div>
                </div>

                <div className="Pdetail-nav-mobule">
                    <div><Link rel="noopener noreferrer" rel="noreferrer" target="_blank" to="/"><i>Home</i></Link></div><div>{" › "}</div>
                    <div><Link rel="noopener noreferrer" rel="noreferrer" target="_blank" to="/FAQs"><i>FAQs</i></Link></div><div></div>
                </div>

                <PhoneFooter name="home" onRef={this.onRef} ISO={this.state.ISO} headCurrChange={this.headCurrChange}/>
            </div>
        );
    }
}

export default PhoneFAQs;