import { graphToTree } from '@/lib/layout';
import { MOCK_PAGE_GRAPH } from '@/app/mockData';
import ViewLayoutCard from '@/app/components/view/ViewLayoutCard';

// 模擬從 API 取得 PageGraph，轉換成 NestedLayout[]
const layouts = graphToTree(MOCK_PAGE_GRAPH);

export default function FrontPage() {
    return (
        <main className='min-h-screen bg-white'>
            {layouts.map(layout => (
                <ViewLayoutCard key={layout.id} layout={layout} depth={0} />
            ))}
        </main>
    );
}
