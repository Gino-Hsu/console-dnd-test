/**
 * 元件註冊表
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
import { COMPONENT_IDS } from "./component-ids";
import type { ComponentRegistry } from "../../types/component-registry";

/**
 * 取得 componentName
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getComponentName(component: React.ComponentType<any>): string {
    return component.displayName || component.name || 'unknown';
}

/**
 * 元件註冊表
 */
export const componentRegistry: ComponentRegistry = {
    [COMPONENT_IDS.H01]: {
        componentId: COMPONENT_IDS.H01,
        componentName: getComponentName(HeadingSimple),
        component: HeadingSimple,
        category: CATEGORIES.HEADING,
        label: "基礎標題",
        icon: "📝",
        tags: ["標題", "大標題", "heading", "simple"],
        defaultData: DEFAULT_HEADING_SIMPLE_DATA,
        defaultStyle: DEFAULT_HEADING_SIMPLE_STYLE,
    },
    [COMPONENT_IDS.H02]: {
        componentId: COMPONENT_IDS.H02,
        componentName: getComponentName(HeadingDivided),
        component: HeadingDivided,
        category: CATEGORIES.HEADING,
        label: "帶裝飾標題",
        icon: "✨",
        tags: ["標題", "副標題", "heading", "divided", "裝飾"],
        defaultData: DEFAULT_HEADING_DIVIDED_DATA,
        defaultStyle: DEFAULT_HEADING_DIVIDED_STYLE,
    },
    [COMPONENT_IDS.I01]: {
        componentId: COMPONENT_IDS.I01,
        componentName: getComponentName(ImageSimple),
        component: ImageSimple,
        category: CATEGORIES.IMAGE,
        label: "基礎圖片",
        icon: "🖼️",
        tags: ["圖片", "image", "媒體"],
        defaultData: DEFAULT_IMAGE_SIMPLE_DATA,
        defaultStyle: DEFAULT_IMAGE_SIMPLE_STYLE,
    },
} as const;
