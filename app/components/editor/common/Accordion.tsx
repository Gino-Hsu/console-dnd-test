/**
 * 手風琴元件
 */
export function Accordion({
    header,
    open,
    onToggle,
    children,
    className = '',
}: {
    header: React.ReactNode;
    open: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={`overflow-hidden bg-white ${className}`}>
            <button 
                onClick={onToggle} 
                className="w-full flex items-center gap-2 cursor-pointer hover:bg-zinc-50 transition-colors"
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className={`transition-transform text-zinc-600 flex-shrink-0 ${open ? 'rotate-90' : ''}`}
                >
                    <path d="M6 4l4 4-4 4" />
                </svg>
                {typeof header === 'string' ? (
                    <span className="font-semibold text-sm text-zinc-800">
                        {header}
                    </span>
                ) : (
                    header
                )}
            </button>

            {open && (
                <div className="flex flex-col gap-2 border-t border-zinc-100">
                    {children}
                </div>
            )}
        </div>
    );
}
