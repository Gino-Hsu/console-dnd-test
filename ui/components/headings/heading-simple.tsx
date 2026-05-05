import React from "react";

export interface HeadingSimpleData {
    title: string;
    level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export interface HeadingSimpleStyle {
    align?: "left" | "center" | "right";
    color?: string;
    fontSize?: number;
    fontWeight?: string | number;
}

export interface HeadingSimpleProps {
    data: HeadingSimpleData;
    style?: HeadingSimpleStyle;
}

// 匯出預設資料供後台使用
export const DEFAULT_HEADING_SIMPLE_DATA: HeadingSimpleData = {
    title: "請輸入標題文字",
    level: "h2",
};

export const DEFAULT_HEADING_SIMPLE_STYLE: HeadingSimpleStyle = {
    align: "left",
    color: "#000000",
    fontSize: 24,
    fontWeight: "normal",
};

export function HeadingSimple({ data, style }: HeadingSimpleProps) {
    const { title, level } = data;
    const Tag = level as React.ElementType;

    const baseStyles: React.CSSProperties = {
        textAlign: style?.align,
        color: style?.color,
        fontSize: style?.fontSize ? `${style.fontSize}px` : undefined,
        fontWeight: style?.fontWeight,
    };

    return <Tag style={baseStyles}>{title}</Tag>;
}

HeadingSimple.displayName = 'heading-simple';

export default HeadingSimple;
