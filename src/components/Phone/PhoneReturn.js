import React , {Component} from "react"
import { Link } from "react-router-dom";
import axios from "axios";
import PhoneHead from "./PhoneHead";
import PhoneFooter from "./PhoneFooter";
import "../../assets/css/phone/phoneReturn.css";
class PhoneReturn extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            curr: localStorage.getItem("curr")?localStorage.getItem("curr"):"$",
            currNum : localStorage.getItem("currNum")?localStorage.getItem("currNum"):1,
            ISO : localStorage.getItem("ISO")?localStorage.getItem("ISO"):"USD",
            description : "Jendey : Return and Refund Policy"
         };
    }

    componentDidMount(){
        document.querySelector('meta[name="description"]').setAttribute("content", this.state.description);
        document.addEventListener("scroll",this.returnScrollShow)

        this.pageLoad()
    }

    pageLoad=()=>{
        axios.post("/api/page_click",{
            page : "PhoneReturnPolicy"
        })
    }

    returnScrollShow=()=>{
        if( document.getElementById("dynamicEffect-start").offsetTop - document.documentElement.scrollTop - document.documentElement.clientHeight  < 0){
            this.dynamicEffect()
            document.removeEventListener("scroll",this.returnScrollShow)
        }
    }

    dynamicEffect=()=>{
        for(let i = 1 ; i <= 100 ; i = i+ 0.5){
            setTimeout(()=>{
                document.getElementById("return-dynamicEffect-1").style.marginLeft = `${100 - i}%`
                document.getElementById("return-dynamicEffect-2").style.marginLeft = `${100 - i}%`
            },i*8)
            
        }
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
        document.removeEventListener("scroll",this.returnScrollShow)
    }

    render() {
        return (
            <div>
                <div style={{backgroundColor:"white",borderBottom:"0.2px gray solid"}} id="head-fixed" className="Phead-fixed" >
                    <PhoneHead name="home" headRef={this.headRef} ISO={this.state.ISO} headCurrChange={this.headCurrChange} scrollShow={this.scrollShow}/>
                </div>

                <div  className="Pshipping-head-mobule">
                    <img style={{width:"100%"}} src={require("../../assets/images/phoneImg/return2.jpg")} alt="Return and Refund Policy"/>
                    <div className="Pshipping-head-title-mobule">
                        <div className="Pshipping-move">
                            <div><svg t="1711595016559" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2399" width="68" height="68"><path d="M985.3 931H58.1V377.7L259.3 78.2h513.4l212.6 299.7V931zM98.1 891h847.2V390.7L752 118.2H280.6L98.1 389.9V891z" p-id="2400" fill="#ffffff"></path><path d="M77.3 363.8h872.3v40H77.3z" p-id="2401" fill="#ffffff"></path><path d="M493.16 378.971l0.666-280.8 40 0.095-0.665 280.8z" p-id="2402" fill="#ffffff"></path><path d="M648 789H439.9v-40H648c41.9 0 75.9-34.1 75.9-75.9s-34.1-75.9-75.9-75.9H330.6v-40H648c63.9 0 115.9 52 115.9 115.9S711.9 789 648 789z" p-id="2403" fill="#ffffff"></path><path d="M380.2 664.9l-100.7-86.3 95.2-99.4 28.9 27.6-66 68.9 68.7 58.8z" p-id="2404" fill="#ffffff"></path></svg></div>
                            <h1>Return and Refund Policy</h1>
                        </div>
                    </div>
                </div>
                <div className="Preturn-mobule-2">
                    <div className="Preturn-mobule-2-title">
                        <div style={{width:"100%",marginLeft:"100%"}} id="return-dynamicEffect-1">
                            <svg t="1711598028415" class="icon" viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3600" width="148" height="148"><path d="M14.585498 526.5408c8.0896 0 14.5408-6.5536 14.5408-14.5408 0-28.0576 2.56-56.2176 7.5776-83.6608 40.2432-217.9072 230.7072-376.0128 453.12-376.0128 136.704 0 265.5232 60.1088 353.3824 164.7616 5.12 6.144 14.336 6.9632 20.48 1.8432 6.144-5.12 6.9632-14.336 1.8432-20.48-93.4912-111.3088-230.4-175.2064-375.7056-175.2064-236.4416 0-438.9888 168.1408-481.6896 399.872A494.80192 494.80192 0 0 0 0.044698 512a14.592 14.592 0 0 0 14.5408 14.5408z m896.8192-293.0688a14.63296 14.63296 0 0 0-18.7392-8.4992l-152.6784 56.9344c2.6624-5.0176 2.2528-11.4688-1.7408-16.0768a323.6864 323.6864 0 0 0-248.5248-115.9168c-156.3648 0-290.4064 111.2064-318.6688 264.4992-3.584 19.2512-5.3248 39.0144-5.3248 58.7776a14.592 14.592 0 0 0 14.5408 14.5408c8.0896 0 14.5408-6.5536 14.5408-14.5408 0-18.0224 1.6384-36.0448 4.9152-53.5552 25.7024-139.4688 147.6608-240.7424 289.9968-240.7424 87.552 0 169.984 38.4 226.2016 105.472 1.6384 1.9456 3.6864 3.3792 5.9392 4.1984L9.465498 554.3936a14.42816 14.42816 0 0 0-8.4992 18.7392c2.1504 5.8368 7.7824 9.4208 13.6192 9.4208 1.7408 0 3.3792-0.3072 5.12-0.9216l883.2-329.4208c7.4752-2.8672 11.3664-11.1616 8.4992-18.7392z m111.7184 234.7008c-2.7648-7.4752-11.264-11.264-18.7392-8.4992l-883.2 329.3184a14.42816 14.42816 0 0 0-8.4992 18.7392c0.3072 0.8192 0.7168 1.6384 1.1264 2.3552-3.072 5.12-2.7648 11.8784 1.4336 16.7936 93.3888 110.4896 229.888 173.8752 374.5792 173.8752 270.0288 0 489.7792-219.2384 489.7792-488.7552 0-4.096-1.7408-7.7824-4.4032-10.4448l39.5264-14.7456c7.3728-2.7648 11.1616-11.1616 8.3968-18.6368z m-219.4432 97.3824c-7.68 155.4432-136.9088 279.552-294.5024 279.552a294.5536 294.5536 0 0 1-212.5824-90.4192l507.0848-189.1328z m146.7392-53.5552c0 253.44-206.6432 459.6736-460.5952 459.6736-134.144 0-260.8128-57.9584-348.4672-159.1296l125.8496-46.8992a323.79392 323.79392 0 0 0 242.0736 108.4416c177.3568 0 321.9456-143.0528 323.9936-319.5904l117.248-43.7248c-0.1024 0.4096-0.1024 0.8192-0.1024 1.2288zM168.047258 704.05632l-49.05984-130.688 57.94304-21.75488c11.64288-4.37248 20.94592-6.51776 27.88864-6.44608 6.9376 0.07168 13.3376 2.39616 19.19488 6.97856 5.8624 4.58752 10.13248 10.4704 12.83584 17.65888 3.4816 9.27744 3.41504 18.21184-0.19968 26.82368-3.61984 8.61184-11.37152 16.13824-23.26528 22.56384 5.4016 0.47616 9.69728 1.34656 12.8768 2.59584 6.78912 2.73408 13.75232 6.72768 20.87424 11.99104l36.08576 27.03872-21.74976 8.1664-27.50464-20.70016c-7.99744-5.94432-14.4128-10.38848-19.24096-13.32224-4.83328-2.92864-8.85248-4.74624-12.06272-5.44256a27.68896 27.68896 0 0 0-9.1904-0.51712c-2.11968 0.32256-5.40672 1.31584-9.86624 2.99008l-20.05504 7.53152 21.7856 58.0352-17.29024 6.49728z m-10.11712-79.50336l37.17632-13.95712c7.90528-2.9696 13.77792-6.10304 17.61792-9.4208 3.84512-3.3024 6.25152-7.18848 7.2192-11.65824a22.6304 22.6304 0 0 0-0.92672-13.02528c-2.31936-6.17984-6.47168-10.41408-12.45184-12.71296-5.98016-2.29376-13.81888-1.62304-23.5008 2.01216l-41.36448 15.52896 16.2304 43.23328zM343.637658 603.35104l17.35168-4.16768c1.01888 10.66496-0.9984 19.99872-6.0672 28.01152-5.06368 8.00256-13.09184 14.06976-24.08448 18.19648-13.8496 5.20192-26.42944 5.05344-37.74464-0.43008-11.31008-5.4784-19.86048-15.91808-25.63584-31.3088-5.98016-15.9232-6.51776-29.824-1.61792-41.70752 4.89984-11.86816 13.88544-20.26496 26.96192-25.17504 12.66176-4.75136 24.61696-4.32128 35.87584 1.28512 11.25888 5.61152 19.82464 16.22016 25.68704 31.85152 0.3584 0.95232 0.86016 2.39104 1.51552 4.31616l-70.6048 26.50624c4.49536 10.17344 10.42432 17.03936 17.792 20.57728 7.36256 3.53792 14.99648 3.83488 22.90176 0.86528 5.88288-2.20672 10.32704-5.63712 13.32736-10.29632 3.00032-4.6592 4.44928-10.83392 4.34176-18.52416z m-62.42816-6.15936l52.864-19.84512c-3.70688-7.69536-7.96672-12.90752-12.78976-15.64672-7.42912-4.25984-15.21664-4.85888-23.35744-1.80736-7.36768 2.7648-12.63616 7.56224-15.81056 14.37696-3.16928 6.81472-3.47136 14.45888-0.90624 22.92224zM388.340378 621.35296l-30.85312-82.19648-14.17728 5.31968-4.6848-12.48256 14.17728-5.31968-3.78368-10.07616c-2.38592-6.35392-3.59936-11.2896-3.63008-14.80704-0.01536-4.74112 1.43872-9.13408 4.36224-13.17888 2.92352-4.04992 7.88992-7.38816 14.90432-10.02496 4.51584-1.69472 9.70752-3.03104 15.57504-4.0192l2.84672 14.90432c-3.54816 0.65536-6.81472 1.54112-9.78432 2.65728-4.87424 1.82784-7.93088 4.16256-9.17504 6.99904-1.23904 2.8416-0.78848 7.11168 1.3568 12.81536l3.28192 8.73472 18.45248-6.92736 4.6848 12.48256-18.45248 6.92736 30.85312 82.19648-15.95392 5.99552zM489.972378 583.20384l-5.2224-13.91104c-3.3536 13.4656-11.36128 22.57408-24.0128 27.32544a40.84224 40.84224 0 0 1-16.85504 2.6624c-5.64736-0.31744-10.25024-1.65888-13.81376-4.01408s-6.70208-5.69856-9.41056-10.04032c-1.83808-2.90304-4.03968-7.77728-6.6048-14.61248l-22.02112-58.65984 16.04608-6.02624 19.712 52.51072c3.14368 8.37632 5.59616 13.9008 7.34208 16.56832 2.59584 3.84 5.97504 6.3488 10.14784 7.53152 4.16768 1.17248 8.66304 0.86528 13.48096-0.9472a28.19584 28.19584 0 0 0 12.16-8.78592c3.29728-4.04992 5.0176-8.5248 5.18144-13.43488 0.1536-4.90496-1.28-11.40224-4.31616-19.48672l-19.04128-50.72896 16.04096-6.02112 35.53792 94.67392-14.35136 5.39648zM522.161818 571.12064l-35.54304-94.67904 14.4384-5.42208 5.05344 13.4656c3.05152-13.01504 11.14112-21.98528 24.27904-26.91584 5.70368-2.14016 11.33568-3.08736 16.89088-2.83136 5.55008 0.256 10.1376 1.60768 13.76768 4.03968 3.63008 2.44224 6.77376 5.76512 9.44128 9.984 1.71008 2.74944 3.95776 7.8336 6.74816 15.26272l21.85728 58.21952-16.04608 6.02112-21.62176-57.58464c-2.45248-6.53824-4.91008-11.19744-7.37792-13.96224-2.4576-2.77504-5.64736-4.52608-9.5488-5.26848-3.90656-0.73216-7.99744-0.30208-12.27264 1.3056-6.8352 2.56512-11.91936 6.94784-15.25248 13.14816-3.33312 6.20032-2.72384 15.36512 1.82784 27.48928l19.40992 51.70688-16.0512 6.02112zM677.825178 512.68608l-4.49024-11.94496c-2.47296 11.64288-9.53856 19.65056-21.18656 24.02304a39.69536 39.69536 0 0 1-23.15776 1.57696c-7.88992-1.792-14.976-5.75488-21.248-11.90912-6.27712-6.14912-11.23328-14.07488-14.86848-23.7568-3.54816-9.45152-5.19168-18.61632-4.93056-27.49952 0.26112-8.87808 2.76992-16.54784 7.53152-23.01952 4.7616-6.46656 11.0336-11.15648 18.82112-14.08 5.70368-2.14016 11.23328-2.8416 16.59904-2.10944 5.36064 0.73728 10.15808 2.5088 14.40256 5.3248l-17.60256-46.89408 15.95392-5.9904 49.05984 130.688-14.88384 5.59104z m-68.46464-28.20608c4.5568 12.12416 10.51136 20.224 17.87392 24.30976 7.36768 4.08576 14.52544 4.82304 21.4784 2.21696 7.00928-2.63168 11.88864-7.74144 14.63808-15.31392s1.92-17.24928-2.49856-29.01504c-4.85888-12.9536-10.9312-21.5296-18.19648-25.71776-7.2704-4.18304-14.56128-4.90496-21.86752-2.16064-7.13728 2.67776-11.99616 7.82848-14.59712 15.44704-2.59072 7.61344-1.536 17.69472 3.16928 30.2336zM763.994778 445.54752l17.35168-4.1728c1.024 10.66496-0.99328 20.00384-6.06208 28.01152s-13.09696 14.06976-24.0896 18.19648c-13.84448 5.20192-26.42432 5.05344-37.73952-0.43008-11.31008-5.4784-19.86048-15.91808-25.63584-31.3088-5.98016-15.9232-6.51776-29.824-1.62304-41.70752 4.89984-11.87328 13.89056-20.26496 26.96192-25.17504 12.66176-4.75136 24.62208-4.32128 35.88096 1.28512s19.81952 16.22016 25.69216 31.85152c0.35328 0.95232 0.86016 2.38592 1.51552 4.31616l-70.6048 26.50624c4.50048 10.17856 10.42944 17.03936 17.79712 20.57728 7.36256 3.53792 15.0016 3.83488 22.90688 0.86528 5.87776-2.20672 10.32704-5.64224 13.32224-10.29632 2.98496-4.65408 4.43392-10.83392 4.3264-18.51904z m-62.42304-6.16448l52.85888-19.84512c-3.70176-7.69536-7.9616-12.90752-12.78464-15.64672-7.43424-4.25984-15.21664-4.864-23.35744-1.80736-7.3728 2.76992-12.6464 7.56224-15.81568 14.37696-3.16416 6.81984-3.46624 14.464-0.90112 22.92224zM866.287258 441.9328l-4.48512-11.94496c-2.47808 11.64288-9.53856 19.65056-21.19168 24.02304a39.67488 39.67488 0 0 1-23.15264 1.57184c-7.88992-1.78688-14.976-5.75488-21.25312-11.90912-6.27712-6.14912-11.22816-14.07488-14.86848-23.7568-3.54304-9.45152-5.19168-18.61632-4.93056-27.49952 0.26112-8.87808 2.76992-16.54784 7.53152-23.01952 4.7616-6.46656 11.0336-11.15648 18.82112-14.08 5.70368-2.14016 11.2384-2.84672 16.59904-2.11456 5.36064 0.73728 10.15808 2.5088 14.40768 5.32992l-17.60256-46.89408 15.95392-5.9904 49.05984 130.688-14.88896 5.59616z m-68.45952-28.20096c4.55168 12.12416 10.50624 20.224 17.87392 24.30976 7.36256 4.08576 14.52032 4.82304 21.47328 2.21696 7.00928-2.63168 11.89376-7.73632 14.6432-15.31392 2.74944-7.57248 1.91488-17.24928-2.49856-29.01504-4.864-12.9536-10.93632-21.5296-18.2016-25.71776-7.2704-4.18304-14.56128-4.90496-21.86752-2.16064-7.13216 2.67776-11.99616 7.82848-14.592 15.44704-2.59584 7.60832-1.54112 17.6896 3.16928 30.2336z" fill="#bfbfbf" p-id="3601"></path></svg>
                            <h2 id="dynamicEffect-start">Return Requirements</h2>
                        </div>
                    </div>
                    <div style={{width:"100%",overflow:"hidden"}}>
                        <div id="return-dynamicEffect-2" className="Preturn-info">
                            <div></div>
                            <p>Returns must be requested within 45 days from the date of purchase.</p>
                            <div></div>
                            <p>Purchases must be made through our official website. You will need to provide your email address or order number for confirmation.</p>
                            <div></div>
                            <p>Returns and exchanges are free. If the return is due to a defect in our product or damage during shipping by the carrier, we will cover the shipping costs. However, if the return is due to personal preference (product must remain unused), you will be responsible for the shipping costs.</p>
                            <div></div>
                            <p>Returns will not be accepted for products damaged due to misuse or physical damage caused by the user.</p>
                            <div></div>
                            <p>Returned items must be in their original packaging and include all product accessories.</p>
                        </div>
                    </div>
                </div>

                <div className="Preturn-mobule-3">
                    <h3>Return Process</h3>
                    <div className="Preturn-process-info">
                        <div className="Preturn-process-text">
                            To request a return via email, please contact us at <a style={{color:"black"}} href="mailto:after-sales@jendey.com">after-sales@jendey.com</a>. <br /><br />In your email, include the email address used to place the order or the order number, the reason for the return, and clear pictures showing the condition of the product.
                        </div>
                        <div className="Preturn-process-right-img"><img  src={require("../../assets/images/right.png")} alt="right" /></div>
                        <div className="Preturn-process-text">
                            We will proceed with order confirmation and evaluation.<br /><br /> We will then confirm the refund or arrange for a replacement shipment with the customer.<br /><br /> We will send you the return address and relevant instructions.
                        </div>
                        <div className="Preturn-process-right-img"><img  src={require("../../assets/images/right.png")} alt="right" /></div>
                        <div className="Preturn-process-text">
                            We will process your return within 1-3 business days upon receiving the package.<br /><br /> Once we confirm that your package meets the standards, we will refund the original payment method within 3 business days (no alternative refund methods accepted), or arrange for a replacement shipment.
                        </div>
                    </div>
                </div>

                <div className="Pshipping-nav-mobule">
                    <div><Link  to="/"><i>Home</i></Link></div><div>{" › "}</div>
                    <div><Link  to="/return"><i>Return and Refund Policy</i></Link></div><div></div>
                </div>
                <PhoneFooter name="home" onRef={this.onRef} ISO={this.state.ISO} headCurrChange={this.headCurrChange}/>
            </div>
        );
    }
}

export default PhoneReturn;