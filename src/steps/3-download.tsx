import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import { createRef, FunctionComponent, MutableRefObject } from 'react';

import Step, { Download, Progress } from '@/components/step';

import styles from '@/styles/step.module.css';

export interface Step3DownloadProps {
	download?: Download;
	progress: Progress;
	error: string;
	setError: (error: string) => void;
	back: () => void;
}

const Step3Download: FunctionComponent<Step3DownloadProps> = ({
	download,
	progress,
	error,
	setError,
	back,
}) => (
	<Step
		download={download}
		actionLabel="Download"
		actionLoading={progress.percent !== 100}
		error={error}
		setError={setError}
		back={back}>
		<Typography className={styles.status}>{progress.status}</Typography>
		<LinearProgress variant="determinate" value={progress.percent} />
	</Step>
);

export default Step3Download;
