export default function StatusFilter({ status, onChange }) {
  return (
    <select
      className="filter"
      value={status}
      onChange={(e) => onChange(e.target.value)}
      title="Filter by status"
    >
      <option value="ALL">All</option>
      <option value="Available">Available</option>
      <option value="Borrowed">Borrowed</option>
    </select>
  );
}