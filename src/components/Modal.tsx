import React from 'react';
import { createPortal } from 'react-dom';
import styles from '../styles/modal.module.scss';

type Props = {
	children: React.ReactNode;
	open: boolean;
	onClose: () => void;
};

function Modal({ children, open, onClose }: Props) {
	if (!open) return null;

	return createPortal(
		<>
			<div className={styles.modalBackground} />
			<div className={styles.modal}>
				{children}
				<button onClick={onClose}>close</button>
			</div>
		</>,
		document.getElementById('portal')!
	);
}

export default Modal;
