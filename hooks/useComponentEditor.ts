import { useCallback, useState } from 'react';
import type { ComponentNode, NestedLayout } from '@/types/layout';
import { isLayoutNode } from '@/types/layout';
import { findNodeById, mapLayouts } from '@/lib/page';
import type { LoggedSetLayouts } from './useLayoutEditor';

interface UseComponentEditorProps {
    layouts: NestedLayout[];
    setLayouts: LoggedSetLayouts;
}

export function useComponentEditor({
    layouts,
    setLayouts,
}: UseComponentEditorProps) {
    const [selectedComponentId, setSelectedComponentId] = useState<
        string | null
    >(null);

    const selectedComponent = selectedComponentId
        ? (findNodeById(selectedComponentId, layouts) as ComponentNode | null)
        : null;

    const handleSelectComponent = useCallback((id: string) => {
        setSelectedComponentId(prev => (prev === id ? null : id));
    }, []);

    const deselectComponent = useCallback(() => {
        setSelectedComponentId(null);
    }, []);

    const handleUpdateComponentData = useCallback(
        (componentId: string, data: Record<string, unknown>) => {
            setLayouts(
                prev =>
                    mapLayouts(prev, l => ({
                        ...l,
                        slots: l.slots.map(s => ({
                            ...s,
                            children: s.children.map(c =>
                                c.id === componentId && !isLayoutNode(c)
                                    ? { ...c, data }
                                    : c,
                            ),
                        })),
                    })),
                'update-component',
                '編輯 Component 內容',
                false,
                { componentId, data },
            );
        },
        [setLayouts],
    );

    const handleUpdateComponentStyle = useCallback(
        (componentId: string, style: Record<string, unknown>) => {
            setLayouts(
                prev =>
                    mapLayouts(prev, l => ({
                        ...l,
                        slots: l.slots.map(s => ({
                            ...s,
                            children: s.children.map(c =>
                                c.id === componentId && !isLayoutNode(c)
                                    ? { ...c, style }
                                    : c,
                            ),
                        })),
                    })),
                'update-component',
                '編輯 Component 樣式',
                false,
                { componentId, style },
            );
        },
        [setLayouts],
    );

    return {
        selectedComponentId,
        selectedComponent,
        handleSelectComponent,
        handleUpdateComponentData,
        handleUpdateComponentStyle,
        deselectComponent,
    };
}
