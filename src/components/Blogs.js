import React,{Component} from "react";
import { Link } from "react-router-dom";
import Head from "./Head"
import axios from "axios";
import Footer from "./Footer"
import Page from "./publicCom/Page";
import "../assets/css/blogs.css"
class Blogs extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            productArr : [{"indent":"pro1","img":"p1.png","title":"ZH- RF beauty device","func":"Reduce nasolabial lines,Skin firming","sale":209,"delete_sale":259},
                            {"indent":"pro2","img":"p2.png","title":"ZM- RF beauty device","func":"Reduce nasolabial lines,Skin rejuvenation","sale":189,"delete_sale":239}
                        ],
            blogList : [{"id":0,"title":"","text":"","time":"","indent":""}],
            pageSum : 1,
            curr: localStorage.getItem("curr")?localStorage.getItem("curr"):"$",
            currNum : localStorage.getItem("currNum")?localStorage.getItem("currNum"):1,
            ISO : localStorage.getItem("ISO")?localStorage.getItem("ISO"):"USD",
            description : "Jendey Blogs: The Secret to Skincare, Firming Facial Muscles, and Fighting Aging"
         };
    }

    componentDidMount(){
        document.querySelector('meta[name="description"]').setAttribute("content", this.state.description);
        //获取博客列表
        this.getBlogsList()
        this.pageLoad()
    }

    pageLoad=()=>{
        axios.post("/api/page_click",{
            page : "blogs"
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

    //点击产品跳转详情页面
    turnDetailPage=(e)=>{
        window.location.href = `/detail?pdnum=pro${e.target.getAttribute("value")}`
    }

    //learn more改变按钮样式
    onMouseEnterBtn=(e)=>{
        for(let i = 1 ; i <= 100 ; i++){
            setTimeout(()=>{
                e.target.style.backgroundImage = `linear-gradient(90deg, #d10483 0, #d10483 ${i}%, black 0, black 100%)`
            },i*3)
            
        }
    }

    onMouseLeaveBtn=(e)=>{
        for(let i = 0 ; i <= 100 ; i++){
            setTimeout(()=>{
                e.target.style.backgroundImage = `linear-gradient(-90deg, black 0, black ${i}%, #d10483 0, #d10483 100%)`
            },i*3)
            
        }
    }

    //获得blogs标题
    getBlogsList=(e)=>{
        let pageNum = e?e:1
        axios.post("/api/get_blog_list",{
            pageNum : pageNum,
            pageSum : 10
        })
        .then((response)=>{
            this.setState({
                blogList : response.data
            })
            this.changePage(Math.ceil(response.data[0].blogs_sum / 10) )
        })
    }

    //总页数传给分页组件
    changePage = (countPage) => {
        this.child.getCountPage(countPage)
    }
    //点击页码后传回父组件
    getPageInfo=(pageNum)=>{
        //根据页码获取相应的信息
        this.getBlogsList(pageNum)
    }

    onRef = (ref) => {
        this.child = ref
    }

    render() {
        return (
            <div>
                <div style={{backgroundColor:"white",borderBottom:"0.2px gray solid"}} id="head-fixed" className="head-fixed" >
                    <Head name="home" headRef={this.headRef} ISO={this.state.ISO} headCurrChange={this.headCurrChange} scrollShow={this.scrollShow}/>
                </div>
                <div className="blogs-head-mobule">
                    <div className="blogs-head-title">
                        <h2>BeautyTech Tidbits</h2>
                        <p><i>Spillin' Beauty Secrets !</i></p>
                    </div>
                    <img className="blogs-head-right-img" src={require("../assets/images/b6.png")} />
                </div>
                <div className="blogs-text-mobule">
                    <div className="blogs-info-mobule">
                        <h2>Table Of Contents</h2>
                        {
                            this.state.blogList.map((value , key)=>{
                                return <Link  to={"/blog_info?bn="+value.id}>
                                            <h3 value={key}>{value.title}</h3>
                                        </Link>
                            })
                        }
                    </div>
                    <div className="blogs-product-mobule">
                        {
                            this.state.productArr.map((value , key)=>{
                                return  <div style={{marginTop:"6%"}} className="blogs-product-info">
                                            <div className="blogs-product-off-label">$50 OFF</div>
                                            <img value={key + 1} onClick={this.turnDetailPage} style={{width:"180px",height:"202px"}} src={require("../assets/images/" + value.img)} />
                                            <p>{value.title}</p>
                                            <div className="blogs-product-func">{value.func}</div>
                                            <div style={{width:"100%",display:"grid",gridTemplateColumns:"50% 50%",marginTop:"10px"}}>
                                                <div style={{paddingLeft:"70%"}}><b>{this.state.curr}{(value.sale*this.state.currNum).toFixed(2)}</b><span>{this.state.curr}{(value.delete_sale*this.state.currNum).toFixed(2)}</span></div> 
                                                
                                            </div>
                                            <button value={key + 1} onClick={this.turnDetailPage} onMouseEnter={this.onMouseEnterBtn} onMouseLeave={this.onMouseLeaveBtn}>Learn More</button>
                                        </div>
                            })
                        }
                    </div>

                </div>
                <div style={{marginTop:"3%",width:"60%",marginLeft:"5%"}}>
                    <Page  onRef={this.onRef} getPageInfo={this.getPageInfo} />
                </div>

                <Footer name="blogs" ISO={this.state.ISO} headCurrChange={this.headCurrChange}/>
            
            </div>
        );
    }
}

export default Blogs;