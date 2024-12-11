import { forwardRef } from "react";
import './Confirm.css';

interface Props {
  onConfirm: (confirm: boolean) => void;
  text: string;
  okLabel: string;
  cancelLabel: string;
}

const Confirm = forwardRef<HTMLDialogElement, Props>(
  function ({ onConfirm, text, okLabel, cancelLabel }, ref) {
    return (
      <dialog ref={ref} onClose={(event) => onConfirm(JSON.parse(event.currentTarget.returnValue))}>
        <p>{text}</p>
        <form method="dialog">
          <button value="true">{okLabel}</button>
          <button value="false">{cancelLabel}</button>
        </form>
      </dialog>
    );
  }
);

export default Confirm;