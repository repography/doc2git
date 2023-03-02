import { rest } from 'msw';

export const HANDLERS_GSI = [
	rest.get(/^https:\/\/accounts.google.com\/gsi\/client/, (_req, res, ctx) => {
		ctx.set('Content-Type', 'application/javascript');
		return res(ctx.body(''));
	}),
];
