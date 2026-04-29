/**
 * 組件模組註冊表
 */

import {
    HeadingSimple,
    DEFAULT_HEADING_SIMPLE_DATA,
    DEFAULT_HEADING_SIMPLE_STYLE,
    HeadingDivided,
    DEFAULT_HEADING_DIVIDED_DATA,
    DEFAULT_HEADING_DIVIDED_STYLE,
} from "@/ui/components/headings";
import {
    ImageSimple,
    DEFAULT_IMAGE_SIMPLE_DATA,
    DEFAULT_IMAGE_SIMPLE_STYLE,
} from "@/ui/components/images";
import { CATEGORIES } from "./categories";
import type { ModuleRegistry } from "../../types/component-registry";

/**
 * 組件註冊表
 */
export const componentRegistry: ModuleRegistry = {
    H01: {
        id: "H01",
        component: HeadingSimple,
        category: CATEGORIES.HEADING,
        label: "基礎標題",
        icon: "📝",
        tags: ["標題", "大標題", "heading", "simple"],
        defaultData: DEFAULT_HEADING_SIMPLE_DATA,
        defaultStyle: DEFAULT_HEADING_SIMPLE_STYLE,
    },
    H02: {
        id: "H02",
        component: HeadingDivided,
        category: CATEGORIES.HEADING,
        label: "帶裝飾標題",
        icon: "✨",
        tags: ["標題", "副標題", "heading", "divided", "裝飾"],
        defaultData: DEFAULT_HEADING_DIVIDED_DATA,
        defaultStyle: DEFAULT_HEADING_DIVIDED_STYLE,
    },
    I01: {
        id: "I01",
        component: ImageSimple,
        category: CATEGORIES.IMAGE,
        label: "基礎圖片",
        icon: "🖼️",
        tags: ["圖片", "image", "媒體"],
        defaultData: DEFAULT_IMAGE_SIMPLE_DATA,
        defaultStyle: DEFAULT_IMAGE_SIMPLE_STYLE,
    },
};
