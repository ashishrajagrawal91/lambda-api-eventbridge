import { EventBridgeEvent } from "aws-lambda";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const ddbClient = new DynamoDBClient({
	"region": process.env.AWS_REGION,
});

interface ProcessedPayment {
    paymentSource: string;
    destination: string;
    currency: string;
    amount: string;
    requestId: string;
    processedBy: string;
}

const putItem = async(data: ProcessedPayment) =>{
	const params = marshall(data);

	const command = new PutItemCommand({
		"Item": params, "TableName": process.env.DDB_PAYMENT_TABLE,
	});

	await ddbClient.send(command);
};

export const handler = async(event: EventBridgeEvent<any, any>) => {
	console.log(`processVendorPayment event `, event);

	event.detail.processedBy = `vendorHandler`;
	await putItem(event.detail);
};
