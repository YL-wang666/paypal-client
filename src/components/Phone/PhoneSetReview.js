import axios from "axios";
import React,{Component} from "react";
import Review from "../Review";
import PhoneFooter from "./PhoneFooter";
import PhoneHead from "./PhoneHead";
import "../../assets/css/phone/phoneSetReview.css"
class PhoneSetReview extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            orderSelect : [{"orderId":"","address_street":"","proInfo":"","address_name":"","country":"","address_state":"","address_city":""}],
            orderId : "",
            selectPro : [],
            orderPro : [{"indent":"load","proth":"1","title":"","sale":0,"sum":0}],
            nowPro : {"indent":"load","proth":"1","title":"title","sale":1,"sum":1},
            reviewScore : "0",
            //图片处理要用
            companyImgBolb : "none",
            hint : "",
            //是否显示产品信息模块
            isShowProMobule : true,
            //显示或隐藏评价模块
            isShowReview : true,

            curr: localStorage.getItem("curr")?localStorage.getItem("curr"):"$",
            currNum : localStorage.getItem("currNum")?localStorage.getItem("currNum"):1,
            ISO : localStorage.getItem("ISO")?localStorage.getItem("ISO"):"USD",
         };
    }

    componentDidMount(){
        if(window.location.search){
            let urlPara = window.location.search.split("?review=")[1];
            let orderId = urlPara.split("detail=")[0];
            //获取这个订单的产品信息
            this.getOrderPro(urlPara.split("detail=")[1])

            let detailArr = urlPara.split("detail=")[1].split(",")
            this.setState({
                orderId : orderId,
                selectPro : detailArr
            })
            document.getElementById("searchUser").value = orderId
            document.getElementById("Psetreview-order-option").innerHTML = orderId

            return
        }
        if(localStorage.getItem("userName")){
            this.getOrder(localStorage.getItem("userName"))
        }
        else{
            this.setState({
                isShowReview : false,
                isShowProMobule : false
            })
        }
        
    }

    //获取订单的产品信息
    getOrderPro=(e)=>{
        let proStr = e + ""
        let proArr = proStr.split(",")
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
                nowPro : cartArr[0]
            })

        })
        .catch(function (error) {
            console.log(error)
        })
    }


    changPro=(e)=>{
        this.setState({
            nowPro : this.state.orderPro[e.target.value]
        })
    }

    //获得评分
    getScore=(e)=>{
        this.setState({
            reviewScore : e.target.value
        })
    }

    //图片显示与处理
    getCompanyImage=(e)=>{
        const that = this;
        let file = e.target.files[0];
        //获取放图片的dom
        const objCImg= document.getElementById("MPCompanyImage");
        //创建流读取input中图片
        const readObj = new FileReader()
        //读取input图片
        readObj.readAsDataURL(file)
        //读取完毕执行函数
        readObj.onload = ()=>{
           
            //创建canvas
            let canvas = document.createElement("canvas")
            //创建一个img
            let img = document.createElement("img")
            //将读取input图片赋值给创建的img
            img.src=readObj.result
            //创建图片参数宽高
            let width 
            let height
            //图片加载完之后执行函数
            img.onload =()=>{
                //如果图片宽小于1000那么久直接用原始图片大小，否则就宽就限制1000
                width = img.width >= 1000?1000:img.width
                //高同理
                height = img.height >= 900?900:img.height
                canvas.width = width
                canvas.height = height
                let ctx = canvas.getContext("2d")
                ctx.drawImage(img ,0,0, width,height)
                let newImgBase64 = canvas.toDataURL("image/jpeg" , 0.9)
                canvas.toBlob(function(blob){
                    that.setState({
                        companyImgBolb : blob
                    })
                },"image/jpeg" , 0.9)
                //如果大于200k就对质量进行压缩
                if(newImgBase64.length > 200*1024){
                    img.src = newImgBase64
                    img.onload = ()=>{
                        canvas.width = img.width
                        canvas.height = img.height
                        let ctx = canvas.getContext("2d")
                        ctx.drawImage(img ,0,0, img.width,img.height)
                        let newSecImgBase64 = canvas.toDataURL("image/jpeg" , 200*1024/newImgBase64.length)
                        canvas.toBlob(function(blob){
                            that.setState({
                                companyImgBolb : blob
                            })
                        },"image/jpeg" , 200*1024/newImgBase64.length)
                        objCImg.innerHTML=`<img alt='Photo of factory' id="factoryImg"  src=${newSecImgBase64} />`;
                        document.getElementById("factoryImg").style.maxWidth="220px";
                        document.getElementById("factoryImg").style.maxHeight="220px";
                    }
                }    
                else{
                    objCImg.innerHTML=`<img alt='Photo of factory' id="factoryImg"  src=${newImgBase64} />`;
                    document.getElementById("factoryImg").style.maxWidth="220px";
                    document.getElementById("factoryImg").style.maxHeight="220px";
                }   
            }
        }

    }

    //提交评价
    submitReview=()=>{
        if(this.state.reviewScore == "0"){
            alert("Please provide a rating !")
            return
        }
        if(document.getElementById("YourName").value.length < 2){
            alert("Please fill in your name !")
            document.getElementById("YourName").focus()
            return
        }
        if(document.getElementById("ReviewContent").value.length < 2){
            alert("Comment content is too short !")
            document.getElementById("ReviewContent").focus()
            return
        }
        if(this.state.nowPro.indent === "load"){
            return
        }
        //检查该订单是否存在评论
        this.getReviewOrder()
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
                this.sendReviewInfo()
            }
            else{
                this.setState({
                    hint : "You have already submitted a review for this order!"
                },
                    ()=>{
                        document.getElementById("SetReviewHint").style.color = "red"
                    }
                )
            }
        })
        .catch((err)=>{
            console.log(err)
       })
    }

    //将评论内容发送后台
    sendReviewInfo=()=>{
        const formData = new FormData();
        formData.append("orderId" ,this.state.orderId)
        formData.append("indent" ,this.state.nowPro.indent)
        formData.append("score" , this.state.reviewScore)
        formData.append("reviewUserName" , document.getElementById("YourName").value)
        formData.append("reviewText" , document.getElementById("ReviewContent").value)
        if(this.state.companyImgBolb !== "none"){
            
            formData.append("image",this.state.companyImgBolb,document.getElementById("reviewImg").files[0].name);
        }
        else{
            formData.append("image" , document.getElementById("reviewImg").files[0])
        }
        axios({
            url :  "/api/insert_review" ,
            method : "post",
            data: formData,
        })
        .then((response)=>{
            if(response.data == "success"){
                this.setState({
                    hint : "Submission successful!"
                },
                    ()=>{
                        document.getElementById("SetReviewHint").style.color = "green"
                    }
                )
            }
            else{
                this.setState({
                    hint : "Submission failed!"
                },
                    ()=>{
                        document.getElementById("SetReviewHint").style.color = "red"
                    }
                )
            }
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
                    orderId : "",
                    isShowReview : false,
                    isShowProMobule : false
                })
                document.getElementById("PSetreview-no-order").innerHTML = "You don't have any orders yet"
                return
            }
            this.setState({
                orderSelect : response.data,
                nowOrder : response.data[0],
                orderId : response.data[0].orderId,
                isShowReview : true,
                isShowProMobule : true
            },
                ()=>{
                    this.getOrderPro(response.data[0].proInfo)
                }
            )
        })
        .catch((err)=>{
            console.log(err)
       })
    }


    //点击选择订单的下拉列表时，切换订单号
    getOrderId=(e)=>{
        this.setState({
            orderId : this.state.orderSelect[e.target.value].orderId,
            nowOrder : this.state.orderSelect[e.target.value],
        },
            ()=>{
                this.getOrderPro(this.state.orderSelect[e.target.value].proInfo)
                this.verifyOrderId()
            }
        )
    }

    //查看此订单是否存在评论,不予上一个验证是否存在重复，上面的是提交是要成，这个是切换订单号时验证
    verifyOrderId=()=>{
        axios.post("/api/review_order",{
            orderId : this.state.orderId
        })
        .then((response)=>{
            if(response.data){
                this.setState({
                    isShowReview : false
                })
                document.getElementById("PSetreview-no-order").innerHTML = "This order already has a review"
            }
            else{
                this.setState({
                    isShowReview : true
                })
                document.getElementById("PSetreview-no-order").innerHTML = "Please log in first or retrieve your order via email or order number."
            }
        })
    }

    render() {
        return (
            <div>
                <div style={{backgroundColor:"white",borderBottom:"0.2px gray solid"}} id="head-fixed" className="Phead-fixed" >
                    <PhoneHead name="home" headRef={this.headRef} ISO={this.state.ISO} headCurrChange={this.headCurrChange} scrollShow={this.scrollShow}/>
                </div>
                <div style={{marginBottom:"35%",marginTop:"35%"}}>
                    <div className="PsetReview-search-mobule">
                        <div className="PreviewSearchMobule">
                            <input id="searchUser" onKeyUp={this.enterSearch} placeholder="Enter email or Order ID" />
                            <button onClick={this.searchOrder}>Search</button>
                        </div>
                        <div className="Preview-select-mobule">
                            <select onChange={this.getOrderId}>
                                <option id="Psetreview-order-option"  value="none" selected hidden>Please select an order</option>
                                {
                                    this.state.orderSelect.map((value , key)=>{
                                        return <option className="PQueryOption" value={key}>
                                                    {value.orderId}
                                                </option>
                                    })
                                }
                            </select>

                            <select className="PSetReviewSelectPro" onChange={this.changPro}>
                                {
                                    this.state.orderPro.map((value , key)=>{
                                        return <option value={key}>  
                                                    <div className="PpayProInfoTitle">{value.title}</div>
                                                </option>
                                    })
                                }
                            </select>
                        </div>
                        
                    </div>

                    <div id="PSetReviewProInfo" className="PSetReviewProInfo" style={this.state.isShowProMobule?{}:{display:"none"}}>
                        <img src={require("../../assets/images/product/detail/"+this.state.nowPro.indent+"/"+"p"+this.state.nowPro.proth+".jpg")} alt=""/>
                        <div className="PsetReviewNowTitle">{this.state.nowPro.title}</div>
                        <div style={{margin:"auto",color:"red"}}><b>${this.state.nowPro.sale}</b></div>
                    </div>

                    <hr />
                    <div id="PSetreview-no-order" style={this.state.isShowReview ? {display : "none"} : {}} className="PSetreview-no-order">
                        Please log in first or retrieve your order via email or order number.
                    </div>
                    <div style={this.state.isShowReview ? {} : {display : "none"}} className="PSetReviewInfoMobule">
                        <div style={{paddingBottom:"4%"}}>
                            <p> To rate the product, please:</p>
                            <div className="PSetReviewRate">
                                <button value="1" onClick={this.getScore}>1</button>
                                <button value="2" onClick={this.getScore}>2</button>
                                <button value="3" onClick={this.getScore}>3</button>
                                <button value="3.5" onClick={this.getScore}>3.5</button>
                                <button value="4" onClick={this.getScore}>4</button>
                                <button value="4.5" onClick={this.getScore}>4.5</button>
                                <button value="5" onClick={this.getScore}>5</button>
                            </div>
                            <div style={{marginLeft:"20%",marginTop:"2%",marginBottom:"5%"}}><Review score = {this.state.reviewScore} /></div>
                        </div>
                        <hr />

                        <div className="PSetReviewContent">
                            <label>Your name :</label><br />
                            <input id="YourName" style={{padding:"3px 10px 3px 10px",fontSize:"16px"}}  maxLength="100" /><br /><br />
                            <label>Review content :</label><br />
                            <textarea id="ReviewContent" style={{padding:"10px",fontSize:"16px"}} maxLength="3000"></textarea><br />

                            <label style={{marginTop: "5%"}}>Picture : (optional)</label>
                            <div style={{marginTop:"2%",marginBottom:"10%"}}>
                                <div>  
                                    <label type="button" className="PMPCompanyBtn">
                                        <span>Select picture</span>
                                        <input id="reviewImg" type="file" accept="image/*" onChange={this.getCompanyImage} />
                                    </label>
                                </div>
                                <div id="MPCompanyImage" style={{marginLeft:"5%"}}>
                                    {/**这里动态插入图片 */}
                                </div>
                            </div>

                            <button className="PSetReview-submit-btn" onClick={this.submitReview}>Submit</button>
                            <br /><div id="SetReviewHint" style={{width:"70%",textAlign:"center"}}>{this.state.hint}</div>

                        </div>
                        
                    </div>

                </div>

                <PhoneFooter name="home" onRef={this.onRef} ISO={this.state.ISO} headCurrChange={this.headCurrChange}/>
            </div>
        );
    }
}

export default PhoneSetReview;