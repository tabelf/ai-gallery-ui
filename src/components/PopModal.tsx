import React, {useImperativeHandle, useState} from "react";
import {Modal} from "antd";

interface IPopModalProps {
    title: string
    width: number,
    footer?: React.ReactNode,
    children?: React.ReactNode
    onOk?: () => void
    onCancel?: () => void
}

const PopModal = React.forwardRef((props: IPopModalProps, ref) => {
    const [open, setOpen] = useState(false);

    useImperativeHandle(ref, () => ({
        showOpen: () => {
            setOpen(true);
        }
    }));

    function handleOnCancel() {
        if (props.onCancel) {
            props.onCancel();
        }
        setOpen(false);
    }

    function handleOnOk() {
        if (props.onOk) {
            props.onOk();
        }
        setOpen(false);
    }

    return (
        <Modal title={props.title}
               open={open}
               onOk={handleOnOk}
               okText={"确定"}
               cancelText={"取消"}
               width={props.width}
               footer={props.footer}
               onCancel={handleOnCancel}>
            {props.children}
        </Modal>
    );
});

export default PopModal;
