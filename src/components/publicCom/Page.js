import React , {Component} from "react"
import "../../assets/css/page.css"
class Page extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            //当前页数按钮个数
            pageSum : 7,
            //按钮数组
            pageArr : [1],
            //当前按钮坐标
            nowPage : 1,
            //每个页数为一组，0开始
            areaNum : 0,
            //一共有多少页
                sum : 1
         };
    }

    componentDidMount(){
        this.props.onRef(this);
    }

    //初始化所有记录
    initialization=()=>{
        this.setState({
            nowPage : 1,
            areaNum : 0
        })
    }

    //接收父组件传过来的页数
    getCountPage=(sum)=>{
        this.setState({
            sum : sum
        },
            ()=>{
                this.changePage()
            }
        )
    }

    //给按钮数组赋值
    changePage=()=>{
        let sum = this.state.sum
        let btnSum = sum <= 7?sum:(sum > (this.state.areaNum+1)*7?7:sum - this.state.areaNum*7)
        let btnArr = []
        for(let i = 0;i < btnSum; i++){
            btnArr[i] = i+1+7*this.state.areaNum
        }
        this.setState({
            pageArr : btnArr,
            pageSum : btnSum
        },
            ()=>{
                this.changeBtnColor()
            }
        )
    }

    //改变当前页数颜色
    changeBtnColor=()=>{
        let docArr = document.getElementsByClassName("page-btn")
        for(let i = 0;i < docArr.length;i++){
            if(i === this.state.nowPage - 1){
                docArr[i].style.backgroundColor = "black"
                docArr[i].style.color = "white"
            }
            else{
                docArr[i].style.backgroundColor = "whitesmoke"
                docArr[i].style.color = "black"
            }
        }
        
    }

    turnPage=(e)=>{
        let nowPage = this.state.nowPage
        let ps = this.state.pageSum
        let as = this.state.areaNum
        if(e.target.value === "up"){
            this.setState({
                nowPage : nowPage > 1?nowPage - 1:(as > 0?7:1) ,
                areaNum : nowPage > 1?as:(as === 0?0:as - 1)
            },
                ()=>{
                    if(nowPage === 1){
                        this.changePage()
                    } 
                    else{
                        this.changeBtnColor()
                    }
                    //传回给父组件
                    this.props.getPageInfo(this.state.areaNum*7 + this.state.nowPage)                    
                }
                
            )
            return
        }
        if(e.target.value === "down"){
            
            this.setState({
                nowPage : nowPage < ps?nowPage + 1:((as+1)*7 >= this.state.sum?ps:1),
                areaNum : nowPage < ps?as:((as+1)*7 >= this.state.sum?as:as+1)
            },
                ()=>{
                    if(nowPage === ps && (as+1)*7 !== this.state.sum){
                        this.changePage()
                    }
                    else{
                        this.changeBtnColor()
                    }
                    //传回给父组件
                    this.props.getPageInfo(this.state.areaNum*7 + this.state.nowPage)
                }
            )
            
            return
        }

        this.setState({
            nowPage : Number(e.target.value)
        },
            ()=>{
                this.changeBtnColor()
                //传回给父组件
                this.props.getPageInfo(this.state.areaNum*7 + this.state.nowPage)
            }
        )

    }

    render() {
        return (
            <div className="page-mobule">
                <button onClick={this.turnPage} value="up">{"<"}</button>
                {
                    this.state.pageArr.map((value,key)=>{
                        return <button className="page-btn" value={key+1} onClick={this.turnPage}>{value}</button>
                    })
                }
                <button onClick={this.turnPage} value="down">{">"}</button>
            </div>
        );
    }
}

export default Page;