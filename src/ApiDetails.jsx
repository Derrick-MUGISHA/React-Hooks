function labelFor(key) {
  return key.replaceAll('_', ' ').replace(/([a-z])([A-Z])/g, '$1 $2');
}

function DetailValue({ value }) {
  if (value == null || value === '') return <span className="empty-value">Not available</span>;
  if (typeof value === 'boolean') return <span>{value ? 'Yes' : 'No'}</span>;
  if (typeof value === 'number') return <span>{value.toLocaleString()}</span>;
  if (Array.isArray(value)) {
    if (!value.length) return <span className="empty-value">None listed</span>;
    return <ol className="detail-array">{value.map((item, index) => <li key={index}><DetailValue value={item} /></li>)}</ol>;
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value);
    if (!entries.length) return <span className="empty-value">None listed</span>;
    return <dl className="detail-list">{entries.map(([key, item]) => (
      <div key={key}><dt>{labelFor(key)}</dt><dd>{item && typeof item === 'object' ? <details><summary>View {labelFor(key)}</summary><DetailValue value={item} /></details> : <DetailValue value={item} />}</dd></div>
    ))}</dl>;
  }
  if (/^https?:\/\//i.test(value)) return <a href={value} target="_blank" rel="noreferrer">{value} ↗</a>;
  return <span>{String(value)}</span>;
}

export default function ApiDetails({ data, label = 'View all details' }) {
  return <details className="api-details"><summary>{label}</summary><DetailValue value={data} /></details>;
}
