import { useEffect, useRef, useState } from "react";
import { FiX } from "react-icons/fi";
import "../styles/Modal.css";

const Modal = ({ isOpen, onClose, title, children }) => {
	const modalRef = useRef(null);
	const closeButtonRef = useRef(null);
	const [isClosing, setIsClosing] = useState(false);

	// Handle close with animation
	const handleClose = () => {
		setIsClosing(true);
		setTimeout(() => {
			setIsClosing(false);
			onClose();
		}, 200); // Match this with the animation duration in CSS
	};

	// Prevent scrolling when modal is open
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
			// Focus the close button when modal opens
			setTimeout(() => {
				closeButtonRef.current?.focus();
			}, 100);
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
				handleClose();
			}
		};

		document.addEventListener("keydown", handleEscKey);
		return () => {
			document.removeEventListener("keydown", handleEscKey);
		};
	}, [isOpen]);

	// Handle click outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (modalRef.current && !modalRef.current.contains(event.target)) {
				handleClose();
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
	}, [isOpen]);

	// Handle tab trap inside modal
	useEffect(() => {
		const handleTabKey = (event) => {
			if (!isOpen || !modalRef.current) return;

			const focusableElements = modalRef.current.querySelectorAll(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			);

			if (focusableElements.length === 0) return;

			const firstElement = focusableElements[0];
			const lastElement = focusableElements[focusableElements.length - 1];

			// If shift+tab and focus is on first element, move to last element
			if (
				event.key === "Tab" &&
				event.shiftKey &&
				document.activeElement === firstElement
			) {
				event.preventDefault();
				lastElement.focus();
			}

			// If tab and focus is on last element, move to first element
			if (
				event.key === "Tab" &&
				!event.shiftKey &&
				document.activeElement === lastElement
			) {
				event.preventDefault();
				firstElement.focus();
			}
		};

		document.addEventListener("keydown", handleTabKey);
		return () => {
			document.removeEventListener("keydown", handleTabKey);
		};
	}, [isOpen]);

	if (!isOpen && !isClosing) return null;

	return (
		<div
			className={`modal-overlay ${isClosing ? "closing" : ""}`}
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title">
			<div className="modal-content" ref={modalRef} tabIndex="-1">
				<div className="modal-header">
					<h2 id="modal-title">{title}</h2>
					<button
						className="modal-close"
						onClick={handleClose}
						ref={closeButtonRef}
						aria-label="Close modal">
						<FiX />
					</button>
				</div>
				<div className="modal-body">{children}</div>
			</div>
		</div>
	);
};

export default Modal;
