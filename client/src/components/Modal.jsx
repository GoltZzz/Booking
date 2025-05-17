import { useEffect, useRef } from "react";
import "../styles/Modal.css";

const Modal = ({ isOpen, onClose, title, children }) => {
	const modalRef = useRef(null);

	// Prevent scrolling when modal is open
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}

		return () => {
			document.body.style.overflow = "auto";
		};
	}, [isOpen]);

	// Close modal on escape key
	useEffect(() => {
		const handleEscKey = (event) => {
			if (event.key === "Escape" && isOpen) {
				onClose();
			}
		};

		document.addEventListener("keydown", handleEscKey);
		return () => {
			document.removeEventListener("keydown", handleEscKey);
		};
	}, [isOpen, onClose]);

	// Handle click outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (modalRef.current && !modalRef.current.contains(event.target)) {
				onClose();
			}
		};

		if (isOpen) {
			setTimeout(() => {
				document.addEventListener("mousedown", handleClickOutside);
			}, 100); // Small delay to prevent immediate closing
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div className="modal-overlay">
			<div className="modal-content" ref={modalRef}>
				<div className="modal-header">
					<h2>{title}</h2>
					<button className="modal-close" onClick={onClose}>
						&times;
					</button>
				</div>
				<div className="modal-body">{children}</div>
			</div>
		</div>
	);
};

export default Modal;
