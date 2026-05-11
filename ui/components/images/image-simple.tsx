import Image from 'next/image'

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
    src: "/default.png",
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
        <div
            style={{
                position: "relative",
            }}
        >
            <Image
                src={data.src}
                alt={data.alt}
                width={200}
                height={200}
                unoptimized // 跳過優化和網域檢查
                style={{
                    width: "100%",
                    height: style?.height || DEFAULT_IMAGE_SIMPLE_STYLE.height,
                    borderRadius:
                        style?.borderRadius ||
                        DEFAULT_IMAGE_SIMPLE_STYLE.borderRadius,
                    objectFit:
                        style?.objectFit ||
                        DEFAULT_IMAGE_SIMPLE_STYLE.objectFit,
                }}
            />
        </div>
    );
}

ImageSimple.displayName = 'image-simple';

export default ImageSimple;
