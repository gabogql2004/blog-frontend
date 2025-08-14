import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

export default function ToastMessage({ show, onClose, message, variant = 'success' }) {
  return (
    <ToastContainer position="top-end" className="p-3">
      <Toast bg={variant} onClose={onClose} show={show} delay={2500} autohide>
        <Toast.Body className="text-white">{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
