/**
 * 模組註冊表
 */

import {
    HeadingSimple,
    DEFAULT_HEADING_SIMPLE_DATA,
    DEFAULT_HEADING_SIMPLE_STYLE,
    HeadingDivided,
    DEFAULT_HEADING_DIVIDED_DATA,
    DEFAULT_HEADING_DIVIDED_STYLE,
} from '@/ui/modules/headings';
import {
    ImageSimple,
    DEFAULT_IMAGE_SIMPLE_DATA,
    DEFAULT_IMAGE_SIMPLE_STYLE,
} from '@/ui/modules/images';
import { CATEGORIES } from './categories';
import { MODULE_IDS } from './module-ids';
import type { ModuleRegistry } from '../../types/module-registry';

/**
 * 取得 moduleName
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getModuleName(module: React.ComponentType<any>): string {
    return module.displayName || module.name || 'unknown';
}

/**
 * 模組註冊表
 */
export const moduleRegistry: ModuleRegistry = {
    [MODULE_IDS.H01]: {
        moduleId: MODULE_IDS.H01,
        moduleName: getModuleName(HeadingSimple),
        module: HeadingSimple,
        category: CATEGORIES.HEADING,
        label: '基礎標題',
        icon: '📝',
        tags: ['標題', '大標題', 'heading', 'simple'],
        defaultData: DEFAULT_HEADING_SIMPLE_DATA,
        defaultStyle: DEFAULT_HEADING_SIMPLE_STYLE,
    },
    [MODULE_IDS.H02]: {
        moduleId: MODULE_IDS.H02,
        moduleName: getModuleName(HeadingDivided),
        module: HeadingDivided,
        category: CATEGORIES.HEADING,
        label: '帶裝飾標題',
        icon: '✨',
        tags: ['標題', '副標題', 'heading', 'divided', '裝飾'],
        defaultData: DEFAULT_HEADING_DIVIDED_DATA,
        defaultStyle: DEFAULT_HEADING_DIVIDED_STYLE,
    },
    [MODULE_IDS.I01]: {
        moduleId: MODULE_IDS.I01,
        moduleName: getModuleName(ImageSimple),
        module: ImageSimple,
        category: CATEGORIES.IMAGE,
        label: '基礎圖片',
        icon: '🖼️',
        tags: ['圖片', 'image', '媒體'],
        defaultData: DEFAULT_IMAGE_SIMPLE_DATA,
        defaultStyle: DEFAULT_IMAGE_SIMPLE_STYLE,
    },
} as const;
