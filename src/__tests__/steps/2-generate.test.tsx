import { checkout, log } from 'isomorphic-git';
import { axe } from 'jest-axe';
import { createFsFromVolume, Volume } from 'memfs';

import { mockRevisions } from '@/__mocks__/gapi/drive';
import {
	act,
	fireEvent,
	render,
	screen,
} from '@/__tests__/__helpers__/testing-library-react';
import { GoogleContext } from '@/contexts/google';
import { unzipFiles } from '@/lib/files';
import Step2Generate, {
	DOC_FETCH_ERROR,
	DOC_INVALID_ERROR,
} from '@/steps/2-generate';

describe('<Step2Generate />', () => {
	it('handles invalid doc URL', async () => {
		const docUrl = 'https://sheets.google.com/document/d/1';
		const setDocUrl = jest.fn();
		const googleReady = Promise.resolve(true);
		const actionLoading = false;
		const setActionLoading = jest.fn();
		const error = '';
		const setError = jest.fn();
		const setDownload = jest.fn();
		const setProgress = jest.fn();
		const tokenClient = {
			requestAccessToken: jest.fn(),
		};
		const tokenCallback = {
			current: jest.fn(),
		};
		const next = jest.fn();
		const back = jest.fn();

		const { container, user } = render(
			<GoogleContext.Provider value={{ gsiLoaded: true, gapiLoaded: true }}>
				<Step2Generate
					docUrl={docUrl}
					setDocUrl={setDocUrl}
					googleReady={googleReady}
					actionLoading={actionLoading}
					setActionLoading={setActionLoading}
					error={error}
					setError={setError}
					setDownload={setDownload}
					setProgress={setProgress}
					tokenClient={tokenClient}
					tokenCallback={tokenCallback}
					next={next}
					back={back}
				/>
			</GoogleContext.Provider>,
		);

		expect(screen.getAllByRole('textbox')).toHaveLength(1);
		const input = screen.getByRole('textbox');
		expect(input).toHaveValue(docUrl);

		expect(setDocUrl.mock.calls).toHaveLength(0);
		fireEvent.change(input, { target: { value: docUrl + 'foo' } });
		expect(setDocUrl.mock.calls).toHaveLength(1);
		expect(setDocUrl.mock.calls[0]).toEqual([docUrl + 'foo']);

		expect(setError.mock.calls).toHaveLength(0);

		expect(screen.getAllByRole('button')).toHaveLength(2);
		const button = screen.getByRole('button', {
			name: /generate/i,
		});
		expect(button).toBeInTheDocument();
		await user.click(button);

		expect(input).toBeInvalid();
		const docError = screen.getByText(DOC_INVALID_ERROR);
		expect(docError).toBeInTheDocument();
		expect(docError.getAttribute('id')).toEqual(
			input.getAttribute('aria-describedby'),
		);

		await act(async () => {
			const results = await axe(container);
			expect(results).toHaveNoViolations();
		});
	});
	it("handles valid doc URL which doesn't exist", async () => {
		const docUrl = 'https://docs.google.com/document/d/missing-doc-id';
		const setDocUrl = jest.fn();
		const googleReady = Promise.resolve(true);
		const actionLoading = false;
		const setActionLoading = jest.fn();
		let error = '';
		const setError = jest.fn((e) => (error = e));
		const setDownload = jest.fn();
		const setProgress = jest.fn();
		const tokenClient = {
			requestAccessToken: jest.fn(),
		};
		const tokenCallback = {
			current: jest.fn(),
		};
		const next = jest.fn();
		const back = jest.fn();

		const { container, rerender, user } = render(
			<GoogleContext.Provider value={{ gsiLoaded: true, gapiLoaded: true }}>
				<Step2Generate
					docUrl={docUrl}
					setDocUrl={setDocUrl}
					googleReady={googleReady}
					actionLoading={actionLoading}
					setActionLoading={setActionLoading}
					error={error}
					setError={setError}
					setDownload={setDownload}
					setProgress={setProgress}
					tokenClient={tokenClient}
					tokenCallback={tokenCallback}
					next={next}
					back={back}
				/>
			</GoogleContext.Provider>,
		);

		expect(screen.getAllByRole('textbox')).toHaveLength(1);
		const input = screen.getByRole('textbox');
		expect(input).toHaveValue(docUrl);

		expect(setError.mock.calls).toHaveLength(0);

		expect(screen.getAllByRole('button')).toHaveLength(2);
		const button = screen.getByRole('button', {
			name: /generate/i,
		});
		expect(button).toBeInTheDocument();
		await user.click(button);

		expect(setError.mock.calls).toHaveLength(2);
		expect(setError.mock.calls[0]).toEqual(['']); // error is cleared when submitting
		expect(setError.mock.calls[1]).toEqual([DOC_FETCH_ERROR]);

		rerender(
			<GoogleContext.Provider value={{ gsiLoaded: true, gapiLoaded: true }}>
				<Step2Generate
					docUrl={docUrl}
					setDocUrl={setDocUrl}
					googleReady={googleReady}
					actionLoading={actionLoading}
					setActionLoading={setActionLoading}
					error={error}
					setError={setError}
					setDownload={setDownload}
					setProgress={setProgress}
					tokenClient={tokenClient}
					tokenCallback={tokenCallback}
					next={next}
					back={back}
				/>
			</GoogleContext.Provider>,
		);

		const alert = screen.getByRole('alert');
		expect(alert).toBeInTheDocument();
		expect(alert.textContent).toBe(DOC_FETCH_ERROR);

		await act(async () => {
			const results = await axe(container);
			expect(results).toHaveNoViolations();
		});
	});
	it('generates the zip for a valid doc ID', async () => {
		const docId = 'several-revisions';
		const docUrl = `https://docs.google.com/document/d/${docId}`;
		const setDocUrl = jest.fn();
		const googleReady = Promise.resolve(true);
		const actionLoading = false;
		const setActionLoading = jest.fn();
		let error = '';
		const setError = jest.fn((e) => (error = e));
		const setDownload = jest.fn();
		const setProgress = jest.fn();
		const tokenClient = {
			requestAccessToken: jest.fn(),
		};
		const tokenCallback = {
			current: jest.fn(),
		};
		const next = jest.fn();
		const back = jest.fn();

		let zipBlob: Blob | undefined;
		window.URL.createObjectURL = (blob: Blob): string => {
			zipBlob = blob;
			return 'data:foo';
		};

		let container: HTMLElement;
		const done = new Promise((resolve, _reject) => {
			const { container: c } = render(
				<GoogleContext.Provider value={{ gsiLoaded: true, gapiLoaded: true }}>
					<Step2Generate
						docUrl={docUrl}
						setDocUrl={setDocUrl}
						googleReady={googleReady}
						actionLoading={actionLoading}
						setActionLoading={setActionLoading}
						error={error}
						setError={setError}
						setDownload={setDownload}
						setProgress={setProgress}
						tokenClient={tokenClient}
						tokenCallback={tokenCallback}
						next={next}
						back={back}
						doneCallback={(): void => resolve(undefined)}
					/>
				</GoogleContext.Provider>,
			);
			container = c;
		});

		expect(screen.getAllByRole('textbox')).toHaveLength(1);
		const input = screen.getByRole('textbox');
		expect(input).toHaveValue(docUrl);

		expect(setError.mock.calls).toHaveLength(0);

		expect(screen.getAllByRole('button')).toHaveLength(2);
		const button = screen.getByRole('button', {
			name: /generate/i,
		});
		expect(button).toBeInTheDocument();

		await button.click();
		await done;

		expect(setError.mock.calls).toHaveLength(1);
		expect(setError.mock.calls[0]).toEqual(['']); // error is cleared when submitting

		const revs = mockRevisions[docId];

		expect(setProgress.mock.calls).toHaveLength(2 + revs.length);
		expect(setProgress.mock.calls[1 + revs.length]).toEqual([
			{ percent: 100, status: 'Done' },
		]);

		expect(setDownload.mock.calls).toHaveLength(1);
		const { download } = setDownload.mock.calls[0][0];
		expect(download).toBe(`doc2git-${docId}.zip`);

		expect(zipBlob).toBeDefined();

		const vol = new Volume();
		const fs = createFsFromVolume(vol);

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		await unzipFiles(fs, zipBlob!);

		const commits = await log({ fs, dir: '/' });
		expect(commits).toHaveLength(revs.length);

		let i = revs.length;
		for (const { commit } of commits) {
			const rev = revs[--i];

			expect(commit.author.timestamp * 1000).toEqual(
				Date.parse(rev.modifiedTime === undefined ? '' : rev.modifiedTime),
			);

			expect(commit.author.name).toBe(rev.lastModifyingUser?.displayName);
			expect(commit.author.email).toBe(rev.lastModifyingUser?.emailAddress);

			await checkout({ fs, dir: '/', ref: commit.tree });

			const content = await fs.promises.readFile('/doc.txt', 'utf8');
			expect(content).toBe(rev.content);
		}

		await act(async () => {
			const results = await axe(container);
			expect(results).toHaveNoViolations();
		});
	});
});
