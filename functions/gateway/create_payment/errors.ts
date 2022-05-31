class BaseError extends Error {
	statusCode: number = 500;

	errorName: string = ``;

	errorMessage: string = ``;

	constructor(message: string) {
		super(message);
		this.errorMessage = message || `Oops, something went wrong.`;
	}
}

class InvalidRequestError extends BaseError {
	constructor(message: string) {
		super(message);
		this.errorMessage = message;
		this.errorName = `InvalidRequestError`;
		this.statusCode = 400;
	}
}

export {
	InvalidRequestError,
};
