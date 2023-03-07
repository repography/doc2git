import { type JestAxe, configureAxe, toHaveNoViolations } from 'jest-axe';

import { AXE_VALUES } from './config';

expect.extend(toHaveNoViolations);

export const jestAxeConfig: JestAxe = configureAxe({
	rules: AXE_VALUES,
});
