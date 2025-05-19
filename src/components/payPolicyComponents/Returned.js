import React,{Component} from "react";
class Returned extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }
    render() {
        return (
            <div style={{backgroundColor:"white",paddingTop:"3%",paddingBottom:"5%"}}>
                <h3 style={{width:"85%",marginLeft:"5%",marginBottom:"3%",textAlign:"center",fontSize:"25px",fontWeight:"600"}}>Return and Refund Policy</h3>
                <p style={{width:"85%",marginLeft:"8%",marginBottom:"10%",marginTop:"8%"}}>
                    <h4>Return Requirements</h4>
                    1. Returns must be requested within 45 days from the date of purchase.
                    <br />
                    2. Purchases must be made through our official website. You will need to provide your email address or order number for confirmation.
                    <br />
                    3. Returns and exchanges are free. If the return is due to a defect in our product or damage during shipping by the carrier, we will cover the shipping costs. However, if the return is due to personal preference (product must remain unused), you will be responsible for the shipping costs.
                    <br />
                    4. Returns are not accepted for customized products, or for any item that has been damaged due to misuse or customer-induced physical damage.
                    <br />
                    5. Returned items must be in their original packaging and include all product accessories.
                
                    <h4>Return Process</h4>
                    1. To request a return via email, please contact us at <a style={{color:"black"}} href="mailto:service@proceast.com">service@proceast.com</a>.
                    <br />
                    2. In your email, include the email address used to place the order or the order number, the reason for the return, and clear pictures showing the condition of the product.
                    <br />
                    3. We will proceed with order confirmation and evaluation.
                    <br />
                    4. We will then confirm the refund or arrange for a replacement shipment with the customer.
                    <br />
                    5. We will send you the return address and relevant instructions.
                    <br />
                    6. We will process your return within 1-3 business days upon receiving the package.
                    <br />
                    7. Once we confirm that your package meets the standards, we will refund the original payment method within 3 business days (no alternative refund methods accepted), or arrange for a replacement shipment.
                </p>
            </div>
        );
    }
}

export default Returned;