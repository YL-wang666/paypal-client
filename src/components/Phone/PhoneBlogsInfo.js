import React,{Component} from "react";
import { Link } from "react-router-dom";
import PhoneHead from "./PhoneHead"
import axios from "axios";
import PhoneFooter from "./PhoneFooter"
import "../../assets/css/phone/phoneBlogs.css"
class PhoneBlogsInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nowPro : {"indent":"pro1","img":"pro1.png","title":"ZH- RF beauty device","func":"Reduce nasolabial lines,Skin firming","sale":209,"delete_sale":259,"off":"0"},
            blogList : [{"id":0,"title":"","text":"","time":"","indent":""}],
            nowBlog : {"id":0,"title":"","text":"","time":"","indent":""},
            
            curr: localStorage.getItem("curr")?localStorage.getItem("curr"):"$",
            currNum : localStorage.getItem("currNum")?localStorage.getItem("currNum"):1,
            ISO : localStorage.getItem("ISO")?localStorage.getItem("ISO"):"USD",
         };
    }

    componentDidMount(){
        if(window.location.search){
            this.getBlogInfo(window.location.search.split("?bn=")[1])
        }
        else{
            this.getBlogInfo("1")
        }
        this.pageLoad()
    }

    pageLoad=()=>{
        axios.post("/api/page_click",{
            page : "PhoneBlogsInfo"
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
        window.location.href = `/detail?pdnum=${e.target.getAttribute("value")}`
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

    //获取当前博客内容
    getBlogInfo=(e)=>{

        axios.post("/api/get_blog",{
            bn : e
        })
        .then((response)=>{
            this.setState({
                nowBlog : response.data
            },
                ()=>{
                    this.getBlogInfoCata()
                    this.getProInfo()
                    document.querySelector('meta[name="description"]').setAttribute("content", response.data.title);
                }  
            )
        })
    }

    getBlogInfoCata=()=>{
        axios.post("/api/get_blog_info_cata")
        .then((response)=>{
            this.setState({
                blogList : response.data
            })
        })
    }

    getProInfo=()=>{
        axios.post("/api/get_blog_pro",{
            indent : this.state.nowBlog.indent
        })
        .then((response)=>{
            this.setState({
                nowPro : response.data
            })
        })
    }

    windowLoad=(e)=>{
        window.location.href = `/blog_info?bn=${e.target.getAttribute("value")}`
    }

    render() {
        return (
            <div>
                <div style={{backgroundColor:"white",borderBottom:"0.2px gray solid"}} id="head-fixed" className="Phead-fixed" >
                    <PhoneHead name="home" headRef={this.headRef} ISO={this.state.ISO} headCurrChange={this.headCurrChange} scrollShow={this.scrollShow}/>
                </div>
                <div className="Pblogs-head-mobule">
                    <div className="Pblogs-head-title">
                        <img className="Pblogs-head-right-img" src={require("../../assets/images/b6.png")} />
                        <h2>BeautyTech Tidbits</h2>
                        <p><i>Spillin' Beauty Secrets !</i></p> 
                    </div> 
                </div>
                <div className="Pblogs-text-mobule">
                    <div className="Pblog_info-info-mobule">
                        <h2>{this.state.nowBlog.title}</h2>
                        <div style={{display:"grid",gridTemplateColumns:"50% 38%",marginBottom:"8%"}}>
                            <div>
                                <Link rel="noopener noreferrer" rel="noreferrer" to="/blogs">
                                    <svg t="1712031321665" class="Pblogs_info-return" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2370" width="28" height="28"><path d="M106.666667 192a21.333333 21.333333 0 1 0 0 42.666667h85.333333a21.333333 21.333333 0 0 0 0-42.666667H106.666667z m0 298.666667a21.333333 21.333333 0 0 0 0 42.666666h85.333333a21.333333 21.333333 0 0 0 0-42.666666H106.666667z m0 298.666666a21.333333 21.333333 0 0 0 0 42.666667h85.333333a21.333333 21.333333 0 0 0 0-42.666667H106.666667zM320 192a21.333333 21.333333 0 0 0 0 42.666667h597.333333a21.333333 21.333333 0 0 0 0-42.666667H320z m0 298.666667a21.333333 21.333333 0 0 0 0 42.666666h597.333333a21.333333 21.333333 0 0 0 0-42.666666H320z m0 298.666666a21.333333 21.333333 0 0 0 0 42.666667h597.333333a21.333333 21.333333 0 0 0 0-42.666667H320z" fill="#3D3D3D" p-id="2371"></path></svg>
                                </Link>
                            </div>
                            <div style={{textAlign:"right",color:"gray"}}><b>{this.state.nowBlog.time}</b></div>
                        </div>
                        <p dangerouslySetInnerHTML={{__html:this.state.nowBlog.text}} />
                    </div>
                    <div className="Pblogs-product-mobule">
                        <div>
                            <div className="Pblog_info-directory-title">Related Article</div>
                            <div className="Pblog_info-directory-mobule">
                                {
                                    this.state.blogList.map((value)=>{
                                        return <h4 value={value.id} onClick={this.windowLoad}>
                                                    {value.title}
                                                </h4>
                                    })
                                }
                            </div>
                        </div>
                        <div style={{marginTop:"10%"}} className="Pblogs-product-info">
                            <div style={this.state.nowPro.off === ""?{display:"none"}:{}} className="Pblogs-product-off-label">${this.state.nowPro.off} OFF</div>
                            <img value={this.state.nowPro.indent} onClick={this.turnDetailPage} style={{width:"180px",height:"202px"}} src={require("../../assets/images/product/" + this.state.nowPro.img)} />
                            <p>{this.state.nowPro.title}</p>
                            <div className="Pblogs-product-func">{this.state.nowPro.func}</div>
                            <div style={{width:"100%",display:"grid",gridTemplateColumns:"50% 50%",marginTop:"10px"}}>
                                <div style={{paddingLeft:"70%"}}><b>{this.state.curr}{(this.state.nowPro.sale*this.state.currNum).toFixed(2)}</b><span>{this.state.curr}{(this.state.nowPro.delete_sale*this.state.currNum).toFixed(2)}</span></div> 
                                
                            </div>
                            <button value={this.state.nowPro.indent} onClick={this.turnDetailPage} onMouseEnter={this.onMouseEnterBtn} onMouseLeave={this.onMouseLeaveBtn}>Learn More</button>
                        </div>
                    </div>

                </div>

                <div className="Pdetail-nav-mobule">
                    <div><Link rel="noopener noreferrer" rel="noreferrer"  to="/"><i>Home</i></Link></div><div>{" › "}</div>
                    <div><Link rel="noopener noreferrer" rel="noreferrer"  to="/blogs"><i>Blogs</i></Link></div><div>{" › "}</div>
                    <div><Link rel="noopener noreferrer" rel="noreferrer" to={"/blog_info?bn="+this.state.nowBlog.id}>{this.state.nowBlog.title}</Link></div>
                </div>

                <PhoneFooter name="blogs" ISO={this.state.ISO} headCurrChange={this.headCurrChange}/>
            
            </div>
        );
    }
}

export default PhoneBlogsInfo;