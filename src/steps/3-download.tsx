import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

import Step, { Download, Progress } from '@/components/Step';
import styles from '@/styles/step.module.css';

export interface Step3DownloadProps {
	download?: Download;
	progress: Progress;
	error: string;
	setError: (error: string) => void;
	back: () => void;
}

const Step3Download = ({
	download,
	progress,
	error,
	setError,
	back,
}: Step3DownloadProps): JSX.Element => (
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
