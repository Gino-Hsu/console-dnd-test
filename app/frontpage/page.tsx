import { graphToTree } from '@/lib/layout';
import type { PageGraph } from '@/types/layout';
import ViewLayoutCard from '@/app/components/view/ViewLayoutCard';
import { getPageGraph } from '@/app/api/pageGraph';

export default async function FrontPage() {
    let pageGraph: PageGraph;
    try {
        pageGraph = await getPageGraph();
    } catch {
        return (
            <main className='min-h-screen bg-white flex items-center justify-center'>
                <div className='text-center text-zinc-400'>
                    <p className='text-2xl mb-2'>⚠️</p>
                    <p className='font-medium'>無法連線到 json-server</p>
                    <p className='text-sm mt-1'>
                        請確認
                        <code className='bg-zinc-100 px-1 rounded'>
                            pnpm db
                        </code>
                        已在執行中
                    </p>
                </div>
            </main>
        );
    }

    const layouts = graphToTree(pageGraph);

    return (
        <main className='min-h-screen bg-white'>
            {layouts.map(layout => (
                <ViewLayoutCard key={layout.id} layout={layout} depth={0} />
            ))}
        </main>
    );
}
