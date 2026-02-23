import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// --- Mock the custom hook to behave like useState (no real localStorage) ---
jest.mock('./hooks/useLocalStorage', () => {
  return {
    __esModule: true,
    default: (key, defaultValue) => {
      const React = require('react');
      const [state, setState] = React.useState(defaultValue);
      return [state, setState];
    },
  };
});

// --- Mock child components using .js filenames ---

// SearchBar: textbox that calls onChange
jest.mock('./components/SearchBar.js', () => ({
  __esModule: true,
  default: ({ query, onChange }) => (
    <label>
      Search
      <input
        aria-label="search"
        placeholder="Search books"
        value={query}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  ),
}));

// StatusFilter: select with ALL / Available / Borrowed
jest.mock('./components/StatusFilter.js', () => ({
  __esModule: true,
  default: ({ status, onChange }) => (
    <label>
      Status
      <select
        aria-label="status-filter"
        value={status}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="ALL">ALL</option>
        <option value="Available">Available</option>
        <option value="Borrowed">Borrowed</option>
      </select>
    </label>
  ),
}));

// BookForm: a button that fires onSubmit with a sample book
jest.mock('./components/BookForm.js', () => ({
  __esModule: true,
  default: ({ editingBook, onSubmit, onCancel }) => (
    <div>
      <button
        type="button"
        onClick={() =>
          onSubmit({
            id: '99',
            title: 'Refactoring',
            author: 'Martin Fowler',
            year: 1999,
            status: 'Available',
          })
        }
      >
        Add Sample Book
      </button>
      {editingBook ? (
        <button type="button" onClick={onCancel}>
          Cancel Edit
        </button>
      ) : null}
    </div>
  ),
}));

// BookList: render a UL so we can read titles
jest.mock('./components/BookList.js', () => ({
  __esModule: true,
  default: ({ books }) => (
    <ul aria-label="book-list">
      {books.map((b) => (
        <li key={b.id}>
          <span className="title">{b.title}</span>{' '}
          <span className="author">({b.author})</span>
        </li>
      ))}
    </ul>
  ),
}));

import App from './App';

// Helper: get current list of titles
const getTitles = () => {
  const list = screen.getByRole('list', { name: /book-list/i });
  return within(list)
    .getAllByText(/.*/, { selector: 'li .title' })
    .map((el) => el.textContent);
};

describe('App', () => {
  test('renders header and initial seed books', () => {
    render(<App />);
    // Header
    expect(screen.getByRole('heading', { name: /my library/i })).toBeInTheDocument();
    // Seed books
    const titles = getTitles();
    expect(titles).toEqual(
      expect.arrayContaining(['Clean Code', 'The Pragmatic Programmer'])
    );
  });

  test('filters by search query', async () => {
    render(<App />);
    const search = screen.getByRole('textbox', { name: /search/i });

    await userEvent.clear(search);
    await userEvent.type(search, 'clean');

    expect(getTitles()).toEqual(['Clean Code']);
  });

  test('filters by status', async () => {
    render(<App />);
    const statusSelect = screen.getByRole('combobox', { name: /status-filter/i });

    await userEvent.selectOptions(statusSelect, 'Borrowed');

    expect(getTitles()).toEqual(['The Pragmatic Programmer']);
  });

  test('changes sort order (author)', async () => {
    render(<App />);

    // App renders TWO selects:
    // 1) Status (mocked)     2) Sort (real)
    // Pick the second one for sorting to avoid ambiguous text queries.
    const sortSelect = screen.getAllByRole('combobox')[1];

    await userEvent.selectOptions(sortSelect, 'author');

    // Author alphabetical: "Andrew Hunt" vs "Robert C. Martin" => Pragmatic first
    const titles = getTitles();
    expect(titles[0]).toBe('The Pragmatic Programmer');
  });

  test('adds a new book via BookForm', async () => {
    render(<App />);

    await userEvent.click(screen.getByRole('button', { name: /add sample book/i }));

    expect(getTitles()).toEqual(expect.arrayContaining(['Refactoring']));
  });
})