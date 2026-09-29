// Sidebar list of past reviews.
//
// Props:
// - items: array of Review objects
// - selectedId: _id of the review currently shown
// - onSelect(review): show that review in ReviewResult
// - onDelete(id): remove it from the DB and the list

const formatDate = (iso) =>
  new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

export default function HistoryList({ items = [], selectedId, onSelect, onDelete }) {
  return (
    <div className="pixel-card p-4">
      <h2 className="font-pixel mb-4 text-xs">History</h2>

      {items.length === 0 ? (
        <p className="text-sm text-neutral-500">No roasts yet.</p>
      ) : (
        <ul className="max-h-[70vh] space-y-3 overflow-y-auto pr-1">
          {items.map((item) => {
            const selected = item._id === selectedId;
            return (
              <li
                key={item._id}
                className={`flex border-2 border-black ${selected ? 'bg-arcade-yellow' : 'bg-white hover:bg-neutral-100'}`}
              >
                <button
                  type="button"
                  onClick={() => onSelect(item)}
                  className="min-w-0 flex-1 cursor-pointer p-2 text-left focus:outline-none focus-visible:bg-arcade-yellow"
                >
                  <div className="mb-1 flex items-center justify-between gap-2 text-xs">
                    <span className="border border-black bg-white px-1 font-bold">{item.language}</span>
                    <span className="text-neutral-600">{formatDate(item.createdAt)}</span>
                  </div>
                  <p className="truncate text-xs text-neutral-800">{item.code.split('\n')[0]}</p>
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(item._id)}
                  aria-label="Delete review"
                  className="cursor-pointer border-l-2 border-black px-2 font-bold hover:bg-arcade-red hover:text-white focus:outline-none focus-visible:bg-arcade-red"
                >
                  ×
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
