import React from "react";
import Modal from "./Modal";
import Button from "./Button";
import { FiLogOut, FiLoader } from "react-icons/fi";

const LogoutConfirmationModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Confirm Logout">
			<div className="p-4">
				<div className="flex items-center justify-center mb-6">
					<div className="bg-red-100 dark:bg-red-900 dark:bg-opacity-30 p-4 rounded-full">
						<FiLogOut className="text-red-500 dark:text-red-400 text-xl" />
					</div>
				</div>

				<h3 className="text-lg font-medium text-center mb-2">
					Are you sure you want to log out?
				</h3>

				<p className="text-gray-600 dark:text-gray-400 text-center mb-6">
					You will need to sign in again to access your account.
				</p>

				<div className="flex space-x-3">
					<Button
						variant="outline"
						fullWidth
						onClick={onClose}
						disabled={isLoading}>
						Cancel
					</Button>

					<Button
						variant="danger"
						fullWidth
						onClick={onConfirm}
						loading={isLoading}
						disabled={isLoading}
						icon={
							isLoading ? <FiLoader className="animate-spin" /> : <FiLogOut />
						}>
						{isLoading ? "Logging out..." : "Logout"}
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default LogoutConfirmationModal;
