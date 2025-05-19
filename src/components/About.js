import React,{Component} from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Head from "./Head";
import Footer from "./Footer"
import "../assets/css/about.css"
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
            <div style={{backgroundColor:"#F5F8FB"}}>
                <div style={{backgroundColor:"white"}} id="head-fixed" className="head-fixed" onMouseEnter={this.changeBackwhite} onMouseLeave={this.changeBackOp}>
                    <Head name="home" headRef={this.headRef} ISO={this.state.ISO} headCurrChange={this.headCurrChange} scrollShow={this.scrollShow}/>
                </div>
                
                <div className="about-text-banner-mobule">
                    <h2>Our Story</h2>
                    <p className="about-text-desc-p">We aim to share China's ancient porcelain culture with the world — just as our name, Porcelain East (PorcEast), reflects</p>
                </div>
                <p className="about-text-mobule">
                    At PorcEast, we are devoted collectors and lovers of fine porcelain — especially the timeless beauty of Jingdezhen. Known as the “Porcelain Capital of China,” Jingdezhen has cultivated over a thousand years of master craftsmanship, producing some of the most exquisite ceramics in human history.
                    <br /><br />
                    Yet in the eyes of the world, this ancient city remains hidden in the shadows. While Europe and Japan — once students of Chinese porcelain — have positioned themselves as leaders in the fine porcelain market, the original birthplace of porcelain excellence is often overlooked.
                    <br /><br />
                    We believe that Jingdezhen’s finest craftsmanship and artistic spirit deserve global recognition. That’s why we founded PorcEast: to bring the true essence of Chinese porcelain to the world — elegant, enduring, and deeply rooted in cultural heritage. Each of our pieces is handcrafted by seasoned artisans, reflecting not only technical perfection, but also the soul of a thousand-year-old legacy.
                    <br /><br />
                    Welcome to PorcEast — where tradition meets refinement, and porcelain becomes art.
                </p>


                <Footer name="about" ISO={this.state.ISO} headCurrChange={this.headCurrChange}/>

            </div>
        );
    }
}

export default About;