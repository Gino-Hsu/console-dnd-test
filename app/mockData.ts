import type { PageGraph } from '@/types/layout';

export const MOCK_PAGE_GRAPH: PageGraph = {
    pageId: 'page-1',
    version: 1,
    status: 'published',
    createdAt: '2026-05-04T08:51:02.033Z',
    rootOrder: [
        '09a9a9a9-fe51-4a2e-90dd-81eabd981b1b',
        '56a1597b-3d13-4e7e-a84d-1a6b349b22a4',
        'dac899bc-26ef-4e9a-9e78-3ab2a77154e7',
        '1f055cb5-cd4c-49a6-b1c5-65b5ecf18815',
    ],
    layouts: {
        '09a9a9a9-fe51-4a2e-90dd-81eabd981b1b': {
            id: '09a9a9a9-fe51-4a2e-90dd-81eabd981b1b',
            type: 'block',
            label: '塊級 Layout',
            props: {},
            spacing: {
                padding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
                margin: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
            },
            slotIds: ['573fcec2-1289-467d-9238-0e71ffdc0474'],
            parentSlotId: null,
            flexConfig: null,
            gridConfig: null,
        },
        '56a1597b-3d13-4e7e-a84d-1a6b349b22a4': {
            id: '56a1597b-3d13-4e7e-a84d-1a6b349b22a4',
            type: 'flex',
            label: 'Flex Layout',
            props: {},
            spacing: {
                padding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
                margin: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
            },
            slotIds: [
                'f0b9ef7f-369d-431d-9f36-df0e1f1f9fb1',
                'f49509b0-ec9e-4535-8ef9-e6ea614edb88',
            ],
            parentSlotId: null,
            flexConfig: {
                gap: 8,
                rowGap: 8,
                wrap: true,
            },
            gridConfig: null,
        },
        '77d8b27d-e22a-4771-8ec3-21ac10a7ebab': {
            id: '77d8b27d-e22a-4771-8ec3-21ac10a7ebab',
            type: 'block',
            label: '塊級 Layout',
            props: {},
            spacing: {
                padding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
                margin: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
            },
            slotIds: ['bbf2113c-a5a5-432e-a4bb-a625c00eee2d'],
            parentSlotId: 'f0b9ef7f-369d-431d-9f36-df0e1f1f9fb1',
            flexConfig: null,
            gridConfig: null,
        },
        '871dd05a-5a32-49d5-9a9e-118ccd9784bf': {
            id: '871dd05a-5a32-49d5-9a9e-118ccd9784bf',
            type: 'block',
            label: '塊級 Layout',
            props: {},
            spacing: {
                padding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
                margin: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
            },
            slotIds: ['8ab825ec-0a63-4037-b57f-7bf43a1dd4d8'],
            parentSlotId: 'f49509b0-ec9e-4535-8ef9-e6ea614edb88',
            flexConfig: null,
            gridConfig: null,
        },
        'dac899bc-26ef-4e9a-9e78-3ab2a77154e7': {
            id: 'dac899bc-26ef-4e9a-9e78-3ab2a77154e7',
            type: 'flex',
            label: 'Flex Layout',
            props: {},
            spacing: {
                padding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
                margin: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
            },
            slotIds: [
                '7e1e3dd0-83cc-412b-8c9f-f9294b31bc4c',
                '0df08ed8-0317-4d64-b252-d44fa04cd4e1',
            ],
            parentSlotId: null,
            flexConfig: {
                gap: 8,
                rowGap: 8,
                wrap: false,
            },
            gridConfig: null,
        },
        '93c691bd-fbea-4151-87e5-0faf20b17fe2': {
            id: '93c691bd-fbea-4151-87e5-0faf20b17fe2',
            type: 'grid',
            label: 'Grid Layout',
            props: {},
            spacing: {
                padding: {
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20,
                },
                margin: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
            },
            slotIds: [
                'f4f216b1-d68e-4cb2-a0fa-891530a6710d',
                'e4ace24a-0bd2-41fe-9b69-0435c11ee785',
                '830f6643-9734-4b09-bc4b-33f340cf8ed3',
                'bbc3eb97-f691-4c15-bf9e-9b99382e064c',
            ],
            parentSlotId: '7e1e3dd0-83cc-412b-8c9f-f9294b31bc4c',
            flexConfig: null,
            gridConfig: {
                colWidths: [50, 50],
                rowHeights: [120, 120],
                colGap: 8,
                rowGap: 8,
            },
        },
        '1f055cb5-cd4c-49a6-b1c5-65b5ecf18815': {
            id: '1f055cb5-cd4c-49a6-b1c5-65b5ecf18815',
            type: 'grid',
            label: 'Grid Layout',
            props: {},
            spacing: {
                padding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
                margin: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
            },
            slotIds: [
                '4d5a3e3e-84bb-4c02-b85a-062714761d59',
                'b77cab67-a559-4cfd-b57e-9c9ab4578df7',
                'feb0c5ee-9b2a-4ead-b888-7f7933b798e7',
                'bb850201-e23c-462b-adf7-65cd664a0c91',
            ],
            parentSlotId: null,
            flexConfig: null,
            gridConfig: {
                colWidths: [95.00064758450978, 4.999352415490223],
                rowHeights: [120, 120],
                colGap: 8,
                rowGap: 8,
            },
        },
        'd5cb07f2-1058-4c2c-963e-d6142e6a9c82': {
            id: 'd5cb07f2-1058-4c2c-963e-d6142e6a9c82',
            type: 'block',
            label: '塊級 Layout',
            props: {},
            spacing: {
                padding: {
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20,
                },
                margin: {
                    top: 10,
                    right: 10,
                    bottom: 10,
                    left: 10,
                },
            },
            slotIds: ['73e12c90-af80-4954-8b83-9221fb2f1550'],
            parentSlotId: '4d5a3e3e-84bb-4c02-b85a-062714761d59',
            flexConfig: null,
            gridConfig: null,
        },
        '263d1ba9-1eb1-4c30-8e25-cc7a30ceba74': {
            id: '263d1ba9-1eb1-4c30-8e25-cc7a30ceba74',
            type: 'flex',
            label: 'Flex Layout',
            props: {},
            spacing: {
                padding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
                margin: {
                    top: 30,
                    right: 0,
                    bottom: 30,
                    left: 0,
                },
            },
            slotIds: [
                'c7a0d3d4-2573-4074-a19b-3337653492df',
                '6f107e9d-0565-497b-b512-67565b189ce4',
            ],
            parentSlotId: '73e12c90-af80-4954-8b83-9221fb2f1550',
            flexConfig: {
                gap: 8,
                rowGap: 8,
                wrap: false,
            },
            gridConfig: null,
        },
    },
    slots: {
        '573fcec2-1289-467d-9238-0e71ffdc0474': {
            id: '573fcec2-1289-467d-9238-0e71ffdc0474',
            childIds: [
                'c512ad29-e4c8-4647-b759-8349bdedf145',
                '19d64acd-146a-42ab-b96c-1f5b036bf7af',
                'bea99c48-e0c3-4515-aad3-a2a669877e8d',
            ],
            parentLayoutId: '09a9a9a9-fe51-4a2e-90dd-81eabd981b1b',
            flexWidthConfig: {
                flexBasis: 100,
                widthPx: 400,
            },
        },
        'f0b9ef7f-369d-431d-9f36-df0e1f1f9fb1': {
            id: 'f0b9ef7f-369d-431d-9f36-df0e1f1f9fb1',
            childIds: ['77d8b27d-e22a-4771-8ec3-21ac10a7ebab'],
            parentLayoutId: '56a1597b-3d13-4e7e-a84d-1a6b349b22a4',
            flexWidthConfig: {
                flexBasis: 35.16,
                widthPx: 661,
            },
        },
        'bbf2113c-a5a5-432e-a4bb-a625c00eee2d': {
            id: 'bbf2113c-a5a5-432e-a4bb-a625c00eee2d',
            childIds: [],
            parentLayoutId: '77d8b27d-e22a-4771-8ec3-21ac10a7ebab',
            flexWidthConfig: {
                flexBasis: 50,
                widthPx: 200,
            },
        },
        'f49509b0-ec9e-4535-8ef9-e6ea614edb88': {
            id: 'f49509b0-ec9e-4535-8ef9-e6ea614edb88',
            childIds: ['871dd05a-5a32-49d5-9a9e-118ccd9784bf'],
            parentLayoutId: '56a1597b-3d13-4e7e-a84d-1a6b349b22a4',
            flexWidthConfig: {
                flexBasis: 64.84,
                widthPx: 200,
            },
        },
        '8ab825ec-0a63-4037-b57f-7bf43a1dd4d8': {
            id: '8ab825ec-0a63-4037-b57f-7bf43a1dd4d8',
            childIds: [],
            parentLayoutId: '871dd05a-5a32-49d5-9a9e-118ccd9784bf',
            flexWidthConfig: {
                flexBasis: 50,
                widthPx: 200,
            },
        },
        '7e1e3dd0-83cc-412b-8c9f-f9294b31bc4c': {
            id: '7e1e3dd0-83cc-412b-8c9f-f9294b31bc4c',
            childIds: ['93c691bd-fbea-4151-87e5-0faf20b17fe2'],
            parentLayoutId: 'dac899bc-26ef-4e9a-9e78-3ab2a77154e7',
            flexWidthConfig: {
                flexBasis: 83.02625000000002,
                widthPx: 200,
            },
        },
        'f4f216b1-d68e-4cb2-a0fa-891530a6710d': {
            id: 'f4f216b1-d68e-4cb2-a0fa-891530a6710d',
            childIds: [],
            parentLayoutId: '93c691bd-fbea-4151-87e5-0faf20b17fe2',
            flexWidthConfig: {
                flexBasis: 50,
                widthPx: 200,
            },
        },
        'e4ace24a-0bd2-41fe-9b69-0435c11ee785': {
            id: 'e4ace24a-0bd2-41fe-9b69-0435c11ee785',
            childIds: [],
            parentLayoutId: '93c691bd-fbea-4151-87e5-0faf20b17fe2',
            flexWidthConfig: {
                flexBasis: 50,
                widthPx: 200,
            },
        },
        '830f6643-9734-4b09-bc4b-33f340cf8ed3': {
            id: '830f6643-9734-4b09-bc4b-33f340cf8ed3',
            childIds: [],
            parentLayoutId: '93c691bd-fbea-4151-87e5-0faf20b17fe2',
            flexWidthConfig: {
                flexBasis: 50,
                widthPx: 200,
            },
        },
        'bbc3eb97-f691-4c15-bf9e-9b99382e064c': {
            id: 'bbc3eb97-f691-4c15-bf9e-9b99382e064c',
            childIds: [],
            parentLayoutId: '93c691bd-fbea-4151-87e5-0faf20b17fe2',
            flexWidthConfig: {
                flexBasis: 50,
                widthPx: 200,
            },
        },
        '0df08ed8-0317-4d64-b252-d44fa04cd4e1': {
            id: '0df08ed8-0317-4d64-b252-d44fa04cd4e1',
            childIds: [],
            parentLayoutId: 'dac899bc-26ef-4e9a-9e78-3ab2a77154e7',
            flexWidthConfig: {
                flexBasis: 16.97374999999999,
                widthPx: 200,
            },
        },
        '4d5a3e3e-84bb-4c02-b85a-062714761d59': {
            id: '4d5a3e3e-84bb-4c02-b85a-062714761d59',
            childIds: ['d5cb07f2-1058-4c2c-963e-d6142e6a9c82'],
            parentLayoutId: '1f055cb5-cd4c-49a6-b1c5-65b5ecf18815',
            flexWidthConfig: {
                flexBasis: 50,
                widthPx: 200,
            },
        },
        '73e12c90-af80-4954-8b83-9221fb2f1550': {
            id: '73e12c90-af80-4954-8b83-9221fb2f1550',
            childIds: ['263d1ba9-1eb1-4c30-8e25-cc7a30ceba74'],
            parentLayoutId: 'd5cb07f2-1058-4c2c-963e-d6142e6a9c82',
            flexWidthConfig: {
                flexBasis: 50,
                widthPx: 200,
            },
        },
        'c7a0d3d4-2573-4074-a19b-3337653492df': {
            id: 'c7a0d3d4-2573-4074-a19b-3337653492df',
            childIds: [],
            parentLayoutId: '263d1ba9-1eb1-4c30-8e25-cc7a30ceba74',
            flexWidthConfig: {
                flexBasis: 50,
                widthPx: 200,
            },
        },
        '6f107e9d-0565-497b-b512-67565b189ce4': {
            id: '6f107e9d-0565-497b-b512-67565b189ce4',
            childIds: [],
            parentLayoutId: '263d1ba9-1eb1-4c30-8e25-cc7a30ceba74',
            flexWidthConfig: {
                flexBasis: 50,
                widthPx: 200,
            },
        },
        'b77cab67-a559-4cfd-b57e-9c9ab4578df7': {
            id: 'b77cab67-a559-4cfd-b57e-9c9ab4578df7',
            childIds: [],
            parentLayoutId: '1f055cb5-cd4c-49a6-b1c5-65b5ecf18815',
            flexWidthConfig: {
                flexBasis: 50,
                widthPx: 200,
            },
        },
        'feb0c5ee-9b2a-4ead-b888-7f7933b798e7': {
            id: 'feb0c5ee-9b2a-4ead-b888-7f7933b798e7',
            childIds: [],
            parentLayoutId: '1f055cb5-cd4c-49a6-b1c5-65b5ecf18815',
            flexWidthConfig: {
                flexBasis: 50,
                widthPx: 200,
            },
        },
        'bb850201-e23c-462b-adf7-65cd664a0c91': {
            id: 'bb850201-e23c-462b-adf7-65cd664a0c91',
            childIds: [],
            parentLayoutId: '1f055cb5-cd4c-49a6-b1c5-65b5ecf18815',
            flexWidthConfig: {
                flexBasis: 50,
                widthPx: 200,
            },
        },
    },
    components: {
        'c512ad29-e4c8-4647-b759-8349bdedf145': {
            id: 'c512ad29-e4c8-4647-b759-8349bdedf145',
            componentId: 'H01',
            label: '基礎標題',
            data: {
                title: '義大利-威尼斯(含乘船導覽)一日遊| 米蘭出發',
                level: 'h2',
            },
            style: {
                align: 'center',
                color: '#8780ea',
                fontSize: 30,
                fontWeight: '700',
            },
            parentSlotId: '573fcec2-1289-467d-9238-0e71ffdc0474',
        },
        '19d64acd-146a-42ab-b96c-1f5b036bf7af': {
            id: '19d64acd-146a-42ab-b96c-1f5b036bf7af',
            componentId: 'H02',
            label: '帶裝飾標題',
            data: {
                title: '專屬推薦',
                description: '奧捷夏日童話限量倒數',
                level: 'h2',
            },
            style: {
                underline: true,
            },
            parentSlotId: '573fcec2-1289-467d-9238-0e71ffdc0474',
        },
        'bea99c48-e0c3-4515-aad3-a2a669877e8d': {
            id: 'bea99c48-e0c3-4515-aad3-a2a669877e8d',
            componentId: 'I01',
            label: '基礎圖片',
            data: {
                src: 'https://static.liontech.com.tw/ConsoleAPData/PublicationStatic/lion_tw_b2c/zh-tw/_ModelFile/Product/3866511/a251ac4acaeb4327bd680cc99226ad46.jpg',
                alt: '圖片',
            },
            style: {
                width: '50%',
                height: 'auto',
                borderRadius: '0px',
                objectFit: 'cover',
            },
            parentSlotId: '573fcec2-1289-467d-9238-0e71ffdc0474',
        },
    },
};
