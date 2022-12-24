import React from 'react';
import { createPortal } from 'react-dom';
import styles from '../styles/modal.module.scss';

type Props = {
	open: boolean;
	onClose: () => void;
};

function Modal({ open, onClose }: Props) {
	if (!open) return null;

	return createPortal(
		<>
			<div className={styles.modalBackground} />
			<div className={styles.modal}>
				<p>Modal info here</p>
				<button onClick={onClose}>close</button>
			</div>
		</>,
		document.getElementById('portal')!
	);
}

export default Modal;
