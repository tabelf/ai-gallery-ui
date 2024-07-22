import {Tag} from "antd";
import React from "react";

interface ITagButtonProps {
    color: string; // 标签颜色
    onClick?: () => void; // 可选的点击事件处理器
    children: React.ReactNode; // 或者更具体一点，可以是string
}

const customTagButtonStyles = {
    "-webkit-user-select": "none",
    "-moz-user-select": "none",
    "-ms-user-select": "none",
    "user-select": "none",
    "cursor": "pointer",
};

function TagButton(p: ITagButtonProps) {
    return (
        <Tag color={p.color}
             onClick={p.onClick}
             style={customTagButtonStyles}>
            {p.children}
        </Tag>
    );
}

export default TagButton;
