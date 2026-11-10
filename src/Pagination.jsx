export default function Pagination({ page, pageSize, total, count, hasMore, disabled = false, onPageChange, label }) {
  const pageCount = total == null ? null : Math.max(1, Math.ceil(total / pageSize));
  const first = count ? page * pageSize + 1 : 0;
  const last = count ? page * pageSize + count : 0;

  return (
    <nav className="pagination" aria-label={label}>
      <p role="status">{first}–{last}{total != null && ` of ${total}`}</p>
      <div className="page-controls">
        <button type="button" disabled={disabled || page === 0} onClick={() => onPageChange(page - 1)}>← Previous</button>
        <span aria-current="page">{page + 1}{pageCount != null && ` / ${pageCount}`}</span>
        <button type="button" disabled={disabled || !hasMore} onClick={() => onPageChange(page + 1)}>Next →</button>
      </div>
    </nav>
  );
}
