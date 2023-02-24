import clsx from 'clsx';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Link from 'next/link';
import { FunctionComponent, useContext, useRef, useState } from 'react';

import { AuthInfo } from '@/components/gsi-button';
import { GoogleContext } from '@/contexts/google';
import { Download, Progress } from '@/components/step';
import Step1SignIn, { Step1SignInProps } from '@/steps/1-sign-in';
import Step2Generate, { Step2GenerateProps } from '@/steps/2-generate';
import Step3Download, { Step3DownloadProps } from '@/steps/3-download';

import styles from '@/styles/index.module.css';

export default function Index() {
	const [authInfo, setAuthInfo] = useState<AuthInfo>();
	const [googleReady, setGoogleReady] = useState(Promise.resolve(false));
	const [docUrl, setDocUrl] = useState('');
	const [error, setError] = useState('');
	const [actionLoading, setActionLoading] = useState(false);
	const [tokenClient, setTokenClient] = useState<
		google.accounts.oauth2.TokenClient | undefined
	>();
	const tokenCallback =
		useRef<(resp: google.accounts.oauth2.TokenResponse) => void>();
	const [progress, setProgress] = useState<Progress>({
		percent: 0,
		status: 'Fetching doc revisions',
	});
	const [download, setDownload] = useState<Download>();

	const [stepIndex, setStepIndex] = useState(0);
	const back = () => {
		setStepIndex(stepIndex - 1);
		setError('');
		setDownload(undefined);
	};
	const next = async () => {
		setStepIndex(stepIndex + 1);
	};

	const steps = [
		{
			title: 'Sign in with Google',
			content: (
				<Step1SignIn
					authInfo={authInfo}
					setAuthInfo={setAuthInfo}
					setGoogleReady={setGoogleReady}
					error={error}
					setError={setError}
					setTokenClient={setTokenClient}
					tokenCallback={tokenCallback}
					next={next}
				/>
			),
		},
		{
			title: 'Enter the Google Doc URL or ID',
			content: (
				<Step2Generate
					docUrl={docUrl}
					setDocUrl={setDocUrl}
					actionLoading={actionLoading}
					setActionLoading={setActionLoading}
					error={error}
					setError={setError}
					setDownload={setDownload}
					googleReady={googleReady}
					setProgress={setProgress}
					tokenClient={tokenClient}
					tokenCallback={tokenCallback}
					next={next}
					back={back}
				/>
			),
		},
		{
			title: 'Download the repo',
			content: (
				<Step3Download
					download={download}
					progress={progress}
					error={error}
					setError={setError}
					back={back}
				/>
			),
		},
	];

	return (
		<>
			<Typography className={styles.intro}>
				Google Docs keeps a detailed history of each doc, which tracks the
				changes and can restore previous versions later, just like Git.
			</Typography>
			<Typography className={styles.intro}>
				doc2git lets you create an actual Git repo from this history, with a
				plain text version of your doc and a commit for each revision with the
				correct time and author.
			</Typography>
			<Typography className={styles.intro}>
				With the Git repo, you can use all your usual tools to examine the doc
				history, including <span className={styles.code}>git blame</span>.
			</Typography>
			<Typography className={styles.intro}>
				It all runs securely in your browser. Even the Git repo is created
				client-side using{' '}
				<Link
					href="https://github.com/isomorphic-git/isomorphic-git"
					target="_blank">
					isomorphic-git
				</Link>{' '}
				and delivered as a .zip file you can download.
			</Typography>
			<Typography className={styles.intro}>
				You can check out the code of{' '}
				<Link href="https://github.com/repography/doc2git" target="_blank">
					doc2git on GitHub
				</Link>
				, including instructions on how to host doc2git yourself.
			</Typography>
			<Paper elevation={3} className={styles.steps}>
				<Stepper orientation="vertical" activeStep={stepIndex}>
					{steps.map(({ title, content }, i) => (
						<Step key={i}>
							<StepLabel className={styles.stepTitle}>{title}</StepLabel>
							<StepContent
								className={clsx({ [styles.stepContent]: i === stepIndex })}>
								{content}
							</StepContent>
						</Step>
					))}
				</Stepper>
			</Paper>
		</>
	);
}
