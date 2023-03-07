import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { ReactNode } from 'react';

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
	['aria-busy']?: boolean;
	['aria-describedby']?: string;
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

const Step = ({
	children,
	action,
	actionLabel,
	actionLoading,
	actionShow,
	download,
	error,
	setError,
	back,
}: StepProps): JSX.Element => {
	const actionProps: ActionProps = {};
	if (action !== undefined) {
		actionProps.onClick = async (): Promise<void> => {
			setError('');
			await action();
		};
	} else if (download !== undefined) {
		actionProps.download = download.download;
		actionProps.href = download.href;
	}

	if (actionLoading) {
		actionProps['aria-busy'] = true;
		actionProps['aria-describedby'] = 'progress';
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
						{actionLabel}
					</Button>
				) : undefined}
				{back !== undefined ? <Button onClick={back}>Back</Button> : undefined}
			</div>
		</>
	);
};

export default Step;
