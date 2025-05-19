import axios from "axios";
import React,{Component} from "react";
import { Link } from "react-router-dom";
import PhoneFooter from "./PhoneFooter";
import "../../assets/css/phone/phoneQuery.css";
import PhoneHead from "./PhoneHead";
class PhoneQuery extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            orderSelect : [{"orderId":"","address_street":"","proInfo":"","address_name":"","country":"","address_state":"","address_city":""}],
            nowOrder : {"orderId":"","address_street":"","proInfo":"","address_name":"","country":"","address_state":"","address_city":""},
            //显示在Order ID 位置，当前订单号
            orderId : "Please select an order.",
            //物流信息
            "events":[{
                "time_iso":"",
                "time_utc":"",
                "address":{"coordinates":{}},
                "description":"",
                "location":"",
                "description_translation":{"description":""}
            }],
            //物流状态json
            latest_status : {
                "sub_status":"Delivered_Other",
                "status":"NotFound"
            },

            orderPro : [{"indent":"load","proth":"1","title":"title","sale":1,"sum":1}],
            orderSum : "A2=1s1",
            //包裹所有可能出现的状态
            deliveryStatus : {"NotFound":"The seller is preparing to ship",
                              "InfoReceived":"The courier company has been notified and is waiting for door-to-door pickup",
                              "InTransit":"In transit, the package is currently in transit",
                              "Expired":"Delayed in transit, the package has been in transit for an extended period without successful delivery.",
                              "AvailableForPickup":"Arrival for pickup, the package has reached the destination delivery point and requires the recipient to pick it up",
                              "OutForDelivery":"delivery in progress",
                              "DeliveryFailure":"Delivery unsuccessful, the package attempted delivery but was not successfully delivered.",
                              "Delivered":"Successful delivery, the package has been successfully received",
                              "Exception":"Package status is not normal"
                            },
            //当前包裹状态
            nowStatus : "",
            //如果没有物流单号或status状态是NotFound,显示卖家正再备货
            isNotFoundStatus : false,
            //当查询的邮箱没有任何订单信息时需要将提示没有订单的模块，隐藏物流信息模块
            isShowDeliveryMobule : true,

            curr: localStorage.getItem("curr")?localStorage.getItem("curr"):"$",
            currNum : localStorage.getItem("currNum")?localStorage.getItem("currNum"):1,
            ISO : localStorage.getItem("ISO")?localStorage.getItem("ISO"):"USD",
         };
    }


    //要调用子组件方法要用ref,没研究原理就这么用
    headRef = (ref) => {
        this.childhead = ref
    }

    //改变货币时改变页面所有货币和金额
    headCurrChange=(curr,currNum,ISO)=>{
        this.setState({
            curr : curr,
            currNum : currNum,
            ISO : ISO
        })
        
    }

    componentDidMount(){
		if(window.location.search){
            let email = window.location.search.split("?search=")[1];
            this.getOrder(email)
        }
		else{
			if(localStorage.getItem("userName")){
				this.getOrder(localStorage.getItem("userName"))
                //将本地存的用户邮箱显示在搜索框里
                document.getElementById("searchUser").value = localStorage.getItem("userName")
			}
			else{
				this.setState({
					isShowDeliveryMobule : false
				})
			}
		}

        //回到顶部
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        
    }

    //点击搜索
    searchOrder=()=>{
        this.getOrder(document.getElementById("searchUser").value)
    }

    //搜索时按下enter
    enterSearch=(e)=>{
        if(e.keyCode === 13){
            this.getOrder(e.target.value);
        }
    }

    //获取当前邮箱的订单号
    getOrder=(e)=>{
        axios.post("/api/order",{
            email : e
        })
        .then((response)=>{
            if(response.data[0] == null){
                this.setState({
                    isShowDeliveryMobule : false,
                    orderSelect : [{"orderId":"","address_street":"","proInfo":"","address_name":"","country":"","address_state":"","address_city":""}],
                    orderId : ""
                })
                return
            }
            this.setState({
                orderSelect : response.data,
                nowOrder : response.data[response.data.length - 1],
                orderSum : response.data[response.data.length - 1].proInfo,
                orderId : response.data[response.data.length - 1].orderId,
                isShowDeliveryMobule : true
            },
                ()=>{
                    this.getDeliveryInfo()
                    this.getOrderPro()
                }
            )
        })
        .catch((err)=>{
            console.log(err)
       })
    }

    //获取当前订单的物流信息
    getDeliveryInfo=()=>{
        axios.post("/api/delivery",{
            orderId : this.state.orderId
        })
        .then((response)=>{
            //如果没有物流单号或者物流单号NotFound就是没发货
            if(response.data.events == null | response.data.latest_status == null){
                this.setState({
                    nowStatus : "The seller is preparing to ship",
                    isNotFoundStatus : true
                })
                //隐藏评论按钮
                document.getElementById("QueryGoReview").style.display = "none"
                return;
                
            }
            //如果latest_status.status = 
            if(response.data.latest_status.status == "NotFound"){
                this.setState({
                    nowStatus : "Temporarily, we have not received information from the logistics provider.",
                    isNotFoundStatus : true
                })
                //隐藏评论按钮
                document.getElementById("QueryGoReview").style.display = "none"
                return;
            }


            this.setState({
                isNotFoundStatus : false,
                events : response.data.events,
                latest_status : response.data.latest_status,
            },
                ()=>{
                    this.setState({
                        nowStatus : this.state.deliveryStatus[response.data.latest_status.status]
                    })
                    //如果快递是成功签收的时候并且没有这个订单的评论时显示评论按钮
                    if(response.data.latest_status.status === "Delivered"){
                        this.getReviewOrder()
                    }
                    else{
                        document.getElementById("QueryGoReview").style.display = "none"
                    }
                    document.getElementById("Pont").style.backgroundColor = "orangered"
                }
            )
        })
        .catch((err)=>{
            console.log(err)
       })
    }

    //查看此订单是否存在评论
    getReviewOrder=()=>{
        axios.post("/api/review_order",{
            orderId : this.state.orderId
        })
        .then((response)=>{
            //返回布尔类型，存在该订单评论 true ,反之 false
            let isExist = response.data
            if(!isExist){
                document.getElementById("QueryGoReview").style.display = "block"
            }
            else{
                document.getElementById("QueryGoReview").style.display = "none"
            }
        })
        .catch((err)=>{
            console.log(err)
       })
    }

    //获取订单的产品信息
    getOrderPro=()=>{
        let cartInfoStr = this.state.orderSum
        let proArr = cartInfoStr.split(",")
        let cartArr = [] 
        let indentArr = []
        for (let i = 0; i < proArr.length; i++) {
            let proJson = {"indent":"","title":"","proth":"","sale":"","sum":""}
            indentArr[i]= proArr[i].split("=")[0]
            proJson.indent = proArr[i].split("=")[0]
            proJson.proth = proArr[i].split("=")[1].split("s")[0]
            proJson.sum = proArr[i].split("s")[1]
            cartArr.push(proJson) 
        }

        axios.post("/api/get_cart_info",{
            indentArr : indentArr
        })
        .then((response)=>{
            let resJosnArr = response.data
            for (let i = 0; i < cartArr.length; i++) {
                for (let j = 0; j < resJosnArr.length; j++) {
                    if(cartArr[i].indent === resJosnArr[j].indent){
                        cartArr[i].title = resJosnArr[j].title
                        cartArr[i].sale = resJosnArr[j].sale
                    }  
                }
            }
            this.setState({
                orderPro : cartArr,
            })

        })
        .catch(function (error) {
            console.log(error)
        })
    }

    //点击选择订单的下拉列表时，切换订单号
    getOrderId=(e)=>{
        this.setState({
            orderId : this.state.orderSelect[e.target.value].orderId,
            nowOrder : this.state.orderSelect[e.target.value],
            orderSum : this.state.orderSelect[e.target.value].proInfo
        },
            ()=>{
                this.getDeliveryInfo()
                this.getOrderPro()
            }
        )
    }

    //跳转到评论页面
    setReview=()=>{
        window.location.href = `/setReview?review=${this.state.orderId}detail=${this.state.orderSum}`
    }

    render() {
        return (
            <div>
                <div id="head-fixed" style={{borderBottom:"0.2px gray solid"}} className="Phead-fixed" ><PhoneHead name="query" headRef={this.headRef} ISO={this.state.ISO} headCurrChange={this.headCurrChange} /></div>
                <div className="PQuerySearchMobule">
                    <input id="searchUser" onKeyUp={this.enterSearch} placeholder="Enter email or Order ID" />
                    <button onClick={this.searchOrder}>Search</button>
                </div>
                <div className="PQueryPageInfoHead">
                    <div>
                        <select className="PQueryPageSelect" onChange={this.getOrderId}>
                            <option  value="none" selected hidden>Please select an order</option>
                            {
                                this.state.orderSelect.map((value , key)=>{
                                    return <option className="PQueryOption" value={key}>
                                                {value.orderId}
                                            </option>
                                })
                            }
                        </select>
                    </div>
                    <img style={{width:"30px",transform:"rotate(90deg)",marginTop:"10px",marginLeft:"20px"}} src={require("../../assets/images/doublePint.png")}/>
                    <div>
                        <p style={{marginLeft:"3%"}}>Order ID : {this.state.orderId}</p>
                    </div>
                </div>

                <div className={this.state.isShowDeliveryMobule?"PQueryPageInfoNothingHidden":"PQueryPageInfoNothing"}>You don't have any orders yet</div>
                <div className={this.state.isShowDeliveryMobule?"PQueryPageInfo":"PQueryPageInfoHidden"}>
                    <div style={{display:"block",width:"95%"}}>
                        <div style={{color:"gray"}}>Shipping Address :</div><br />
                        <div>{this.state.nowOrder.address_street + "," + this.state.nowOrder.address_city + "," + (this.state.nowOrder.address_state.length > 0?this.state.nowOrder.address_state+",":"") + this.state.nowOrder.country}</div>
                        <div style={{width:"95%",minHeight:"14px",backgroundColor:"green",marginTop:"5px"}}></div>
                        <div style={{marginTop:"8px"}}>
                            <div>{this.state.nowStatus}</div>
                        </div>

                        <div className={this.state.isNotFoundStatus?"PQueryPageDeliveryOntFound":"PQueryPageDeliveryOntFoundHidden"}>The seller is preparing to ship</div>
                        <div className={this.state.isNotFoundStatus?"PQueryPageDeliveryHidden":"PQueryPageDelivery"}>
                            {
                                this.state.events.map((value , key)=>{
                                    return <div key={key} className="PQueryDeliveryInfo">
                                                <div id="Pont" className="PQueryDeliveryPint"></div>
                                                <div style={{fontSize:"14px"}}>{value.time_iso}</div>
                                                <div style={{fontSize:"14px"}}>{ value.description_translation.description}</div>
                                            </div>
                                })
                            }
                        </div>
                    </div>

                    <div style={{marginTop:"12%",marginBottom:"20%"}}>
                        <div className="PpayInfoTitle"><h3 style={{textAlign:"center"}}>Order information</h3></div><br />
                        <div style={{backgroundColor:"whitesmoke",paddingTop:"3%"}} className="PpayShowProInfo">
                            {
                                this.state.orderPro.map((value)=>{
                                    return <div className="Ppay-product-mobule">
                                                <img src={require("../../assets/images/product/detail/"+value.indent+"/"+"p"+value.proth+".jpg")} />
                                                <div className="Ppay-product-title-total">
                                                    <div className="PpayProInfoTitle">{value.title}</div>
                                                    <div className="PpayProInfoPrice">
                                                        <div><b>{this.state.curr}{(value.sale*this.state.currNum).toFixed(2)}</b></div>
                                                    </div>
                                                </div>
                                                <div style={{margin:"auto"}}><span style={{fontSize:"14px"}}>Qty :</span> <b>{value.sum}</b></div>
                                            </div>
                                })
                            }
                        </div>
                        <button id="QueryGoReview" className="PQueryGoReview" onClick={this.setReview}>Review</button>
                    </div>
                </div>

                <PhoneFooter ISO={this.state.ISO} headCurrChange={this.headCurrChange}/>

            </div>
        );
    }
}

export default PhoneQuery;