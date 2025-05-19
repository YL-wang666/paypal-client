import React,{Component} from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../assets/css/phone/phonePay.css"
import PhoneLogin from "./publicCom/PhoneLogin";
import PhoneForgetPassword from "./publicCom/PhoneForgetPassword";
import PhoneRegister from "./publicCom/PhoneRegister";
import Shipping from "../payPolicyComponents/Shipping";
import Returned from "../payPolicyComponents/Returned";
import Provacy from "../payPolicyComponents/Provacy";
import ContactInfo from "../payPolicyComponents/ContactInfo";


class PhonePay extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            //用于提交后台结账产品信息字符串
            payProStr : "",
            //要结账的产品信息
            nowPayPro : [{"indent":"load","title":"","sale":"","delete_sale":"","video_img":"load.jpg","video":"load.jpg","img_arr":"load.jpg","functions":"","choose":"load.jpg","sum":0,"proth":"1"}],
            //总金额
            payNumber : 0,
            //商品总数
            proSum : 0,
            //没有优惠的金额
            payDeleteNumber : 0,
            //因为有些产品限时优惠 $50 有些没有,所以要统计有多少个存在优惠$50的产品,好计算一共优惠了多少
            ltoProNum : 0, 
            //选择了优惠劵，没有就是 1 , 20%卷就是 0.8
            saveNum : 1,
            
            //当前点击选择查看的政策
            chooseProvacy: "",
            //控制登录显示的
            login : "",

            discount : [{"saveNum" : 1,"title":"No coupons available"}],
            curr: localStorage.getItem("curr")?localStorage.getItem("curr"):"$",
            currNum : localStorage.getItem("currNum")?localStorage.getItem("currNum"):1,
            ISO : localStorage.getItem("ISO")?localStorage.getItem("ISO"):"USD"
         };
    }

    componentDidMount(){
        if(window.location.search){
            let payNum = window.location.search.split("?payNum=")[1];
            this.getCartInfo(payNum)
            
        }
        //获取折扣
        this.getDiscount()
        
        this.pageLoadAdd()

        //添加监听来变换浮动模块的位置
        document.addEventListener("scroll",this.payInfoScrollShow)
   }

   //加载一次页面传给后端
   pageLoadAdd=()=>{
        axios.post("/api/page_click",{
            page : "PhonePay"
        })
    }

    //获取折扣
    getDiscount=()=>{
        if(!localStorage.getItem("userName")){
            
            return
        }
        axios.post("/api/get_discount",{
            user : localStorage.getItem("userName")
        })
        .then((res)=>{
            if(!res.data){
                this.setState({
                    discount : [{"saveNum" : 1,"title":"No coupons available"}],
                    saveNum : 1
                })
            }
            else{
                
                let dArr = [{"saveNum" : 1,"title":"No coupons available"}]
                let resArr = res.data.split("%")
                for(let i = 0;i < resArr.length - 1;i++){
                    let discount = {"saveNum" : 1,"title":"No coupons available"}
                    discount.saveNum = (1 - resArr[i]/100).toFixed(2)
                    discount.title = "Discount Coupon - Save" + resArr[i] + "%"
                    dArr.push(discount)
                }
                this.setState({
                    discount : dArr
                })
            }
        })
    }

   
   //获取要付款信息,如果产品界面跳转过来的就e的第一字母是b直接去产品信息,如果c就从本地过去信息
   getCartInfo=(e)=>{
        let proArr = []
        if(e === "c"){
            proArr = localStorage.getItem("cart").split(",")
            this.setState({
                payProStr : localStorage.getItem("cart")
            })
        }
        else{
            proArr.push(e.substring(1,e.length))
            this.setState({
                payProStr : e.substring(1,e.length)
            })
        }
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
            //用于计算总金额
            let sum = 0
            //用于计算没有优惠的金额
            let dSum = 0
            //因为有些产品限时优惠 $50 有些没有,所以要统计有多少个存在优惠$50的产品,好计算一共优惠了多少
            let ltoProNum = 0
            //计算一共多少件商品
            let proSum = 0
            for (let i = 0; i < cartArr.length; i++) {
                for (let j = 0; j < resJosnArr.length; j++) {
                    if(cartArr[i].indent === resJosnArr[j].indent){
                        cartArr[i].title = resJosnArr[j].title
                        cartArr[i].sale = resJosnArr[j].sale
                        cartArr[i].delete_sale = resJosnArr[j].delete_sale
                        sum = sum + Number(resJosnArr[j].sale) * Number(cartArr[i].sum)
                        //计算没有限时优惠的金额,delete_sale == 0 是判断是否是存在优惠产品，=0是没有优惠就直接在sale价格
                        dSum = dSum + (Number(resJosnArr[j].delete_sale) === 0 ? Number(resJosnArr[j].sale):Number(resJosnArr[j].delete_sale)) * Number(cartArr[i].sum)
                        ltoProNum = ltoProNum + Number(resJosnArr[j].delete_sale) === 0 ? 0 : 1* Number(cartArr[i].sum)
                        //计算商品总数
                        proSum = proSum + Number(cartArr[i].sum)
                    }  
                }
            }
            this.setState({
                nowPayPro : cartArr,
                payNumber : sum,
                payDeleteNumber : dSum,
                ltoProNum : ltoProNum,
                proSum : proSum
            })

        })
        .catch(function (error) {
            console.log(error)
        })
    }

    changeSaveNum=(e)=>{
        this.setState({
            saveNum : e.target.value
        })
        document.getElementById("pay-coupon").innerText = e.target.getAttribute("title")
    }

    //发起付款
    paymentNow=(e)=>{

        //防止重复提交
        e.target.disabled = true ;
        for (let i = 4; i <= 4&&i >= 0; i--) {
            setTimeout(()=> {
                if(i === 0){
                    e.target.disabled=false;
                }
            }, 1000 * (4 - i)); 
        } 

        axios.post("/api/paypal/create_payment",{
            payMethod : e.currentTarget.getAttribute("value"),
            payProStr : this.state.payProStr,
            saveNum : this.state.saveNum === 1? ("1.00" + ""):(this.state.saveNum + ""),
            user : localStorage.getItem("userName"),
            curr : this.state.ISO,
            cou : localStorage.getItem("cou")
        })
        .then((response)=>{
            localStorage.removeItem("cou")
            window.location.href = `${response.data}`
        })
        .catch(function (error) {
            console.log(error)
        })
        
    }



    isShowAddress=(e)=>{
        if(e.target.value === "close"){
            document.getElementById("payShowAddress").style.display = "none"
        }
        if(e.target.value === "open"){
            document.getElementById("payShowAddress").style.display = "block"
        }
    }

    //改变货币时改变页面所有货币和金额
    currChange=(e)=>{
        let currNumArr={"USD":1,"EUR":0.91,"GBP":0.79}
        let currISOArr={"USD":"$","EUR":"€","GBP":"£"}
        this.setState({
            curr : currISOArr[e.target.value],
            ISO : e.target.value,
            currNum : currNumArr[e.target.value]
        })
        localStorage.setItem("curr",currISOArr[e.target.value])
        localStorage.setItem("ISO",e.target.value)
        localStorage.setItem("currNum",currNumArr[e.target.value])
    }

    //登录需要的方法
    openLogin=()=>{
        //将Login组件添加进来
        this.setState({
            login : <PhoneLogin name="pay" changePage={this.changePage} getDiscount={this.getDiscount} />
        })
        document.getElementById("head-login-mobule").style.display = "block"
    }

    //切换忘记密码和登录页面
    changePage=(e)=>{
        // e 的值 0 表示 登录页面 , 1 表示忘记密码页面
        if(e === 0){
            this.setState({
                login : <PhoneLogin changePage={this.changePage} name="pay"  getDiscount={this.getDiscount}/>
            })
        }
        if(e === 1){
            this.setState({
                login : <PhoneForgetPassword changePage={this.changePage} />
            })
        }
    }

    closeLogin=()=>{
        document.getElementById("head-login-mobule").style.display = "none"
    }

    onRef = (ref) => {
        this.childFooter = ref
    }

    //点击政策显示对应页面
    choosePolicyPage=(e)=>{
        let pArr = {"shipping":<Shipping />,"return":<Returned />,"provacy":<Provacy />,"contact":<ContactInfo />}
        this.setState({
            chooseProvacy : pArr[e.target.getAttribute("value")]
        },
            ()=>{
                document.getElementById("pay-policy-btn-info-mobule").style.display = "block"
            }
        )
        
    }

    //关闭政策页面
    closePolicy=()=>{
        document.getElementById("pay-policy-btn-info-mobule").style.display = "none"
    }

    //悬浮支付信息
    payInfoScrollShow=()=>{
        if(document.getElementById("Ppay-fixed-pay-point").offsetTop - document.documentElement.scrollTop - document.documentElement.clientHeight  <= 0){
            document.getElementById("Ppay-fixed-pay-mobule").style.display = "none"
        }
        else{
            document.getElementById("Ppay-fixed-pay-mobule").style.display = "grid"
        }
    }

    //跳转时就是该组件销毁时清除掉本组件的监听
    componentWillUnmount(){
        document.removeEventListener("scroll",this.payInfoScrollShow)
    }

    render() {
        return (
            <div>
                <div className="Ppay-head">
                    <h1>Jendey</h1>
                    <div className="Ppay-head-right">
                        <div className="headISO">
                            <div><svg t="1706870703165" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="36101" width="25" height="25"><path d="M943.96416 381.253632c-41.424896-139.624448-129.308672-237.740032-263.084032-295.610368-42.56768-18.413568-87.304192-22.956032-132.411392-27.291648h-72.935424c-27.936768 5.89824-56.899584 3.59424-84.660224 11.866112-89.694208 26.724352-165.185536 75.241472-223.797248 148.08064-56.358912 70.037504-91.871232 149.133312-94.939136 240.613376-0.03072 0.227328-0.047104 0.458752-0.069632 0.68608a5.33504 5.33504 0 0 1-2.230272-0.108544v77.492224l1.662976 1.476608 0.647168-0.104448c0.352256 28.035072 3.91168 55.748608 11.405312 82.700288 49.287168 177.268736 220.411904 326.756352 414.691328 319.383552 0.028672 0.74752 0.063488 1.49504 0.08192 2.240512h31.90784c-0.012288-0.759808 0.043008-1.519616 0.07168-2.275328 30.636032 0.428032 61.708288 0.436224 91.088896-7.512064 137.4208-37.179392 237.719552-119.43936 298.856448-249.088 20.723712-43.943936 29.179904-90.191872 33.916928-137.703424v-18.231296-54.697984-13.676544c-5.326848-25.839616-2.656256-52.81792-10.203136-78.239744zM319.660032 127.995904c-44.9024 64.063488-102.078464 115.802112-162.963456 163.831808-2.265088 5.548032-5.691392 9.811968-12.419072 11.06944-1.36192-7.542784 2.809856-12.2368 7.714816-16.605184 39.548928-70.15424 96.362496-121.929728 167.667712-158.296064z m183.894016 135.667712c-0.006144 6.887424-1.099776 13.858816 9.66656 13.852672 11.679744-0.008192 8.574976-8.296448 8.64256-14.32576 0.272384-24.29952 1.155072-48.66048-0.251904-72.880128-0.927744-15.95392 5.04832-19.304448 19.439616-17.876992 27.199488 2.697216 54.192128 6.28736 81.043456 11.481088 10.283008 1.988608 15.028224 7.145472 19.091456 16.361472 15.648768 35.49184 26.896384 72.25344 35.72736 112.775168-18.536448-2.701312-34.11968-4.974592-53.403648-7.788544 12.77952 11.8272 23.023616 22.472704 37.851136 23.769088 15.6672 1.368064 23.023616 8.390656 23.476224 23.670784 0.464896 15.714304 13.756416 24.15616 19.484672 38.066176 5.128192-5.400576 3.055616-9.807872 2.527232-13.668352-5.623808-41.310208-5.687296-41.302016 35.495936-29.046784 4.356096 1.294336 8.74496 2.496512 13.068288 3.883008 77.316096 24.766464 90.359808 44.392448 85.2992 125.984768-0.620544 9.998336-3.672064 12.982272-13.348864 12.781568-25.04704-0.520192-50.128896-0.612352-75.167744 0.120832-6.81984 0.196608-18.608128-5.986304-19.083264 8.331264-0.468992 14.135296 11.04896 9.49248 18.28864 9.623552 25.051136 0.452608 50.132992 0.643072 75.17184-0.043008 10.79296-0.299008 14.456832 2.807808 14.104576 13.963264-0.915456 28.956672-5.904384 57.319424-10.416128 85.784576-1.20832 7.620608-5.95968 11.575296-12.580864 14.70464-33.007616 15.620096-67.647488 26.423296-102.823936 35.81952-10.432512 2.783232-13.819904-0.088064-11.872256-10.876928 2.275328-12.619776 3.524608-25.423872 5.90848-43.311104-13.103104 17.600512-24.59648 29.976576-25.448448 48.4352-0.436224 9.447424-5.111808 16.072704-15.540224 15.63648-17.035264-0.708608-26.683392 11.976704-42.991616 21.372928 15.927296 3.5328 27.179008-0.456704 38.4512-2.463744 9.459712-1.67936 14.22336-0.935936 11.091968 11.15136-9.132032 35.252224-19.636224 69.955584-34.592768 103.23968-3.42016 7.604224-8.235008 11.415552-16.71168 13.172736-28.307456 5.86752-56.887296 8.923136-85.628928 11.464704-12.320768 1.091584-16.068608-2.824192-15.751168-14.848 0.671744-25.8048 0.3072-51.636224 0.11264-77.45536-0.04096-5.603328 1.931264-12.824576-7.868416-13.164544-9.951232-0.339968-10.590208 5.736448-10.530816 13.344768 0.202752 25.059328-0.569344 50.143232 0.333824 75.17184 0.477184 13.287424-2.217984 19.744768-17.260544 17.475584-19.474432-2.936832-39.194624-6.199296-58.773504-5.996544-29.681664 0.311296-43.022336-15.900672-50.3808-41.664512-7.061504-24.727552-15.271936-49.127424-22.984704-73.672704-3.854336-12.263424-4.841472-21.08416 13.324288-15.5648 9.228288 2.803712 19.433472 2.392064 29.68576 3.487744-12.808192-15.91296-32.935936-18.01216-47.351808-27.62752-12.9024-8.61184-10.084352-34.787328-28.225536-45.836288-3.473408 13.955072 5.072896 26.69568 2.49856 42.1888-41.017344-6.539264-79.64672-20.031488-117.438464-36.37248-7.286784-3.151872-8.321024-9.87136-9.721856-16.791552-5.730304-28.32384-8.691712-56.920064-10.702848-85.73952-0.907264-13.006848 3.946496-15.294464 15.249408-15.003648 24.285184 0.632832 48.596992 0.272384 72.89856 0.131072 6.422528-0.032768 14.075904 2.115584 14.446592-8.984576 0.380928-11.388928-7.354368-9.28768-13.797376-9.320448-23.539712-0.126976-47.138816-1.040384-70.6048 0.288768-16.00512 0.905216-19.949568-5.046272-17.772544-19.687424 2.228224-14.977024 4.644864-30.244864 4.05504-45.268992-1.671168-42.62912 21.723136-62.078976 60.069888-70.672384 24.19712-5.423104 47.849472-13.29152 72.245248-20.205568 4.970496 16.35328-5.548032 29.958144-1.302528 45.901824 10.287104-12.642304 22.278144-22.890496 22.401024-40.501248 0.053248-7.43424 5.588992-10.637312 12.171264-10.995712 17.18272-0.937984 28.336128-12.587008 41.322496-21.876736-3.014656-4.552704-6.89152-2.250752-9.875456-1.81248-38.948864 5.732352-38.950912 5.789696-28.491776-31.111168 1.650688-5.828608 3.38944-11.63264 5.20192-17.412096 23.949312-76.392448 47.069184-91.488256 127.686656-85.487616 11.689984 0.8704 11.264 6.47168 11.220992 14.45888-0.145408 25.819136-0.032768 51.64032-0.057344 77.459456z m156.289024 540.647424c14.344192-38.467584 27.619328-75.896832 34.924544-115.003392 1.409024-7.53664 7.553024-9.039872 13.428736-10.31168 37.840896-8.216576 74.38336-20.475904 112.40448-36.624384-24.868864 100.800512-61.792256 137.824256-160.75776 161.939456z m75.640832 4.253696c-38.723584 45.764608-84.59264 80.951296-143.280128 97.00352 20.26496-18.128896 34.215936-40.448 47.628288-63.164416 4.184064-7.088128 7.1168-14.880768 16.623616-17.147904 24.311808-5.808128 47.45216-15.03232 70.248448-25.135104 3.332096-1.480704 6.371328-4.3008 10.184704-0.872448 4.374528 3.928064 0.915456 6.572032-1.404928 9.316352z m107.143168-172.47232c0.83968-3.227648 3.680256-6.8608 6.6048-8.476672 22.460416-12.417024 42.192896-28.647424 66.875392-49.13152-20.015104 63.227904-55.867392 107.264-105.936896 149.583872 13.39392-34.148352 24.766464-62.464 32.456704-91.97568z m-27.795456-358.416384c45.520896 35.393536 79.151104 79.050752 96.507904 135.047168-21.663744-12.910592-40.271872-29.415424-62.324736-40.927232-2.955264-1.542144-5.74464-5.419008-6.559744-8.720384-7.174144-29.02016-18.638848-56.621056-27.623424-85.399552z m3.86048 78.176256c-37.756928-15.509504-75.476992-27.865088-114.208768-36.82304-6.084608-1.406976-8.88832-4.384768-10.020864-10.366976-7.272448-38.344704-20.084736-75.106304-34.224128-112.300032 91.768832 16.519168 144.269312 69.236736 158.45376 159.490048z m38.264832 87.650304c-2.975744-15.433728-4.460544-31.152128-7.028736-49.881088 33.748992 21.137408 61.231104 43.763712 74.903552 79.785984 4.683776 12.3392 2.848768 18.348032-12.10368 17.354752-16.61952-1.103872-36.691968 4.917248-49.092608-2.490368-12.623872-7.548928-3.719168-29.411328-6.678528-44.76928z m-7.061504 161.929216c3.743744-29.612032 9.428992-55.607296 8.40704-82.116608-0.483328-12.650496 5.115904-15.36 16.14848-14.53056 9.76896 0.735232 19.632128 0.14336 29.452288 0.155648 26.884096 0.028672 28.76416 2.7648 16.54784 27.51488-14.91968 30.232576-39.911424 50.3808-70.555648 68.97664zM706.711552 127.901696c85.131264 43.055104 147.451904 108.20608 186.699776 195.434496-67.852288-59.611136-132.612096-122.216448-186.699776-195.434496z m37.015552 75.454464c-15.147008 2.6624-24.588288-10.070016-37.359616-12.691456-40.128512-8.226816-71.512064-27.922432-88.500224-67.018752-4.28032-9.857024-15.796224-15.296512-19.443712-27.127808 45.160448 7.55712 113.219584 57.837568 145.303552 106.838016zM176.61952 367.675392c-27.138048 13.416448-50.80064 31.739904-76.630016 56.24832 22.482944-70.160384 63.903744-119.373824 118.634496-159.188992-11.403264 30.357504-24.190976 59.979776-31.860736 91.408384-1.376256 5.634048-5.279744 9.125888-10.143744 11.532288z m0.090112 21.946368c-2.842624 29.087744-6.07232 57.520128-8.185856 86.038528-0.837632 11.266048-4.343808 16.0768-16.406528 15.159296-14.292992-1.08544-28.839936-1.359872-43.081728 0.018432-18.937856 1.83296-18.202624-9.668608-14.557184-21.014528 6.658048-20.723712 21.05344-36.677632 37.312512-50.444288 13.654016-11.556864 27.498496-23.30624 44.918784-29.75744z m77.795328-147.484672c5.054464-8.534016 13.91616-11.347968 21.813248-15.368192 28.694528-14.624768 58.079232-27.559936 92.465152-35.371008-15.661056 39.471104-28.289024 77.142016-36.364288 116.178944-1.150976 5.554176-4.360192 9.099264-10.5472 10.231808-38.422528 7.041024-75.317248 19.638272-114.731008 34.199552 11.278336-41.066496 27.445248-76.240896 47.364096-109.871104z m-48.275456 404.015104c38.105088 15.951872 73.631744 26.683392 109.989888 34.392064 10.1376 2.148352 15.68768 5.912576 17.768448 16.5888 7.118848 36.51584 19.195904 71.600128 34.832384 110.184448-40.687616-8.411136-79.341568-19.636224-106.653696-44.460032-31.688704-28.801024-41.955328-73.189376-55.937024-116.70528z m8.466432 85.499904c-45.027328-28.289024-80.543744-74.21952-110.96064-143.491072 8.157184-3.903488 11.831296 3.672064 17.606656 6.408192 52.154368 24.723456 78.026752 68.79232 91.691008 122.292224 1.275904 4.999168 5.105664 9.377792 1.662976 14.790656z m160.98304 97.703936c4.732928 0.968704 6.987776 5.30432 9.275392 9.355264 13.443072 23.775232 28.461056 46.424064 47.521792 66.332672-59.496448-18.003968-105.957376-53.06368-142.85824-101.859328 29.325312 7.487488 56.659968 20.166656 86.061056 26.171392z m6.87104-664.743936c-1.261568 2.357248-4.5056 4.415488-7.215104 5.115904-30.425088 7.845888-59.850752 18.819072-94.711808 33.32096 42.995712-51.431424 87.396352-88.932352 146.8416-106.051584-16.089088 22.23104-32.151552 43.804672-44.914688 67.61472zM114.212864 509.0816c17.178624 0.335872 39.548928-7.356416 50.003968 3.416064 9.005056 9.279488 4.478976 31.442944 6.477824 47.843328 1.90464 15.640576 4.509696 31.195136 7.436288 51.052544-34.926592-19.408896-63.676416-40.779776-80.607232-74.369024-10.878976-21.571584-6.4512-28.399616 16.689152-27.942912z m208.023552 362.917888c-75.659264-36.100096-132.376576-92.340224-173.154304-165.392384 68.816896 43.616256 122.806272 102.592512 173.154304 165.392384z m83.286016-33.847296c31.909888 2.736128 60.350464 5.568512 88.854528 7.38304 8.962048 0.571392 9.254912 5.275648 9.218048 11.800576-0.106496 20.31616-0.038912 40.63232-0.038912 62.83264-46.997504-10.307584-72.835072-42.524672-98.033664-82.016256z m116.977664 77.858816c-0.147456-21.188608-7.196672-45.996032 1.472512-62.603264 9.807872-18.80064 38.039552-7.507968 57.759744-12.148736 12.371968-2.90816 25.155584-4.052992 41.684992-6.596608-26.136576 41.87136-52.312064 75.93984-99.74784 85.311488-0.774144-2.553856-1.165312-3.254272-1.169408-3.96288z m195.76832-50.223104l-18.10432 12.0832c0.008192-11.679744 6.987776-14.05952 12.183552-17.719296 26.66496-26.888192 51.924992-54.892544 72.155136-87.164928 3.448832-5.500928 9.263104-9.87136 14.73536-13.697024 34.787328-24.291328 64.731136-53.772288 93.292544-90.128384-7.43424 57.921536-102.187008 162.646016-174.262272 196.626432zM540.147712 83.480576c37.86752 14.993408 60.964864 44.511232 82.368512 80.195584-32.776192-2.82624-62.164992-9.971712-92.243968-9.631744-9.224192 0.104448-8.30464-6.596608-8.308736-12.609536-0.012288-15.081472 0.72704-30.208-0.208896-45.232128-0.974848-15.681536 4.72064-18.13504 18.393088-12.722176z m-55.201792 0.84992c12.511232-5.074944 19.941376-5.984256 18.829312 11.4176-1.153024 18.1248 5.51936 40.196096-2.686976 53.450752-8.192 13.232128-32.262144 3.467264-49.096704 7.112704-13.961216 3.022848-28.383232 3.930112-47.099904 6.35904 21.284864-34.936832 43.61216-63.555584 80.054272-78.340096z" fill="#515151" p-id="36102"></path><path d="M490.551296 290.4064c-1.6384 13.234176-9.535488 12.68736-18.427904 14.798848-20.826112 4.947968-40.138752 13.617152-57.137152 26.894336-53.403648 41.705472-54.007808 111.675392-1.165312 154.085376 17.997824 14.444544 38.414336 24.068096 61.192192 28.499968 7.297024 1.419264 14.813184 1.75104 14.667776 13.023232-0.503808 39.180288-0.19456 78.368768-0.19456 119.240704-25.571328-6.16448-48.826368-16.623616-53.8624-39.75168-6.004736-27.572224-22.511616-22.996992-41.043968-24.428544-21.489664-1.656832-22.628352 7.995392-17.545216 23.996416 14.278656 44.951552 47.597568 68.524032 90.894336 80.707584 11.112448 3.1232 22.30272 2.332672 22.82496 20.711424 0.366592 12.904448 16.166912 4.616192 24.848384 5.875712 5.332992 0.772096 16.228352 4.364288 14.995456-7.008256-1.736704-15.996928 9.25696-16.408576 19.216384-18.675712 27.324416-6.219776 51.163136-18.78016 70.475776-39.163904 36.07552-38.088704 36.184064-90.60352 0.712704-129.191936-19.111936-20.791296-42.676224-35.139584-70.111232-39.29088-18.83136-2.848768-20.6848-11.812864-20.043776-27.123712 0.956416-22.738944-0.391168-45.568 0.503808-68.31104 0.487424-12.253184-6.428672-31.88736 3.936256-35.201024 14.680064-4.68992 29.231104 8.648704 40.736768 20.144128 7.675904 7.671808 13.459456 16.596992 15.31904 27.363328 1.531904 8.892416 5.328896 12.660736 14.979072 11.982848 13.508608-0.948224 27.127808-0.237568 40.812544-0.237568-3.756032-52.809728-40.615936-91.12576-99.551232-104.595456-8.187904-1.871872-15.280128-1.562624-17.307648-13.441024-1.603584-9.394176-38.596608-9.992192-39.725056-0.903168z m-1.990656 180.434944c-35.723264-6.71744-58.984448-30.5152-59.26912-60.536832-0.284672-30.324736 22.76352-54.544384 59.26912-61.472768v122.0096z m57.516032 54.089728c26.976256 9.304064 47.80032 35.715072 47.06304 60.448768-0.74752 25.083904-22.544384 50.276352-49.328128 58.824704-10.795008 3.448832-13.191168 0.303104-12.883968-9.859072 0.503808-16.584704 0.135168-33.200128 0.135168-49.799168s0.512-33.224704-0.16384-49.795072c-0.526336-13.047808 5.257216-13.242368 15.177728-9.82016z" fill="#515151" p-id="36103"></path></svg></div>
                            <select id="headISOSelect" onChange={this.currChange} value={this.state.ISO}>
                                <option value="USD">USD&nbsp;($)</option>
                                <option value="EUR">EUR&nbsp;(€)</option>
                                <option value="GBP">GBP&nbsp;(£)</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="Ppay-order-mobule">
                    <div className="Ppay-right-payment-mobule">
                        <div className="Ppay-payment-paypal-btn-mobule">
                            <h4>Express checkout</h4>
                            <div className="Ppay-paypal-btn" value="paypal" onClick={this.paymentNow}>
                                <img src={require("../../assets/images/Paypal.png")}/>
                            </div>
                            <div className="Ppay-payment-divider"><div></div><p>OR</p><div></div></div>
                            <div className="Ppay-credit-btn" value="card" onClick={this.paymentNow}>
                                <img src={require("../../assets/images/card.png")}/>
                                <div>Credit or Debit Card</div>
                            </div>
                            
                            <div className="Ppay-card-secure-hint-mobule">
                                <div><svg t="1710765199511" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5681" width="26" height="26"><path d="M337.541565 985.043478l-5.965913-0.089043A205.913043 205.913043 0 0 1 131.628522 779.130435V512c0-104.292174 77.512348-190.464 178.086956-204.04313V244.869565a205.913043 205.913043 0 0 1 205.913044-205.913043l5.965913 0.089043A205.913043 205.913043 0 0 1 721.541565 244.869565v63.087305c100.574609 13.57913 178.086957 99.773217 178.086957 204.04313v267.130435l-0.089044 5.965913a205.913043 205.913043 0 0 1-205.824 199.94713h-356.173913z m356.173913-623.304348h-356.173913l-5.275826 0.089044A150.26087 150.26087 0 0 0 187.280696 512v267.130435a150.26087 150.26087 0 0 0 150.260869 150.260869h356.173913a150.26087 150.26087 0 0 0 150.26087-150.260869V512a150.26087 150.26087 0 0 0-150.26087-150.26087z m-178.086956 211.478261c15.36 0 27.826087 12.466087 27.826087 27.826087v89.043479l-0.155826 2.849391A27.826087 27.826087 0 0 1 487.802435 690.086957v-89.043479l0.133565-2.849391a27.826087 27.826087 0 0 1 27.692522-24.976696z m0-478.608695l-5.275826 0.089043A150.26087 150.26087 0 0 0 365.367652 244.869565v61.217392h300.521739V244.869565a150.26087 150.26087 0 0 0-150.260869-150.260869z" p-id="5682" fill="#515151"></path></svg></div>
                                <p>Credit card and debit card payments are processed within PayPal, so you don't need to worry about security issues.</p>
                            </div>
                            <div className="Ppay-card-icon-mobule">
                                <img src={require("../../assets/images/card1.png")}/>
                                <img src={require("../../assets/images/card2.png")}/>
                                <img src={require("../../assets/images/card3.png")}/>
                                <img src={require("../../assets/images/card4.png")}/>
                                <img src={require("../../assets/images/card5.png")}/>
                                <img src={require("../../assets/images/card7.png")}/>
                            </div>

                        </div>

                        <div className="Ppay-shipping-address-mobule">
                            <h3>Shipping Address</h3> 
                            <p>We will obtain your shipping address from your PayPal account or credit card information.</p>
                        </div>

                        <div className="Ppay-policy-mobule">
                            <ul>
                                <li value = "return" onClick={this.choosePolicyPage}>Return and Refund Policy</li>
                                <li value = "provacy" onClick={this.choosePolicyPage}>Privacy Policy</li>
                                <li value = "shipping" onClick={this.choosePolicyPage}>Shipping Policy</li>
                                <li value = "contact" onClick={this.choosePolicyPage}>Contact Information</li>
                            </ul>
                        </div>

                    </div>

                    {/**悬浮支付信息 */}
                    <div id="Ppay-fixed-pay-mobule" className="Ppay-fixed-pay-mobule">
                        <img src={require("../../assets/images/product/detail/"+this.state.nowPayPro[0].indent+"/"+"p"+this.state.nowPayPro[0].proth+".jpg")} />
                        <p><span style={{color:"gray"}}>Total Items</span>&nbsp;  <b>{this.state.proSum}</b></p>
                        <div className="Ppay-fixed-pay-total">{this.state.curr}{((this.state.payNumber - Number(this.state.payDeleteNumber*(1 - this.state.saveNum)))*this.state.currNum).toFixed(2)}</div>
                    </div>

                    <div id="Ppay-fixed-pay-point"></div>

                    <div className="Ppay-order-info">
                        {
                            this.state.nowPayPro.map((value)=>{
                                return <div className="Ppay-product-mobule">
                                            <img src={require("../../assets/images/product/detail/"+value.indent+"/"+"p"+value.proth+".jpg")} />
                                            <div className="Ppay-product-title-total">
                                                <div className="PpayProInfoTitle">{value.title}</div>
                                                <div className="PpayProInfoPrice">
                                                    <div><b>{this.state.curr}{(value.sale*this.state.currNum).toFixed(2)}</b></div>
                                                    <div><span style={value.delete_sale  === "0"?{display:"none"}:{}}>{this.state.curr}{(value.delete_sale*this.state.currNum).toFixed(2)}</span></div>
                                                </div>
                                            </div>
                                            <div style={{margin:"auto"}}><span style={{fontSize:"14px"}}>Qty:</span> <b>{value.sum}</b></div>
                                        </div>
                            })
                        }

                        <div style={{width:"90%",marginLeft:"5%",height:"0.5px",backgroundColor:"rgb(182, 182, 182)",marginTop:"2%"}}></div>
                        
                        <div className="Ppay-discount-mobule">
                            <div>
                                <svg t="1710687655098" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2373" width="20" height="20"><path d="M188.525714 478.153143l284.470857 284.452571L795.611429 440.009143a18.285714 18.285714 0 0 0 5.357714-12.891429l0.585143-259.181714a18.304 18.304 0 0 0-18.322286-18.322286l-259.181714 0.585143a18.285714 18.285714 0 0 0-12.891429 5.357714L188.544 478.153143zM149.76 516.937143l-25.874286 25.874286a18.285714 18.285714 0 0 0 0 25.856L382.482286 827.245714a18.285714 18.285714 0 0 0 25.874285 0l25.856-25.856L149.76 516.937143zM850.468571 138.971429l24.009143 1.28c40.448 2.139429 72.978286 35.766857 73.728 76.251428l4.534857 245.540572a88.722286 88.722286 0 0 1-25.801142 64.548571L541.750857 911.817143c-23.149714 23.149714-60.818286 22.308571-84.150857-1.042286l-30.482286-30.482286a73.179429 73.179429 0 0 1-83.419428-14.226285L85.101714 607.451429a73.142857 73.142857 0 0 1 0-103.442286L472.356571 116.772571a73.142857 73.142857 0 0 1 51.565715-21.430857l259.163428-0.585143a73.161143 73.161143 0 0 1 67.364572 44.233143z m5.851429 55.259428l-0.512 233.014857a73.142857 73.142857 0 0 1-21.412571 51.565715L468.809143 844.379429l27.574857 27.593142c2.304 2.285714 5.248 2.358857 6.582857 1.024L888.137143 487.808c6.381714-6.4 9.910857-15.232 9.728-24.758857l-4.516572-245.540572a23.424 23.424 0 0 0-21.778285-22.473142l-15.250286-0.804572z m-266.953143 167.552a36.571429 36.571429 0 1 0 51.730286-51.712 36.571429 36.571429 0 0 0-51.730286 51.712z m-38.784 38.784a91.428571 91.428571 0 1 1 129.28-129.28 91.428571 91.428571 0 0 1-129.28 129.28z" fill="#515151" p-id="2374"></path></svg>
                                &nbsp;<span style={{fontWeight:"300"}}>Coupon</span> 
                            </div>
                            <select onChange={this.changeSaveNum} onClick={this.getDiscount}>
                                {
                                    this.state.discount.map((value)=>{
                                        return <option  value={value.saveNum} title={value.title}>
                                                    {value.title}
                                                </option>
                                    })
                                }
                            </select>
                            <div className="Ppay-login"><span onClick={this.openLogin}>Log in</span></div>
                            <div className="Ppay-login-hint"><span>Login to view coupons</span></div>

                        </div>

                        <div className="Ppay-payment-info-mobule">
                                <div className="Ppay-payment-label">Subtotal</div>
                                <div style={{fontSize:"14px",marginTop:"3%",fontWeight:"500"}}>
                                    {this.state.curr}{(this.state.payDeleteNumber*this.state.currNum).toFixed(2)}
                                </div>
                                <div style={{marginTop:"8%"}} className="Ppay-payment-label">Order discount</div><div></div>
                                <div style={{fontSize:"14px",color:"gray",paddingLeft:"18%",marginTop:"5%"}} className="Ppay-payment-label">Limited-time offer</div>
                                <div style={{color:"gray",fontSize:"14px",marginTop:"10%"}}>- {this.state.curr}{(50*this.state.currNum).toFixed(2)}{"*" + this.state.ltoProNum}</div>
                                <div style={{fontSize:"14px",color:"gray",paddingLeft:"18%",marginTop:"5%"}} className="Ppay-payment-label">Coupon</div>
                                <div id="pay-coupon" style={{color:"gray",fontSize:"14px",marginTop:"10%"}}>No coupons available</div>
                                <div style={{fontSize:"14px",paddingLeft:"18%",marginTop:"5%"}} className="Ppay-payment-label">Total savings</div>
                                <div style={{fontSize:"14px",marginTop:"10%"}}>- {this.state.curr}{(Number(50*this.state.currNum)*this.state.ltoProNum + Number(this.state.payDeleteNumber*(1 - this.state.saveNum))).toFixed(2)}</div>
                                <div style={{marginTop:"8%"}} className="Ppay-payment-label">Shipping fee</div>
                                <div style={{fontSize:"14px",marginTop:"17%",fontWeight:"500",color:"gray"}}>free shipping</div>
                                <div style={{marginTop:"8%"}} className="Ppay-payment-label">Tax fee</div>
                                <div style={{fontSize:"14px",marginTop:"17%",fontWeight:"500"}}>0</div>
                                <div className="Ppay-payment-total-label">Total</div>
                                <div className="Ppay-payment-total"> {this.state.curr}{((this.state.payNumber - Number(this.state.payDeleteNumber*(1 - this.state.saveNum)))*this.state.currNum).toFixed(2)}</div>
                        </div>

                    </div>
                </div>

                <div id="head-login-mobule" className="Phead-login-mobule">
                    <button onClick={this.closeLogin} className="Phead-login-close-btn">×</button>
                    {
                        this.state.login
                    }
                </div>

                <div id="footer-sign-mobule" className="Pfooter-sign-mobule">
                    <button onClick={this.isFooterCloseSign} className="Pfooter-sign-close-btn">×</button>
                    <PhoneRegister onRef={this.onRef} getDiscount={this.getDiscount}/>
                </div>

                <div id="pay-policy-btn-info-mobule" className="Ppay-policy-btn-info-mobule">
                    <button onClick={this.closePolicy}>✖</button>
                    <div className="Ppay-policy-btn-info">
                        {
                            this.state.chooseProvacy
                        }
                    </div>
                </div>

            </div>
        );
    }
}

export default PhonePay;