import React from "react";

export interface ImageSimpleData {
    src: string;
    alt: string;
}

export interface ImageSimpleStyle {
    width?: string;
    height?: string;
    borderRadius?: string;
    objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
}

export interface ImageSimpleProps {
    data: ImageSimpleData;
    style?: ImageSimpleStyle;
}

// 匯出預設資料供後台使用
export const DEFAULT_IMAGE_SIMPLE_DATA: ImageSimpleData = {
    src: "https://picsum.photos/id/100/200/200.jpg",
    alt: "圖片",
};

export const DEFAULT_IMAGE_SIMPLE_STYLE: ImageSimpleStyle = {
    width: "100%",
    height: "auto",
    borderRadius: "8px",
    objectFit: "cover",
};

export function ImageSimple({ data, style }: ImageSimpleProps) {
    return (
        <img
            src={data.src}
            alt={data.alt}
            style={{
                width: style?.width || DEFAULT_IMAGE_SIMPLE_STYLE.width,
                height: style?.height || DEFAULT_IMAGE_SIMPLE_STYLE.height,
                borderRadius:
                    style?.borderRadius ||
                    DEFAULT_IMAGE_SIMPLE_STYLE.borderRadius,
                objectFit:
                    style?.objectFit || DEFAULT_IMAGE_SIMPLE_STYLE.objectFit,
            }}
        />
    );
}

export default ImageSimple;
