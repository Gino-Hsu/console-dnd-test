import { createElement } from 'react';
import { getComponent } from '@/lib/component-registry/helpers';
import type { ComponentNode } from '@/types/layout';

export default function ViewComponentCard({
    component,
}: {
    component: ComponentNode;
}) {
    const RenderComponent = getComponent(component.componentId);

    if (!RenderComponent) {
        // 前台靜默處理未知元件
        return null;
    }

    return createElement(RenderComponent, {
        data: component.data,
        style: component.style,
    });
}
