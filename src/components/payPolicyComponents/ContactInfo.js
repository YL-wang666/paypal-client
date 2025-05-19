import React,{Component} from "react";
class ContactInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }
    render() {
        return (
            <div style={{backgroundColor:"white",paddingTop:"3%",paddingBottom:"5%"}}>
                <h3 style={{width:"85%",marginLeft:"8%",marginBottom:"3%",fontSize:"25px",fontWeight:"600"}}>Contact Us</h3>
                <p style={{width:"85%",marginLeft:"8%",marginBottom:"10%"}}>
                    If you have any questions, please feel free to contact us at <a href="mailto:service@proceast.com">service@proceast.com</a>.<br /><br /> We are committed to resolving your inquiries promptly, with a response time of no more than 24 hours. Thank you for choosing us.
                </p>
            </div>
        );
    }
}

export default ContactInfo;