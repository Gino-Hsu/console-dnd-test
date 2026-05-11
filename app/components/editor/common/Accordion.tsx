/**
 * 手風琴元件
 */
export function Accordion({
  header,
  open,
  onToggle,
  children,
  className = '',
  action,
}: {
  header: React.ReactNode;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className={`overflow-hidden bg-white ${className}`}>
      <div className="flex items-center justify-between">
        <button
          onClick={onToggle}
          className="flex-1 flex items-center gap-2 cursor-pointer hover:bg-zinc-50 transition-colors text-left py-1"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className={`transition-transform text-zinc-600 shrink-0 ${open ? 'rotate-90' : ''}`}
          >
            <path d="M6 4l4 4-4 4" />
          </svg>
          {typeof header === 'string' ? (
            <span className="font-semibold text-sm text-zinc-800">{header}</span>
          ) : (
            header
          )}
        </button>
        {action && <div className="shrink-0 ml-2">{action}</div>}
      </div>

      {open && (
        <div className="flex flex-col gap-2 border-t border-zinc-100 mt-1 pt-1">
          {children}
        </div>
      )}
    </div>
  );
}
