import { createElement } from 'react';
import { getModule } from '@/lib/module-registry/helpers';
import type { ModuleNode } from '@/types/layout';

export default function ViewModuleCard({
    module,
}: {
    module: ModuleNode;
}) {
    const RenderModule = getModule(module.moduleId);

    if (!RenderModule) {
        return null;
    }

    return createElement(RenderModule, {
        data: module.data,
        style: module.style,
    });
}
