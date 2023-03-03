import { Drive } from '@/__mocks__/gapi/drive';

export class Client {
	drive: gapi.client.drive.Drive = new Drive() as gapi.client.drive.Drive;
	init(_callback: () => any): void {}
	async load(_urlOrObject: string | object): Promise<void> {}
	request(_args: gapi.client.RequestOptions): gapi.client.HttpRequest<any> {
		return new gapi.client.HttpRequest<void>();
	}
	rpcRequest(
		_method: string,
		version?: string,
		rpcParams?: any,
	): gapi.client.RpcRequest {
		return new gapi.client.RpcRequest();
	}
	setApiKey(_apiKey: string): void {}
	getToken(): GoogleApiOAuth2TokenObject {
		return {
			access_token: '',
			error: '',
			expires_in: '10',
			state: '',
		};
	}
	setToken(_token: GoogleApiOAuth2TokenObject): void {}
}
