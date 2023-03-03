import { HANDLERS_GAPI } from './gapi';
import { HANDLERS_GSI } from './gsi';

export const handlers = [...HANDLERS_GSI, ...HANDLERS_GAPI];
