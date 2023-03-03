import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { UserEvent } from '@testing-library/user-event/dist/types/setup/setup';
import { ReactElement } from 'react';

const customRender = (
	ui: ReactElement,
	options?: Omit<RenderOptions, 'wrapper'>,
): ReturnType<typeof render> & { user: UserEvent } => ({
	user: userEvent.setup(),
	...render(ui, options),
});

export * from '@testing-library/react';
export { customRender as render };
