export default function LoadingSkeleton({ type = 'card', count = 1 }) {
  if (type === 'card') {
    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="card p-5 space-y-3 animate-pulse">
            <div className="h-4 bg-zinc-800 rounded w-1/3" />
            <div className="h-8 bg-zinc-800 rounded w-1/2" />
            <div className="h-3 bg-zinc-800 rounded w-2/3" />
          </div>
        ))}
      </>
    );
  }

  if (type === 'table') {
    return (
      <div className="card overflow-hidden animate-pulse">
        <div className="divide-y divide-zinc-800/60">
          <div className="px-6 py-4 flex gap-4">
            <div className="h-4 bg-zinc-800 rounded w-1/4" />
            <div className="h-4 bg-zinc-800 rounded w-1/4" />
            <div className="h-4 bg-zinc-800 rounded w-1/6" />
            <div className="h-4 bg-zinc-800 rounded w-1/6" />
          </div>
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="px-6 py-4 flex gap-4">
              <div className="h-4 bg-zinc-800/60 rounded w-1/4" />
              <div className="h-4 bg-zinc-800/60 rounded w-1/4" />
              <div className="h-4 bg-zinc-800/60 rounded w-1/6" />
              <div className="h-4 bg-zinc-800/60 rounded w-1/6" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-3 animate-pulse">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="card-hover p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-zinc-800 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-zinc-800 rounded w-1/3" />
              <div className="h-3 bg-zinc-800/60 rounded w-1/2" />
            </div>
            <div className="h-8 w-8 bg-zinc-800 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  return null;
}
