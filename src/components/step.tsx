import clsx from 'clsx';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { FunctionComponent, ReactNode } from 'react';

import styles from '@/styles/step.module.css';

export interface Progress {
	percent: number;
	status: string;
}

export interface Download {
	download?: string;
	href?: string;
}

export interface ActionProps extends Download {
	onClick?: () => Promise<void>;
}

export interface StepProps {
	children: ReactNode;
	action?: () => Promise<void>;
	actionLabel?: string;
	actionLoading?: boolean;
	actionShow?: () => boolean;
	download?: Download;
	error?: string;
	setError: (error: string) => void;
	back?: () => void;
}

const Step: FunctionComponent<StepProps> = ({
	children,
	action,
	actionLabel,
	actionLoading,
	actionShow,
	download,
	error,
	setError,
	back,
}) => {
	const actionProps: ActionProps = {};
	if (action !== undefined) {
		actionProps.onClick = async () => {
			setError('');
			await action!!();
		};
	} else if (download !== undefined) {
		actionProps.download = download.download;
		actionProps.href = download.href;
	}

	return (
		<>
			{children}
			{error ? (
				<Alert severity="error" classes={{ icon: styles.alertIcon }}>
					{error}
				</Alert>
			) : undefined}
			<div className={styles.actions}>
				{!actionShow || actionShow() ? (
					<Button variant="contained" disabled={actionLoading} {...actionProps}>
						{actionLoading ? (
							<CircularProgress size="1rem" className={styles.progress} />
						) : (
							actionLabel
						)}
					</Button>
				) : undefined}
				{back !== undefined ? <Button onClick={back}>Back</Button> : undefined}
			</div>
		</>
	);
};

export default Step;
