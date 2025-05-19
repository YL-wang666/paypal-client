import React,{Component} from "react";
import axios from "axios";
class Funds extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            nowAccount : {"user":"","uuid":"","account":null,"amount":"0","dis_amount":"","su_time":"","up_time":"","status":"0"},
            notOrderSum : 0,
            notComm : 0,
            //提示修改24小时内无法提现和余额不足无法提现的消息提示
            message : "",
            //修改或添加PayPal账户的在此提示框是否显示
            isShowHint : false,
            addAccount : false,
            //此时PayPal提现账户
            paypalAccount : null,
            //这个参数是确定此时执行的是添加PayPal账户还是修改账户两种参数"add","modify"
            func : "add",
         };
    }

    componentDidMount(){
        this.setState({
            //如果修改过账户,但为过24小时,提示不能提现(up_time时间是当时修改时间+24小时)
            message : new Date() < new Date(this.props.nowAccount.up_time) ? "Unable to withdraw within 24 hours after modifying the withdrawal account" : "",
            nowAccount : this.props.nowAccount,
            //根据是否存在提现账户来显示添加还是修改内容
            addAccount :  this.props.nowAccount.account ? true : false,
            //用于显示在提现账户
            paypalAccount : this.props.nowAccount.account ? this.props.nowAccount.account : null,
            //由于提现账户修改和添加都是一个接口，所有用这个参数判断是添加还是修改
            func : this.props.nowAccount.account ?  "modify" : "add"
        })

        this.getNotOrderInfo()
    }

    getNotOrderInfo=()=>{
        if(!this.props.nowAccount.uuid){
            return
        }

        axios.post("/api/not_order",{
            uuid : this.props.nowAccount.uuid
        })
        .then((res)=>{
            this.setState({
                notOrderSum : res.data.split(",")[0],
                notComm : res.data.split(",")[1]
            })
            
        })
    }

    //提交PayPal提现账户
    addAccount=()=>{
        const account = document.getElementById("Funds-account-input").value
        let str = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+/;
        if(!str.test(account)){
            alert("The PayPal withdrawal account must be an email address !")
            return
        }
        this.setState({
            isShowHint : true
        })
        document.getElementById("Funds-hint-email").innerText = account
    }

    //将func参数修改过来,并显示修改显示内容
    changeFunc=()=>{
        this.setState({
            func : "modify",
            addAccount : false
        })
    }

    //提示框点击
    confirmAccount=(e)=>{
        if(e.target.value === "no"){
            this.setState({
                isShowHint : false
            })
            return
        }

        axios.post("/api/paypal_account",{
            user : this.state.nowAccount.user,
            account : document.getElementById("Funds-account-input").value,
            func : this.state.func
        })
        .then((res)=>{
            if(res.data === "500" | res.data === ""){
                alert("The attempt to add the PayPal account failed. Please try again")
                return
            }
            
            //将添加按钮切换到更改账户按钮
            this.setState({
                addAccount : true,
                isShowHint : false,
                paypalAccount : document.getElementById("Funds-account-input").value
            })

        }) 
    }

    //执行提现
    requestPayment=()=>{
        if(new Date() < new Date(this.props.nowAccount.up_time)){
            return;
        }
        if(Number(this.state.nowAccount.amount) === 0){
            this.setState({
                message : "The current commission is 0, so withdrawal is not possible"
            })
            return
        }
        if(!this.state.paypalAccount){
            alert("Please add your PayPal withdrawal account first")
           return
        }

        axios.post("/api/request_payment",{
            user : this.state.nowAccount.user
        })
        .then((res)=>{
            if(res.data === "no_account"){
                alert("Please add your PayPal withdrawal account first")
                return
            }
            if(res.data === "fail"){
                alert("Unable to withdraw within 24 hours after modifying the withdrawal account")
                return
            }
            if(res.data === "err"){
                alert("Request failed. Please try again later")
                return
            }

            let changeAccount = this.state.nowAccount
            //将amount金额转到dis_amount,代表已经处理中金额
            changeAccount.dis_amount = this.state.nowAccount.amount 
            changeAccount.amount = "0"
            this.setState({
                nowAccount : changeAccount
            },
                ()=>{
                    alert("Request successful. We will review and issue the commission within 1-3 business days")
                }
            )

        })
    }

    render() {
        return (
            <div>
                <div className="PFunds-info-mobule">
                    <div className="PFunds-info-1-mobule">
                        <div>
                            <span>Quantity of Orders awaiting Receipt Confirmation </span>
                            <p>{this.state.notOrderSum}</p>
                        </div>
                        <div>
                            <span>Unsettled Commission </span>
                            <p>${this.state.notComm}</p>
                        </div>
                    </div>
                    {
                        this.state.nowAccount.status === "0" ? 
                        <div className="PFunds-suspended-mobule">
                            Your account has been involved in fraudulent activities. Your account is temporarily suspended. If you wish to appeal, please contact support@jendey.com
                        </div>
                        :
                        <div className="PFunds-info-2-mobule">
                            <div>
                                <span>Available for withdrawal </span>
                                <p>${this.state.nowAccount.amount}</p>
                                <button onClick={this.requestPayment} className="PFunds-request-btn">Request Withdrawal</button>
                                <p id="Funds-not-withdrawal" style={{fontSize:"12px",color:"orangered",width:"80%",marginTop:"5%",marginLeft:"10%"}}>
                                    {this.state.message}
                                </p>
                            </div>
                            <div style={{marginTop:"15%"}}>
                                <div>Withdraw to PayPal account </div>
                                
                                {
                                    this.state.addAccount ? 
                                    <div>
                                        <p style={{fontSize:"18px",marginTop:"13%"}} id="Funds-show-account">
                                            {this.state.paypalAccount}
                                        </p>
                                        <div onClick={this.changeFunc} className="PFunds-modify-btn"><i>Modify Account</i></div>
                                    </div>
                                    :
                                    <div>
                                        <input id="Funds-account-input" placeholder="Add PayPal receiving account" /><br />
                                        <button onClick={this.addAccount} className="PFunds-add-account-btn">Submit Account</button>
                                    </div>
                                }
                                
                            </div>
                        </div>
                        
                    }
                    

                    <p className="PFunds-disbursing-mobule">
                        {
                            Number(this.state.nowAccount.dis_amount) === 0 ?
                            ""
                            :
                            `We are currently disbursing a $${this.state.nowAccount.dis_amount} commission, which will be credited to your account within 1-3 business days.`
                        }
                        
                    </p>
                    <div className="PFunds-Explanation-mobule">
                        1. The commission from orders in the awaiting receipt status will remain unsettled. Once the orders are marked as received, the commission will transition from unsettled to withdrawable status.
                        <br /><br />
                        2. To ensure the security of your funds, after modifying the withdrawal account, it will be in an unwithdrawable state for 24 hours.
                        <br /><br />
                        3. Once fraudulent activities are detected (such as creating fake orders to obtain commissions), we will freeze the account.
                    </div>

                </div>

                <div className={this.state.isShowHint ? "PFunds-account-hint" : "PFunds-account-hint-hidden" }>
                    <span>Are you sure you want to set <b id="Funds-hint-email"></b> as your PayPal withdrawal account?</span>
                    <br /><br /><hr /><br />
                    <div>
                        <button value="yes" onClick={this.confirmAccount} >Yes</button>
                        <button value="no" onClick={this.confirmAccount}>No</button>
                    </div>
                </div>

            </div>
        );
    }
}

export default Funds;