import { useCallback, useState } from 'react';
import type { ModuleNode, NestedLayout } from '@/types/layout';
import { isLayoutNode } from '@/types/layout';
import { findNodeById, mapLayouts } from '@/lib/page';
import type { LoggedSetLayouts } from './useLayoutEditor';

interface UseModuleEditorProps {
    layouts: NestedLayout[];
    setLayouts: LoggedSetLayouts;
}

export function useModuleEditor({
    layouts,
    setLayouts,
}: UseModuleEditorProps) {
    const [selectedModuleId, setSelectedModuleId] = useState<
        string | null
    >(null);

    const selectedModule = selectedModuleId
        ? (findNodeById(selectedModuleId, layouts) as ModuleNode | null)
        : null;

    const handleSelectModule = useCallback((id: string) => {
        setSelectedModuleId(prev => (prev === id ? null : id));
    }, []);

    const deselectModule = useCallback(() => {
        setSelectedModuleId(null);
    }, []);

    const handleUpdateModuleData = useCallback(
        (moduleId: string, data: Record<string, unknown>) => {
            setLayouts(
                prev =>
                    mapLayouts(prev, l => ({
                        ...l,
                        slots: l.slots.map(s => ({
                            ...s,
                            children: s.children.map(c =>
                                c.id === moduleId && !isLayoutNode(c)
                                    ? { ...c, data }
                                    : c,
                            ),
                        })),
                    })),
                'edit-module',
                '編輯 Module 內容',
            );
        },
        [setLayouts],
    );

    const handleUpdateModuleStyle = useCallback(
        (moduleId: string, style: Record<string, unknown>) => {
            setLayouts(
                prev =>
                    mapLayouts(prev, l => ({
                        ...l,
                        slots: l.slots.map(s => ({
                            ...s,
                            children: s.children.map(c =>
                                c.id === moduleId && !isLayoutNode(c)
                                    ? { ...c, style }
                                    : c,
                            ),
                        })),
                    })),
                'edit-module',
                '編輯 Module 樣式',
            );
        },
        [setLayouts],
    );

    return {
        selectedModuleId,
        selectedModule,
        handleSelectModule,
        handleUpdateModuleData,
        handleUpdateModuleStyle,
        deselectModule,
    };
}
