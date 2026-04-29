import React from "react";
import { cn } from "@/lib/cn";

export interface HeadingDividedData {
    title: string;
    description?: string;
    level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export interface HeadingDividedStyle {
    underline?: boolean;
}

export interface HeadingDividedProps {
    data: HeadingDividedData;
    style?: HeadingDividedStyle;
}

// 匯出預設資料供後台使用
export const DEFAULT_HEADING_DIVIDED_DATA: HeadingDividedData = {
    title: "請輸入標題文字",
    description: "請輸入說明文字",
    level: "h2",
};

export const DEFAULT_HEADING_DIVIDED_STYLE: HeadingDividedStyle = {
    underline: true,
};

export function HeadingDivided({ data, style }: HeadingDividedProps) {
    const { title, description, level } = data;
    const underline = style?.underline ?? true;

    const Tag = level as React.ElementType;

    return (
        <div
            className={cn(
                "flex pt-4 pl-3 relative isolate",
                "before:content-[''] before:absolute before:top-0 before:left-0 before:size-9 before:bg-[#FFE0E0] before:rounded-full before:-z-10",
                underline && "border-b",
            )}
        >
            <Tag
                className="flex items-center gap-3 text-3xl text-[#222] relative z-10"
                style={{ margin: 0 }}
            >
                <span>{title}</span>
            </Tag>
            {description && (
                <div className="flex items-center relative z-10">
                    <span className="text-3xl text-[#222] mx-4">/</span>
                    <span className="text-lg text-[#222]">{description}</span>
                </div>
            )}
        </div>
    );
}

export default HeadingDivided;
