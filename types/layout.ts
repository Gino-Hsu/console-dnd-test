import type { ComponentId } from '@/lib/component-registry';

export type LayoutType = 'block' | 'flex' | 'grid';

export type SpacingValue = {
    top: number;
    right: number;
    bottom: number;
    left: number;
};

export interface LayoutSpacing {
    margin: SpacingValue;
    padding: SpacingValue;
}

export const DEFAULT_SPACING: LayoutSpacing = {
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    padding: { top: 0, right: 0, bottom: 0, left: 0 },
};

export interface FlexConfig {
    gap: number;
    rowGap: number;
    wrap: boolean;
}

export interface GridConfig {
    colWidths: number[];
    rowHeights: number[];
    colGap: number;
    rowGap: number;
}

export interface Slot {
    id: string;
    children: CanvasNode[];
    flexWidthConfig: {
        flexBasis: number;
        widthPx: number;
    };
    align: SlotAlign;
}

export type SlotAlign = 'left' | 'center' | 'right';
export const ALIGN_CLASS: Record<SlotAlign, string> = {
    left: 'items-start',
    center: 'items-center',
    right: 'items-end',
};

export interface NestedLayout {
    id: string;
    type: 'layout';
    layoutType: LayoutType;
    label: string;
    props: Record<string, unknown>;
    slots: Slot[];
    spacing: LayoutSpacing;
    flexConfig: FlexConfig | null;
    gridConfig: GridConfig | null;
    containerWidth?: 'full' | 'contained';
}

export interface ComponentNode {
    id: string;
    type: 'component';
    componentId: ComponentId;
    label: string;
    data: Record<string, unknown>;
    style: Record<string, unknown>;
}

export type CanvasNode = NestedLayout | ComponentNode;

// ─── Flat Graph (API & DB Storage) ──────────────────────────

export interface FlatLayout {
    id: string;
    type: 'layout';
    layoutType: LayoutType;
    label: string;
    props: Record<string, unknown>;
    spacing: LayoutSpacing;
    slotIds: string[];
    parentSlotId: string | null;
    flexConfig: FlexConfig | null;
    gridConfig: GridConfig | null;
    containerWidth?: 'full' | 'contained';
}

export interface FlatSlot {
    id: string;
    childIds: string[];
    parentLayoutId: string;
    flexWidthConfig: {
        flexBasis: number | null;
        widthPx: number | null;
    };
    align?: SlotAlign;
}

export interface FlatComponent {
    id: string;
    type: 'component';
    componentId: string;
    label: string;
    data: Record<string, unknown>;
    style: Record<string, unknown>;
    parentSlotId: string;
}

export interface PageGraph {
    rootOrder: string[];
    layouts: Record<string, FlatLayout>;
    slots: Record<string, FlatSlot>;
    components: Record<string, FlatComponent>;
}

// ─── Config ──────────────────────────────────────────────────

export const LAYOUT_CONFIG: Record<LayoutType, { slotCount: number }> = {
    block: { slotCount: 1 },
    flex: { slotCount: 2 },
    grid: { slotCount: 4 },
};

// ─── Edit Log ────────────────────────────────────────────────

export type EditOperation =
    | {
          id?: string;
          type: 'add-layout';
          label?: string;
          payload: {
              layout: NestedLayout;
              slotId?: string;
              ownerId?: string;
              index?: number | null;
          };
          createdAt?: string;
      }
    | {
          id?: string;
          type: 'delete-layout';
          label?: string;
          payload: { layoutId: string };
          createdAt?: string;
      }
    | {
          id?: string;
          type: 'move-layout';
          label?: string;
          payload: {
              layoutId: string;
              targetSlotId: string;
              index?: number | null;
          };
          createdAt?: string;
      }
    | {
          id?: string;
          type: 'update-spacing';
          label?: string;
          payload: { layoutId: string; spacing: LayoutSpacing };
          createdAt?: string;
      }
    | {
          id?: string;
          type: 'add-slot';
          label?: string;
          payload: { layoutId: string };
          createdAt?: string;
      }
    | {
          id?: string;
          type: 'remove-slot';
          label?: string;
          payload: { layoutId: string; slotId: string };
          createdAt?: string;
      }
    | {
          id?: string;
          type: 'update-slot-widths';
          label?: string;
          payload: { layoutId: string; widths: number[] };
          createdAt?: string;
      }
    | {
          id?: string;
          type: 'update-wrap-slot-width';
          label?: string;
          payload: { layoutId: string; slotId: string; widthPx: number };
          createdAt?: string;
      }
    | {
          id?: string;
          type: 'update-grid-dimensions';
          label?: string;
          payload: {
              layoutId: string;
              colWidths: number[];
              rowHeights: number[];
              colGap: number | null;
              rowGap: number | null;
          };
          createdAt?: string;
      }
    | {
          id?: string;
          type: 'update-flex-gap';
          label?: string;
          payload: { layoutId: string; gap: number };
          createdAt?: string;
      }
    | {
          id?: string;
          type: 'update-flex-wrap';
          label?: string;
          payload: { layoutId: string; wrap: boolean };
          createdAt?: string;
      }
    | {
          id?: string;
          type: 'update-flex-row-gap';
          label?: string;
          payload: { layoutId: string; rowGap: number };
          createdAt?: string;
      }
    | {
          id?: string;
          type: 'update-slot-align';
          label?: string;
          payload: { layoutId: string; slotId: string; align: SlotAlign };
          createdAt?: string;
      }
    | {
          id?: string;
          type: 'update-container-width';
          label?: string;
          payload: { layoutId: string; containerWidth: 'full' | 'contained' };
          createdAt?: string;
      }
    | {
          id?: string;
          type: 'add-component';
          label?: string;
          payload: {
              component: ComponentNode;
              slotId: string;
              ownerId: string;
              index?: number | null;
          };
          createdAt?: string;
      }
    | {
          id?: string;
          type: 'update-component';
          label?: string;
          payload: {
              componentId: string;
              data?: Record<string, unknown>;
              style?: Record<string, unknown>;
          };
          createdAt?: string;
      };

// ─── Sidebar ──────────────────────────────────────────────────

export interface SidebarItem {
    type: LayoutType;
    label: string;
    description: string;
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
    {
        type: 'block',
        label: '塊級 Layout',
        description: 'Block — 元素獨佔整行',
    },
    {
        type: 'flex',
        label: 'Flex Layout',
        description: 'Flex — 水平排列',
    },
    {
        type: 'grid',
        label: 'Grid Layout',
        description: 'Grid — 二維排列',
    },
];

// ─── Type Guards ───────────────────────────────────────────────

export function isLayoutNode(node: CanvasNode): node is NestedLayout {
    return node.type === 'layout';
}

export function isComponentNode(node: CanvasNode): node is ComponentNode {
    return node.type === 'component';
}
