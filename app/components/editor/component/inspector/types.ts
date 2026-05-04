/**
 * Inspector 元件的 Props 定義
 */
export interface InspectorProps {
    data: Record<string, unknown>;
    style: Record<string, unknown>;
    onUpdateData: (newData: Record<string, unknown>) => void;
    onUpdateStyle: (newStyle: Record<string, unknown>) => void;
}

/**
 * Inspector 元件類型
 */
export type InspectorComponent = React.ComponentType<InspectorProps>;

/**
 * Inspector 註冊表類型
 */
export interface InspectorRegistry {
    [componentId: string]: InspectorComponent;
}
