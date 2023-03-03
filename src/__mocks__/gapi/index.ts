import { Auth } from '@/__mocks__/gapi/auth';
import { Client } from '@/__mocks__/gapi/client';

const GAPI = {
	client: new Client() as typeof gapi.client,
	auth: new Auth(),
	load: (_apiName: string, _callback: gapi.CallbackOrConfig): void => {},
};

export { GAPI };
