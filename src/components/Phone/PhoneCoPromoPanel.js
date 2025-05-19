import React,{Component} from "react";
import axios from "axios";
import PhoneHead from "./PhoneHead";
import PhoneFooter from "./PhoneFooter";
import "../../assets/css/phone/phoneCopromoPanel.css"
import ProductLinks from "./panelComponents/ProductLinks";
import Funds from "./panelComponents/Funds";
class PhoneCoPromoPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nowAccount : {"user":"","uuid":"","account":"","amount":"","dis_amount":"","su_time":"","up_time":"","status":""},
            //页面参数
            panelPage : "",
            
            curr: localStorage.getItem("curr")?localStorage.getItem("curr"):"$",
            currNum : localStorage.getItem("currNum")?localStorage.getItem("currNum"):1,
            ISO : localStorage.getItem("ISO")?localStorage.getItem("ISO"):"USD",
         };
    }

    componentDidMount(){
        if(!localStorage.getItem("userName")){
            //如果没有登录将出现登录页面
            this.childhead.openLogin()
            return
        }
        this.getNowAccount()
     }
 
    getNowAccount=()=>{
        if(!localStorage.getItem("userName")){
            return
        }
        axios.post("/api/co_account",{
            user : localStorage.getItem("userName")
        })
        .then((response)=>{
            if(!response.data){
                alert("Login exception, please log in again")
            }
            this.setState({
                nowAccount : response.data,
                panelPage : <ProductLinks nowAccountUUID={response.data.uuid} />
            })
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
 
    //切换页面
    changePage=(e)=>{
        if(!localStorage.getItem("userName")){
            //如果没有登录将出现登录页面
            this.childhead.openLogin()
            return
        }
        const pageArr = {"0":<ProductLinks nowAccountUUID={this.state.nowAccount.uuid} />,"1":<Funds nowAccount={this.state.nowAccount} />}
        const pageNum = e.target.getAttribute("value")
        this.setState({
            panelPage : pageArr[pageNum]
        })
    }

    render() {
        return (
            <div>
                <div style={{backgroundColor:"white",borderBottom:"0.2px gray solid"}} id="head-fixed" className="Phead-fixed" >
                    <PhoneHead name="CoPromoPanel" headRef={this.headRef} ISO={this.state.ISO} headCurrChange={this.headCurrChange} getNowAccount={this.getNowAccount}/>
                </div>
                <div className="Ppanel-info-mobule">
                    <div className="Ppanel-left-mobule">
                        <div value="0" onClick={this.changePage}>Generate Link</div>
                        <div value="1" onClick={this.changePage}>Funds</div>
                    </div>
                    
                    <div className="Ppanel-text-mobule">

                        {
                            this.state.panelPage
                        }
                        
                    </div>
                </div>

                <PhoneFooter name="CoPromoPanel" onRef={this.onRef} ISO={this.state.ISO} headCurrChange={this.headCurrChange}/>
            </div>
        );
    }
}

export default PhoneCoPromoPanel;