import { useCallback, useState } from 'react';
import type { ComponentNode, NestedLayout } from '@/types/layout';
import { isLayoutNode } from '@/types/layout';
import { findNodeById, mapLayouts } from '@/lib/layout';

interface UseComponentEditorProps {
    layouts: NestedLayout[];
    setLayouts: React.Dispatch<React.SetStateAction<NestedLayout[]>>;
}

export function useComponentEditor({ layouts, setLayouts }: UseComponentEditorProps) {
    const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);

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
            setLayouts(prev =>
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
            );
        },
        [setLayouts],
    );

    const handleUpdateComponentStyle = useCallback(
        (componentId: string, style: Record<string, unknown>) => {
            setLayouts(prev =>
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
