import { useCallback, useState } from "react";
import { Modal } from "~/components/modal";

type TextAreaProps = React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>;

export const PopoutTextarea = ({
  id,
  name,
  defaultValue,
  ...props
}: TextAreaProps) => {
  const [show, setShow] = useState(false);
  const [internalValue, setInteralValue] = useState(defaultValue ?? "");

  const handleShow = useCallback(() => {
    setTimeout(() => {
      setShow(true);
    }, 100);
  }, [setShow]);

  const handleClose = useCallback(() => {
    console.log("close");
    setShow(false);
  }, [setShow]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInteralValue(e.target.value);
    },
    [setInteralValue],
  );

  return (
    <>
      <textarea
        id={id}
        name={name}
        value={internalValue}
        onChange={() => undefined}
        className="hidden"
      />
      <button onClick={handleShow}>Edit</button>
      <Modal show={show} onClose={handleClose}>
        <textarea value={internalValue} onChange={handleChange} {...props} />
      </Modal>
    </>
  );
};
