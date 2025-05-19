import React,{Component} from "react";
import copy from 'copy-to-clipboard';
import axios from "axios";
import { Link } from "react-router-dom";
class ProductLinks extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            productArr : [{"indent":"","img":"pro1.png","title":"ZH - Home RF Beauty Device","func":"Reduce nasolabial lines , Color light skin rejuvenation , Tighten the skin,Nutrient delivery","sale":209,"delete_sale":259,"off":"50"}],
            isShowHint : false,
         };
    }

    componentDidMount(){
        this.getProductInfo()
    }

    //获取产品信息
    getProductInfo=()=>{
        axios.post("/api/get_all_Product")
        .then((response)=>{
            this.setState({
                productArr : response.data
            })
        })
    }

    //点击产品跳转详情页面
    turnDetailPage=(e)=>{
        window.open("_blank").location.href = `/detail?pdnum=pro${e.target.getAttribute("value")}`
    }

    //点击复制按钮复制内容
    copyText=(e)=>{
        let product = e.currentTarget.getAttribute("value")
        const cText = `https://www.jendey.com/detail?pdnum=${product}&cou=${this.props.nowAccountUUID}`
        copy(cText);
        //提示复制成功
        this.setState({
            isShowHint : true
        })
        setTimeout(()=>{
            this.setState({
                isShowHint : false
            })
        },1500)
    }

    render() {
        return (
            <div>
                <h2>Generate Link</h2>
                <div className="PproductLink-mobule">
                    {
                        this.state.productArr.map((value , key)=>{
                            return <div className="PproductLink-product-info" key={key}>
                                        <div style={value.off === "0"?{display:"none"}:{}} className="Pshop-product-off-label">{value.off === "0"? "" : `$${value.off} OFF`}</div>
                                        <img  value={key + 1} onClick={this.turnDetailPage} src={require("../../../assets/images/product/" + value.img)} alt={value.title + value.func} />
                                        <div>
                                            <h3>{value.title}</h3>
                                            <div style={{marginTop:"3%",marginBottom:"2%"}}><b>${value.sale}</b><span style={value.delete_sale  === "0"?{display:"none"}:{}}>${value.delete_sale}</span></div>
                                            <div className="PproductLink-product-link-label">Your link :</div>
                                            <p className="PproductLink-product-link">
                                                <div value={value.indent} id={"productLink"+key}>
                                                    {`https://www.jendey.com/detail?pdnum=${value.indent}&cou=${this.props.nowAccountUUID}`}
                                                </div>
                                                <div onClick={this.copyText} value={value.indent}><svg  t="1712541763771" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2541" width="20" height="20"><path d="M725.333333 341.333333h128v512H341.333333v-128H213.333333V213.333333h512v128z m0 42.666667v341.333333H384v85.333334h426.666667V384h-85.333334zM256 256v426.666667h426.666667V256H256z" fill="#707070" p-id="2542"></path></svg></div>
                                            </p>
                                        </div>
                                    </div>
                        })
                    }
                </div>
                <p className="PproductLink-hint-text">
                    The exclusive links for each product have been generated for you. You will receive a 15% commission on all products purchased through these links.
                </p>

                <div className={this.state.isShowHint ? "PproductLink-copy-hint" : "PproductLink-copy-hint-hidden"}>
                    <p>Copy Successful !</p>
                </div>
            </div>
        );
    }
}

export default ProductLinks;