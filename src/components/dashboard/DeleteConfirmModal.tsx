import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  blogTitle?: string;
  isLoading?: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  blogTitle,
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900">Delete Story?</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Are you sure you want to delete <strong className="text-slate-800">"{blogTitle || 'this story'}"</strong>? This action cannot be undone.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full pt-2">
          <Button
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={onConfirm}
            isLoading={isLoading}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};
