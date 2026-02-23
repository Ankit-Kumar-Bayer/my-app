export default function SearchBar({ query, onChange }) {
  return (
    <input
      className="search"
      placeholder="Search by title or author..."
      value={query}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}