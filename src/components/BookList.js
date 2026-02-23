export default function BookList({ books, onEdit, onDelete, onToggleStatus }) {
  if (!books.length) {
    return <div className="muted">No books to show.</div>;
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th style={{ width: "30%" }}>Title</th>
          <th style={{ width: "25%" }}>Author</th>
          <th style={{ width: "10%" }}>Year</th>
          <th style={{ width: "15%" }}>Status</th>
          <th style={{ width: "20%" }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {books.map((b) => (
          <tr key={b.id}>
            <td>{b.title}</td>
            <td>{b.author}</td>
            <td>{b.year || "-"}</td>
            <td>
              <span
                className={`badge ${b.status === "Available" ? "green" : "orange"}`}
                title="Click to toggle"
                style={{ cursor: "pointer" }}
                onClick={() => onToggleStatus(b.id)}
              >
                {b.status}
              </span>
            </td>
            <td className="actions">
              <button className="btn" onClick={() => onEdit(b)}>Edit</button>
              <button className="btn danger" onClick={() => onDelete(b.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
