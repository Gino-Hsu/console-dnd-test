import type { PageGraph } from '@/types/layout';

export const MOCK_PAGE_GRAPH: PageGraph = {
    pageId: 'page-1',
    version: 1,
    status: 'published',
    createdAt: '2026-04-23T01:23:51.378Z',
    rootOrder: [
        'd0a762a3-faaf-41f2-a181-575025ad01f4',
        'dac899bc-26ef-4e9a-9e78-3ab2a77154e7',
        '1f055cb5-cd4c-49a6-b1c5-65b5ecf18815',
    ],
    layouts: {
        'd0a762a3-faaf-41f2-a181-575025ad01f4': {
            id: 'd0a762a3-faaf-41f2-a181-575025ad01f4',
            type: 'block',
            label: '塊級 Layout',
            props: {},
            spacing: {
                padding: { top: 0, right: 0, bottom: 0, left: 0 },
                margin: { top: 0, right: 0, bottom: 0, left: 0 },
            },
            slotIds: ['d02f41d5-eaa2-472f-9d29-b4f2c583535b'],
            parentSlotId: null,
        },
        '0c07e6d2-5bb4-4641-a6f9-54d3ef48bd56': {
            id: '0c07e6d2-5bb4-4641-a6f9-54d3ef48bd56',
            type: 'flex',
            label: 'Flex Layout',
            props: {},
            spacing: {
                padding: { top: 0, right: 0, bottom: 0, left: 0 },
                margin: { top: 0, right: 0, bottom: 0, left: 0 },
            },
            slotIds: [
                'd39603a4-677d-49c7-8c3b-ae7007f150ae',
                '9b081a43-937a-4dd1-bd66-95c6a539f6ad',
            ],
            parentSlotId: 'd02f41d5-eaa2-472f-9d29-b4f2c583535b',
        },
        'dac899bc-26ef-4e9a-9e78-3ab2a77154e7': {
            id: 'dac899bc-26ef-4e9a-9e78-3ab2a77154e7',
            type: 'flex',
            label: 'Flex Layout',
            props: {},
            spacing: {
                padding: { top: 0, right: 0, bottom: 0, left: 0 },
                margin: { top: 0, right: 0, bottom: 0, left: 0 },
            },
            slotIds: [
                '7e1e3dd0-83cc-412b-8c9f-f9294b31bc4c',
                '0df08ed8-0317-4d64-b252-d44fa04cd4e1',
            ],
            parentSlotId: null,
        },
        '93c691bd-fbea-4151-87e5-0faf20b17fe2': {
            id: '93c691bd-fbea-4151-87e5-0faf20b17fe2',
            type: 'grid',
            label: 'Grid Layout',
            props: {},
            spacing: {
                padding: { top: 0, right: 0, bottom: 0, left: 0 },
                margin: { top: 0, right: 0, bottom: 0, left: 0 },
            },
            slotIds: [
                'f4f216b1-d68e-4cb2-a0fa-891530a6710d',
                'e4ace24a-0bd2-41fe-9b69-0435c11ee785',
                '830f6643-9734-4b09-bc4b-33f340cf8ed3',
                'bbc3eb97-f691-4c15-bf9e-9b99382e064c',
            ],
            parentSlotId: '7e1e3dd0-83cc-412b-8c9f-f9294b31bc4c',
            gridColWidths: [50, 50],
            gridRowHeights: [120, 120],
            gridColGap: 8,
            gridRowGap: 8,
        },
        '1f055cb5-cd4c-49a6-b1c5-65b5ecf18815': {
            id: '1f055cb5-cd4c-49a6-b1c5-65b5ecf18815',
            type: 'grid',
            label: 'Grid Layout',
            props: {},
            spacing: {
                padding: { top: 0, right: 0, bottom: 0, left: 0 },
                margin: { top: 0, right: 0, bottom: 0, left: 0 },
            },
            slotIds: [
                '4d5a3e3e-84bb-4c02-b85a-062714761d59',
                'b77cab67-a559-4cfd-b57e-9c9ab4578df7',
                'feb0c5ee-9b2a-4ead-b888-7f7933b798e7',
                'bb850201-e23c-462b-adf7-65cd664a0c91',
            ],
            parentSlotId: null,
            gridColWidths: [50, 50],
            gridRowHeights: [120, 120],
            gridColGap: 8,
            gridRowGap: 8,
        },
        'd5cb07f2-1058-4c2c-963e-d6142e6a9c82': {
            id: 'd5cb07f2-1058-4c2c-963e-d6142e6a9c82',
            type: 'block',
            label: '塊級 Layout',
            props: {},
            spacing: {
                padding: { top: 0, right: 0, bottom: 0, left: 0 },
                margin: { top: 0, right: 0, bottom: 0, left: 0 },
            },
            slotIds: ['73e12c90-af80-4954-8b83-9221fb2f1550'],
            parentSlotId: '4d5a3e3e-84bb-4c02-b85a-062714761d59',
        },
        '263d1ba9-1eb1-4c30-8e25-cc7a30ceba74': {
            id: '263d1ba9-1eb1-4c30-8e25-cc7a30ceba74',
            type: 'flex',
            label: 'Flex Layout',
            props: {},
            spacing: {
                padding: { top: 0, right: 0, bottom: 0, left: 0 },
                margin: { top: 0, right: 0, bottom: 0, left: 0 },
            },
            slotIds: [
                'c7a0d3d4-2573-4074-a19b-3337653492df',
                '6f107e9d-0565-497b-b512-67565b189ce4',
            ],
            parentSlotId: '73e12c90-af80-4954-8b83-9221fb2f1550',
        },
    },
    slots: {
        'd02f41d5-eaa2-472f-9d29-b4f2c583535b': {
            id: 'd02f41d5-eaa2-472f-9d29-b4f2c583535b',
            childIds: ['0c07e6d2-5bb4-4641-a6f9-54d3ef48bd56'],
            parentLayoutId: 'd0a762a3-faaf-41f2-a181-575025ad01f4',
        },
        'd39603a4-677d-49c7-8c3b-ae7007f150ae': {
            id: 'd39603a4-677d-49c7-8c3b-ae7007f150ae',
            childIds: [],
            parentLayoutId: '0c07e6d2-5bb4-4641-a6f9-54d3ef48bd56',
            flexBasis: 50,
        },
        '9b081a43-937a-4dd1-bd66-95c6a539f6ad': {
            id: '9b081a43-937a-4dd1-bd66-95c6a539f6ad',
            childIds: [],
            parentLayoutId: '0c07e6d2-5bb4-4641-a6f9-54d3ef48bd56',
            flexBasis: 50,
        },
        '7e1e3dd0-83cc-412b-8c9f-f9294b31bc4c': {
            id: '7e1e3dd0-83cc-412b-8c9f-f9294b31bc4c',
            childIds: ['93c691bd-fbea-4151-87e5-0faf20b17fe2'],
            parentLayoutId: 'dac899bc-26ef-4e9a-9e78-3ab2a77154e7',
            flexBasis: 50,
        },
        'f4f216b1-d68e-4cb2-a0fa-891530a6710d': {
            id: 'f4f216b1-d68e-4cb2-a0fa-891530a6710d',
            childIds: [],
            parentLayoutId: '93c691bd-fbea-4151-87e5-0faf20b17fe2',
        },
        'e4ace24a-0bd2-41fe-9b69-0435c11ee785': {
            id: 'e4ace24a-0bd2-41fe-9b69-0435c11ee785',
            childIds: [],
            parentLayoutId: '93c691bd-fbea-4151-87e5-0faf20b17fe2',
        },
        '830f6643-9734-4b09-bc4b-33f340cf8ed3': {
            id: '830f6643-9734-4b09-bc4b-33f340cf8ed3',
            childIds: [],
            parentLayoutId: '93c691bd-fbea-4151-87e5-0faf20b17fe2',
        },
        'bbc3eb97-f691-4c15-bf9e-9b99382e064c': {
            id: 'bbc3eb97-f691-4c15-bf9e-9b99382e064c',
            childIds: [],
            parentLayoutId: '93c691bd-fbea-4151-87e5-0faf20b17fe2',
        },
        '0df08ed8-0317-4d64-b252-d44fa04cd4e1': {
            id: '0df08ed8-0317-4d64-b252-d44fa04cd4e1',
            childIds: [],
            parentLayoutId: 'dac899bc-26ef-4e9a-9e78-3ab2a77154e7',
            flexBasis: 50,
        },
        '4d5a3e3e-84bb-4c02-b85a-062714761d59': {
            id: '4d5a3e3e-84bb-4c02-b85a-062714761d59',
            childIds: ['d5cb07f2-1058-4c2c-963e-d6142e6a9c82'],
            parentLayoutId: '1f055cb5-cd4c-49a6-b1c5-65b5ecf18815',
        },
        '73e12c90-af80-4954-8b83-9221fb2f1550': {
            id: '73e12c90-af80-4954-8b83-9221fb2f1550',
            childIds: ['263d1ba9-1eb1-4c30-8e25-cc7a30ceba74'],
            parentLayoutId: 'd5cb07f2-1058-4c2c-963e-d6142e6a9c82',
        },
        'c7a0d3d4-2573-4074-a19b-3337653492df': {
            id: 'c7a0d3d4-2573-4074-a19b-3337653492df',
            childIds: [],
            parentLayoutId: '263d1ba9-1eb1-4c30-8e25-cc7a30ceba74',
            flexBasis: 50,
        },
        '6f107e9d-0565-497b-b512-67565b189ce4': {
            id: '6f107e9d-0565-497b-b512-67565b189ce4',
            childIds: [],
            parentLayoutId: '263d1ba9-1eb1-4c30-8e25-cc7a30ceba74',
            flexBasis: 50,
        },
        'b77cab67-a559-4cfd-b57e-9c9ab4578df7': {
            id: 'b77cab67-a559-4cfd-b57e-9c9ab4578df7',
            childIds: [],
            parentLayoutId: '1f055cb5-cd4c-49a6-b1c5-65b5ecf18815',
        },
        'feb0c5ee-9b2a-4ead-b888-7f7933b798e7': {
            id: 'feb0c5ee-9b2a-4ead-b888-7f7933b798e7',
            childIds: [],
            parentLayoutId: '1f055cb5-cd4c-49a6-b1c5-65b5ecf18815',
        },
        'bb850201-e23c-462b-adf7-65cd664a0c91': {
            id: 'bb850201-e23c-462b-adf7-65cd664a0c91',
            childIds: [],
            parentLayoutId: '1f055cb5-cd4c-49a6-b1c5-65b5ecf18815',
        },
    },
};
