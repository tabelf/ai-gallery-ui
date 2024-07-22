import {Form} from "antd";

function useForm(initFunc: () => void) {
    const [form] = Form.useForm();
    let timer;

    function handleFormValueChange() {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            initFunc();
        }, 300);
    }

    return {form, handleFormValueChange};
}

export default useForm;
