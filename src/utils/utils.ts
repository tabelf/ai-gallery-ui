import axios from "axios";
import {message} from "antd";
import {throttle} from "lodash-es";

export function isEmpty(data) {
    return data === null || data === undefined || data === '';
}

export const Cache = {
    /*
    * set 存储方法
    * @ param {String}     key 键
    * @ param {String}     value 值，
    * @ param {String}     expired 过期时间，以分钟为单位，非必须
    */
    set(key, val, expired) {
        if (typeof val !== 'string') {
            val = JSON.stringify(val);
        }
        window.localStorage.setItem(key, val);
        if (expired) {
            window.localStorage.setItem(`${key}__expires__`, `${Date.now() + 1000 * 60 * expired}`);
        }
    },

    /*
   * get 获取方法
   * @ param {String}     key 键
   * @ param {String}     expired 存储时为非必须字段，所以有可能取不到，默认为 Date.now+1
   */
    get(key) {
        const expired = window.localStorage.getItem(`${key}__expires__`) || Date.now + 1;
        const now = Date.now();

        if (now >= expired) {
            this.remove(key);
            return;
        }
        let val = window.localStorage.getItem(key);
        try {
            val = JSON.parse(val);
        } catch (e) {
            console.log(`${val} Unexpected token H in JSON at position 0`);
        }
        return val;
    },

    clear() {
        window.localStorage.clear();
    },
    /*
    * remove 移除
    * */
    remove(key) {
        if (window.localStorage.getItem(`${key}__expires__`)) {
            window.localStorage.removeItem(`${key}__expires__`);
        }

        if (window.localStorage.getItem(key)) {
            window.localStorage.removeItem(key);
        }
    }
};

export const downloadFile = (url) => {
    const fileName = url.substring(url.lastIndexOf('/') + 1);// 定义文件名
    axios({
        url: url,
        method: 'get',
        responseType: 'blob', // 将响应数据以二进制格式处理
    }).then(function (response) {
        const blob = new Blob([response.data]); // 创建一个Blob对象
        const url = window.URL.createObjectURL(blob); // 创建一个临时URL
        const link = document.createElement('a'); // 创建一个a标签
        link.href = url; // 设置a标签的href属性为临时URL
        link.setAttribute('download', fileName); // 设置a标签的download属性为文件名
        document.body.appendChild(link); // 将a标签添加到body中
        link.click(); // 模拟点击链接进行下载
        document.body.removeChild(link); // 下载完成后删除a标签
    }).catch((error) => {
        console.log(error);
    });
};

export function getGenerateCategory(category: string, language): string {
    if (category === 'txt2img') {
        return (language === 'en' ? category : "文生图");
    } else if (category === "img2img") {
        return (language === 'en' ? category : "图生图");
    }
    return (language === 'en' ? 'txt2img' : "文生图");
}

export function getEmpty(value, language): string {
    return isEmpty(value) ? (language === 'en' ? "null" : "空") : value;
}

export function isDeepEqual(obj1, obj2) {
    if (obj1 === obj2) {
        // 如果两个引用相同，直接返回true
        return true;
    }

    if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 == null || obj2 == null) {
        // 如果任一参数不是对象或者为null，比较它们的值
        return obj1 === obj2;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
        // 如果键的数量不同，直接返回false
        return false;
    }

    for (let key of keys1) {
        if (!keys2.includes(key) || !isDeepEqual(obj1[key], obj2[key])) {
            // 如果键不匹配或对应的值不相等，返回false
            return false;
        }
    }

    return true;
}

const handleErr = throttle((data) => {
    if (isEmpty(data)) {
        message.error("操作失败");
    } else if (data.hasOwnProperty('code')) {
        message.error("操作失败，" + data.code + " : " + data.desc);
    } else {
        message.error("操作失败，" + data);
    }
}, 3000, {trailing: false});

const handleEnErr = throttle((data) => {
    if (isEmpty(data)) {
        message.error("error");
    } else if (data.hasOwnProperty('code')) {
        message.error("error，" + data.code + " : " + data.message);
    } else {
        message.error("error，" + data);
    }
}, 3000, {trailing: false});

export function errors(data) {
    const locale = localStorage.getItem('selectedLocale');
    if (locale == 'zh') {
        return handleErr(data);
    }
    return handleEnErr(data);
}
