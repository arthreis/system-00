import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export const ModalSys = ({visible, title, text, confirmAction, cancelAction, confirmLabel='Ok', cancelLabel='Cancelar'}) => {
  return (
    <Modal isOpen={visible} toggle={cancelAction} >
      <ModalHeader>{title}</ModalHeader>
      <ModalBody>
        {text}
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={confirmAction}>{confirmLabel}</Button>{' '}
        {
          cancelAction && (
            <Button color="secondary" onClick={cancelAction}>{cancelLabel}</Button>
          )
        }
      </ModalFooter>
    </Modal>
  )
}
