const getPageGraph = async () => {
    const res = await fetch('http://localhost:3001/pages/page-1', {
        cache: 'no-store',
    });
    if (!res.ok) throw new Error(`Failed to fetch page: ${res.status}`);
    return res.json();
};

export default getPageGraph;
