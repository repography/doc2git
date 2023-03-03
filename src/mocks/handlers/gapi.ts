import { rest } from 'msw';

export const HANDLERS_GAPI = [
	rest.get(/^https:\/\/apis.google.com\/js\/api.js/, (_req, res, ctx) => {
		ctx.set('Content-Type', 'application/javascript');
		return res(ctx.body(''));
	}),
];
