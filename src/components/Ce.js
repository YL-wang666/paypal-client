import { PayPalScriptProvider,
		 PayPalButtons,
		 PayPalHostedFieldsProvider,
		 PayPalHostedField,
		 usePayPalHostedFields,
		} from "@paypal/react-paypal-js";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../assets/css/ce.css"


// Example of custom component to handle form submit
const SubmitPayment = ({ customStyle , onApprove }) => {
	const [paying, setPaying] = useState(false);
	const cardHolderName = useRef(null);
	const hostedField = usePayPalHostedFields();

	const handleClick = () => {
		
		if (!hostedField?.cardFields) {
            const childErrorMessage = 'Unable to find any child components in the <PayPalHostedFieldsProvider />';

            alert("托管字段无法使用")
        }
		
		const isFormInvalid =
			Object.values(hostedField.cardFields.getState().fields).some(
				(field) => !field.isValid
			) || !cardHolderName?.current?.value;

		if (isFormInvalid) {
			return alert(
				"The payment form is invalid"
			);
		}
		
		setPaying(true);
		hostedField.cardFields
			.submit({
				cardholderName: cardHolderName?.current?.value,
			})
			.then((data) => {
				alert(data.orderId)
				onApprove(data.orderId);
				setPaying(false);
			})
			.catch((err) => {
				// Here handle error
				setPaying(false);
			});
	};

	return (
		<>
            <label title="This represents the full name as shown in the card">
				Card Holder Name
				<input
					id="card-holder"
					ref={cardHolderName}
					className="card-field"
					style={{ ...customStyle, outline: "none" }}
					type="text"
					placeholder="Full name"
				/>
				</label>
			<button
				className={`btn${paying ? "" : " btn-primary"}`}
				style={{ float: "right" }}
				onClick={handleClick}
			>
				{paying ? <div className="spinner tiny" /> : "Pay"}
			</button>
		</>
	);
};



export default function Ce() {

	const [clientId , setClientId] = useState(null);
	const [clientToken , setClientToken] = useState(null);

	useEffect(() => {
		getClientToken();
	}, []);

	const getClientToken = async () =>{
		const response = await axios.post("https://814j671e97.zicp.fun/paypal/getClientToken", {
			withCredentials: true // 必须加这个才能带 cookie（如 session）
		  })
		setClientId(response.data.clientId)
		setClientToken(response.data.client_token)
	}

	const createOrder = async () =>{
	const response = await axios.post("https://814j671e97.zicp.fun/paypal/createOrder",{
			payProStr : "C12_1",
			curr : "USD",
			withCredentials: true // 必须加这个才能带 cookie（如 session）
		})
		console.log(response.data)
		return response.data
	}

	const onApprove = async (orderID) => {
		try {
		  // 1. 捕获支付（不再需要传递 payerID）
		  const captureResponse = await axios.post("https://814j671e97.zicp.fun/paypal/captureOrder", {
			withCredentials: true ,// 必须加这个才能带 cookie（如 session）
			orderID: orderID // v2 API 不需要 payerID
		  });
		  
		  // 2. 处理成功结果
		  if (captureResponse.data.status === "success") {
			alert(`支付成功！交易ID: ${captureResponse.data.transactionId}`);
			// 3. 可选的后续操作
			//window.location.href = `/success?txn_id=${captureResponse.data.transactionId}`;
		  }
		  
		} catch (error) {
		  // 4. 增强错误处理（适配v2错误格式）
		  const errorMsg = error.response?.data?.userMessage || 
						  error.response?.data?.message ||
						  "Payment failed. Please contact support";
		  
		  alert(errorMsg);
		  
		 
		}
	  };

	  const onError = (err) => {
		alert("Payment failed");
	  };


    return (
		<div  className="paypal-pay-iframe-mobule">
			
			{
				clientId  && clientToken ? (
					<PayPalScriptProvider 
						key={clientToken}
						options={{ 
							clientId: clientId ,
							components: "buttons,hosted-fields",
							dataClientToken: clientToken,
							intent: "capture",					
						}}
					>
				
						<PayPalHostedFieldsProvider
							createOrder={createOrder}
						>
						
						<PayPalHostedField
							id="card-number"
							className=""
							hostedFieldType="number"
							options={{ selector: "#card-number", placeholder: 'Card Number' }}
						/>
						<PayPalHostedField
							id="cvv"
							className=""
							hostedFieldType="cvv"
							options={{ selector: "#cvv", placeholder: 'CVV' }}
						/>
						<PayPalHostedField
							id="expiration-date"
							className=""
							hostedFieldType="expirationDate"
							options={{
							selector: "#expiration-date",
							placeholder: "MM/YY",
							}}
						/>

						<SubmitPayment onApprove={onApprove} />

									
						<PayPalButtons
							createOrder = {createOrder}
							onApprove = {(data) => onApprove(data.orderID)}
							onError={onError}
							disabled={false}
							style={{ layout: "horizontal" }} 
						/>
						</PayPalHostedFieldsProvider>

					</PayPalScriptProvider>
				) : <span>Loading ...</span>
			}
			
		</div>
    );
}