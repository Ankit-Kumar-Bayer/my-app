import { useEffect, useState } from "react";

const emptyBook = {
  id: null,
  title: "",
  author: "",
  year: "",
  status: "Available",
};

export default function BookForm({ onSubmit, onCancel, editingBook }) {
  const [book, setBook] = useState(emptyBook);

  useEffect(() => {
    if (editingBook) setBook(editingBook);
    else setBook(emptyBook);
  }, [editingBook]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook((b) => ({ ...b, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!book.title.trim() || !book.author.trim()) return;
    onSubmit({
      ...book,
      year: book.year ? Number(book.year) : "",
      id: book.id ?? crypto.randomUUID(),
    });
    setBook(emptyBook);
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h3>{editingBook ? "Edit Book" : "Add Book"}</h3>

      <label>
        Title
        <input
          name="title"
          value={book.title}
          onChange={handleChange}
          placeholder="e.g., Clean Code"
          required
        />
      </label>

      <label>
        Author
        <input
          name="author"
          value={book.author}
          onChange={handleChange}
          placeholder="e.g., Robert C. Martin"
          required
        />
      </label>

      <label>
        Year
        <input
          name="year"
          type="number"
          value={book.year}
          onChange={handleChange}
          placeholder="e.g., 2008"
        />
      </label>

      <label>
        Status
        <select name="status" value={book.status} onChange={handleChange}>
          <option>Available</option>
          <option>Borrowed</option>
        </select>
      </label>

      <div className="row">
        <button type="submit" className="btn primary">
          {editingBook ? "Update" : "Add"}
        </button>
        {editingBook && (
          <button type="button" className="btn" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}