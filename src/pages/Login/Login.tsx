import {Button, Card, Form, Input, message} from "antd";
import {IdcardFilled, UnlockFilled} from "@ant-design/icons";
import {isEmpty} from "@/utils/utils";
import {useDispatch} from "react-redux";
import {fetchLogin, getUserToken} from "@/store/modules/user";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

function Login() {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = getUserToken();
        if (!isEmpty(userInfo)) {
            navigate("/");
        }
    }, []);

    function handleUserLogin() {
        const data = form.getFieldsValue();
        if (handleValidate(data)) {
            dispatch(fetchLogin(data));
        }
    }

    function handleValidate(data) {
        if (isEmpty(data.username)) {
            message.error("用户名不能为空");
            return false;
        }
        if (isEmpty(data.password)) {
            message.error("密码不能为空");
            return false;
        }
        return true;
    }

    return (
        <div className={"login-container-layout"}>
            <div>
                <Card style={{width: 450}}>
                    <div className={"login-header"}>
                        <h2>账户登录</h2>
                    </div>
                    <Form className={"login-form"} form={form}>
                        <Form.Item name="username" wrapperCol={{span: 24}}>
                            <Input size="large" placeholder="请输入用户名" prefix={<IdcardFilled/>}/>
                        </Form.Item>
                        <Form.Item name="password" wrapperCol={{span: 24}}>
                            <Input.Password size="large" placeholder="请输入密码" prefix={<UnlockFilled/>}/>
                        </Form.Item>
                        <Form.Item wrapperCol={{span: 24}}>
                            <Button style={{marginTop: 15}} size="large" block type="primary"
                                    onClick={handleUserLogin}>
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </div>
    )
}

export default Login;
