import { useMemo, useState } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import BookForm from "./components/BookForm";
import BookList from "./components/BookList";
import SearchBar from "./components/SearchBar";
import StatusFilter from "./components/StatusFilter";
import "./App.css";

const seed = [
  { id: "1", title: "Clean Code", author: "Robert C. Martin", year: 2008, status: "Available" },
  { id: "2", title: "The Pragmatic Programmer", author: "Andrew Hunt", year: 1999, status: "Borrowed" },
];

export default function App() {
  const [books, setBooks] = useLocalStorage("library_books", seed);
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");
  const [sortBy, setSortBy] = useState("title"); // title | author | year | status

  const handleUpsert = (book) => {
    setBooks((prev) => {
      const exists = prev.some((b) => b.id === book.id);
      if (exists) return prev.map((b) => (b.id === book.id ? book : b));
      return [book, ...prev];
    });
    setEditing(null);
  };

  const handleDelete = (id) => {
    setBooks((prev) => prev.filter((b) => b.id !== id));
    if (editing?.id === id) setEditing(null);
  };

  const handleToggleStatus = (id) => {
    setBooks((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, status: b.status === "Available" ? "Borrowed" : "Available" } : b
      )
    );
  };

  const filtered = useMemo(() => {
    let list = [...books];

    // Search
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (status !== "ALL") {
      list = list.filter((b) => b.status === status);
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === "year") {
        return (a.year || 0) - (b.year || 0);
      }
      return String(a[sortBy]).localeCompare(String(b[sortBy]));
    });

    return list;
  }, [books, query, status, sortBy]);

  return (
    <div className="container">
      <header>
        <h1>📚 My Library</h1>
      </header>

      <section className="controls row">
        <SearchBar query={query} onChange={setQuery} />
        <StatusFilter status={status} onChange={setStatus} />
        <select className="filter" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="title">Sort: Title</option>
          <option value="author">Sort: Author</option>
          <option value="year">Sort: Year</option>
          <option value="status">Sort: Status</option>
        </select>
      </section>

      <main className="grid">
        <div>
          <BookForm
            editingBook={editing}
            onSubmit={handleUpsert}
            onCancel={() => setEditing(null)}
          />
        </div>
        <div>
          <BookList
            books={filtered}
            onEdit={setEditing}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />
        </div>
      </main>
    </div>
  );
}
