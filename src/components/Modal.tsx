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
			<div className={styles.modalBackground} onClick={onClose} />
			<div className={styles.modal} onClick={(e) => e.stopPropagation()}>
				{children}
			</div>
		</>,
		document.getElementById('portal')!
	);
}

export default Modal;
