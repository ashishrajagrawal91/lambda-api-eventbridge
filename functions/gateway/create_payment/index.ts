import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import * as Joi from "joi";
import { InvalidRequestError } from "./errors";
import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";

const eventBridgeClient = new EventBridgeClient({ "region": process.env.AWS_REGION });

interface Payment {
    paymentSource: string;
    destination: string;
    currency: string;
    amount: string;
}

interface ApiError {
	statusCode: number;
	message: string;
}

const PAYMENT_SOURCE_TYPES = [`client`, `vendor`];

const validator = (body: Payment) => {
	const schema = Joi.object({
		"amount"     	  : Joi.string().required(),
		"currency"   	  : Joi.string().required(),
		"destination"	  : Joi.string().required(),
		"paymentSource" : Joi.string().valid(...PAYMENT_SOURCE_TYPES),
	}).unknown(true);

	return schema.validate(body);
};

const sendEvent = async(body: Payment, requestId: string) =>{
	const entry = {
		"Entries": [
			{
				"Detail"       : JSON.stringify({...body, requestId}),
				"DetailType"   : `PaymentCreated`,
				"EventBusName" : process.env.EVENTS_BUS,
				"Source"       : `app.payment`,
				"Time"     	   : new Date(),
			},
		],
	};

	const command = new PutEventsCommand(entry);
	const data = await eventBridgeClient.send(command);

	return data;
};

const main = async(body: Payment, requestId: string) =>{
	console.log(`processPayment main `, body);
	try {
		const data = await sendEvent(body, requestId);

		console.log(`processPayment data `, data);
	} catch (error) {
		console.error(`processPayment error `, error);
	}

	return {
		"body": {"data": `Payment processed successfully.`},
	};
};

export const handler = async(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
	console.log(`processPayment event `, event);
	try {
		const payment: Payment = JSON.parse(event.body!);

		const result = await validator(payment);

		if (typeof result.error !== `undefined`) {
			const messages = result.error.details.map((e) => e.message);

			throw new InvalidRequestError(JSON.stringify(messages));
		}

		const { body } = await main(payment, event.requestContext.requestId);

		return {
			"body"    : typeof body === `undefined` ? `{}` : JSON.stringify(body),
			"headers" : {
				"Access-Control-Allow-Origin" : `*`,
				"Content-Type"                : `application/json`,
			},
			"statusCode": 200,
		};
	} catch (error) {
		const typedError = error as ApiError;

		console.error(`processPayment handler error`, typedError);
		return {
			"body"    : JSON.stringify(typedError),
			"headers" : {
				"Access-Control-Allow-Origin" : `*`,
				"Content-Type"                : `application/json`,
			},
			"statusCode": typedError.statusCode || 500,
		};
	}
};
