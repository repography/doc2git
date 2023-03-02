import Typography from '@mui/material/Typography';
import Link from 'next/link';

import styles from '@/styles/terms.module.css';

export default function Terms(): JSX.Element {
	return (
		<div className={styles.terms}>
			<Typography>
				This page (together with our <Link href="/privacy">privacy policy</Link>
				) describes the terms and conditions under which you may use this
				website.
			</Typography>
			<Typography>
				doc2git is a project by{' '}
				<Link href="https://repography.com">Repography</Link>, which is operated
				by Bobinette SAS, a company registered in France under company
				registration number 919 609 446 R.C.S. Romans. Our registered address
				(siège social) is 88 Avenue de la Résistance, 26110
				Mirabel-aux-Baronnies, France.
			</Typography>
			<Typography>
				You can contact us via email using the address hello@repography.com.
			</Typography>
			<Typography>
				By using doc2git, you warrant that you have the right to process and
				duplicate any Google Docs which you process.
			</Typography>
			<Typography>
				We do not authorise the use of automated security testing against
				doc2git, Repography, our hosting providers or partners.
			</Typography>
			<Typography>
				If you find a security vulnerability impacting doc2git please inform us
				immediately at security@repography.com.
			</Typography>
		</div>
	);
}
