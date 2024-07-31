import {Affix, Button, Card, Form, Input, message} from "antd";
import {IdcardFilled, UnlockFilled} from "@ant-design/icons";
import {isEmpty} from "@/utils/utils";
import {useDispatch} from "react-redux";
import {fetchLogin, getUserToken} from "@/store/modules/user";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import Language from "@/components/Language";
import {useTranslation} from "react-i18next";

function Login() {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();

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
            message.error(t('login.username_require'));
            return false;
        }
        if (isEmpty(data.password)) {
            message.error(t('login.password_require'));
            return false;
        }
        return true;
    }

    return (
        <div>
            <div className={"language-container"}>
                <Language />
            </div>
            <div className={"login-container-layout"}>
                <div>
                    <Card style={{width: 450}}>
                        <div className={"login-header"}>
                            <h2>{t('login.account_login')}</h2>
                        </div>
                        <Form className={"login-form"} form={form}>
                            <Form.Item name="username" wrapperCol={{span: 24}}>
                                <Input size="large" placeholder={t('login.username_placeholder')} prefix={<IdcardFilled/>}/>
                            </Form.Item>
                            <Form.Item name="password" wrapperCol={{span: 24}}>
                                <Input.Password size="large" placeholder={t('login.password_placeholder')} prefix={<UnlockFilled/>}/>
                            </Form.Item>
                            <Form.Item wrapperCol={{span: 24}}>
                                <Button style={{marginTop: 15}} size="large" block type="primary"
                                        onClick={handleUserLogin}>
                                    {t('login.login')}
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default Login;
