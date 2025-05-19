import React,{Component} from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Head from "./Head";
import Footer from "./Footer"
import "../assets/css/about1.css"
class About extends Component {
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
        //this.pageLoad()
    }

    pageLoad=()=>{
        axios.post("/api/page_click",{
            page : "about"
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

    //跳转时就是该组件销毁时清除掉本组件的监听
    componentWillUnmount(){
        //document.removeEventListener("scroll",this.scrollShow)
    }


    render() {
        return (
            <div style={{backgroundColor:"#F5F8FB"}}>
                <div style={{backgroundColor:"white"}} id="head-fixed" className="head-fixed" onMouseEnter={this.changeBackwhite} onMouseLeave={this.changeBackOp}>
                    <Head name="home" headRef={this.headRef} ISO={this.state.ISO} headCurrChange={this.headCurrChange} scrollShow={this.scrollShow}/>
                </div>
                
                <div className="about1-text-banner-mobule">
                    <h2>Jingdezhen Porcelain Culture</h2>
                    <p className="about1-text-desc-p">As the birthplace of porcelain, Jingdezhen has upheld an unbroken legacy for over a thousand years. Today, its timeless ceramic art has long been deeply woven into everyday life.</p>
                </div>
                <p className="about1-text-mobule">
                    In the southeastern corner of China lies Jingdezhen, a city born from porcelain and revered as the world’s porcelain capital. Its ceramic history dates back nearly 1,900 years to the Eastern Han dynasty. Over centuries of relentless refinement, the city rose to global prominence—especially during the Yuan dynasty, around 700 years ago, when it pioneered the world-renowned blue-and-white porcelain.
                    <br /><br />
                    This iconic style, often called “blue and white ware,” brought together a striking cobalt pigment and pure white porcelain body, firing them at extremely high temperatures. It wasn’t just beautiful—it was revolutionary. Soon, these pieces began to travel the world. By the early 1600s, Jingdezhen porcelain had entered Europe, enchanting royal courts and noble houses. By the late 15th century, its techniques had influenced craftsmen in Japan and the Korean peninsula, shaping new waves of East Asian ceramic art.
                    <br /><br />
                    Yet, paradoxically, even as these regions built their reputations on techniques learned from Jingdezhen, the name itself faded from global awareness. Today, many around the world are familiar with Japanese or European fine china, while few have heard of the original masters behind it.
                    <br /><br />
                    But in Jingdezhen, the legacy has never faded. This is a city where porcelain has been created without interruption for nearly two millennia. Here, craftsmanship is not just a profession—it’s a calling. Artisans continue to mold, carve, glaze, and fire each piece entirely by hand, often over the course of several weeks and dozens of meticulous steps. Even in a world driven by industrial mass production, Jingdezhen holds firm to its traditions.The result? Porcelain so fine, it may cost ten times more than a factory-made plate—but for those who appreciate artistry, it’s worth every cent.
                    <br /><br />
                    In Chinese culture, tea is a philosophy of life—one of mindfulness, refinement, and balance. And the teaware used to serve it must reflect the same values. Delicate yet durable, Jingdezhen teaware is prized for its aesthetic grace and functional harmony. From imperial palaces to the modern middle class, from green tea to afternoon coffee, fine ceramics have always been a symbol of elegant living.
                    <br /><br />
                    Today, tens of thousands of ceramic artists still work in Jingdezhen. Some began as apprentices at age 14 and now throw clay daily in their 80s. Others have preserved family traditions for over 30 years. And a younger generation, represented by creative hubs like Taoxichuan, is bringing fresh perspectives to ancient forms, merging timeless skill with contemporary design.
                    <br /><br />
                    And yet, Jingdezhen remains largely unknown outside of China. While European and Japanese porcelain dominate the global conversation, few know of the origin they once learned from. As one elderly craftsman from Jingdezhen once said:

                    “We don’t know how to promote. We just focus on the craft. We always believed that good work speaks for itself, that its value is visible to anyone who sees it. If you insist on a brand name—then call us: ‘The Jingdezhen Porcelain Artisans.’
                    <br /><br />
                    In a world full of noise, Jingdezhen speaks softly—through beauty, through tradition, and through the hands of its makers.
                
                </p>


                <Footer name="about" ISO={this.state.ISO} headCurrChange={this.headCurrChange}/>

            </div>
        );
    }
}

export default About;