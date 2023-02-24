import { createContext } from 'react';

export type GoogleContextType = {
	gsiLoaded: boolean;
	gapiLoaded: boolean;
};

export const GoogleContext = createContext<GoogleContextType>({
	gsiLoaded: false,
	gapiLoaded: false,
});
