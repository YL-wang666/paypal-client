import React,{Component} from "react";
class Shipping extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }
    render() {
        return (
            <div style={{backgroundColor:"white",paddingTop:"3%",paddingBottom:"5%"}}>
                <h3 style={{width:"85%",marginLeft:"5%",marginBottom:"3%",textAlign:"center",fontSize:"25px",fontWeight:"600"}}>Shipping Policy</h3>
                <p style={{width:"85%",marginLeft:"8%",marginBottom:"10%"}}>
                    Thank you for choosing the ProcEast brand! Here is our shipping policy to ensure that your orders are delivered safely and promptly:
                    <h4>Delivery Time:</h4>
                    ProcEast provides global shipping services with a typical transit time of 12-25 days. Please note that actual delivery times may vary depending on the destination, shipping volume, and other factors.
                    
                    <h4>Order Processing:</h4>
                    After placing an order, we will confirm and prepare it within 1-2 days. You can track the status and delivery process of your order through the email you provided.
                    
                    <h4>Address Modification:</h4>
                    To ensure the safe delivery of orders, we do not accept requests to modify shipping addresses during transit.
                    
                    <h4>Handling of Unexpected Situations:</h4>

                    In the event that the carrier fails to complete the delivery or if a package is lost during transit, we will take full responsibility for arranging a new delivery until the package safely reaches the specified address.
                    
                    <h4>Inspection upon Receipt:</h4>

                    Upon receiving your goods, please promptly inspect them for integrity and quantity. If you discover any damage, shortages, or other issues, please contact our after-sales service team immediately at <a style={{color:"black"}} href="mailto:after-sales@jendey.com">service@proceast.com</a>.
                    <br /><br />
                    We are committed to providing you with efficient and reliable shipping services. If you have any questions or needs, please feel free to contact us. Once again, thank you for choosing the ProcEast brand!
                </p>
            </div>
        );
    }
}

export default Shipping;