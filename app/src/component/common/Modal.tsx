import {useState} from 'react';
import Button from 'react-bootstrap/Button';
import BSModal from 'react-bootstrap/Modal';

interface ModalProps extends React.DetailedHTMLProps<
React.HTMLAttributes<HTMLElement>,
HTMLElement
> {
    title: string;
    submitLabel: string;
    cancelLabel: string;
    isDisplay: boolean;
    isForm: boolean;
    showSubmitBtn: boolean;
    mysize: "lg" | "xl" | "sm";
    onClickClose: (bol: boolean) => void;
    onClickSubmit?: () => void;
}

const Modal = ({title, submitLabel, cancelLabel, isDisplay, children, isForm, showSubmitBtn, mysize, onClickClose, onClickSubmit}: ModalProps) => {
  return (
        <BSModal 
          show={isDisplay} 
          onHide={() => onClickClose(false)}
          size={mysize}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <BSModal.Header closeButton>
            <BSModal.Title>{title}</BSModal.Title>
          </BSModal.Header>
          <BSModal.Body>
            {children}
          </BSModal.Body>
          {!isForm && (
            <BSModal.Footer>
              <Button variant="secondary" onClick={() => onClickClose(false)}>
                {cancelLabel ? cancelLabel : "Close"}
              </Button>
              {showSubmitBtn ? 
              <Button variant="primary" onClick={onClickSubmit}>
                {submitLabel ? submitLabel : "Submit"}
              </Button> : null}
              
            </BSModal.Footer>
          )}
        </BSModal>
  )
}

export default Modal;