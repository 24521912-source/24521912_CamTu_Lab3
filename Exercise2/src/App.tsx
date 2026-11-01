
import { useId, useState } from 'react';
import { SMART_PEOPLE } from './data/smartPeople';
import type { Scientist, SortOption } from './types/scientist';

function App() {
  const [people, setPeople] = useState<Scientist[]>(() => [...SMART_PEOPLE]);
  const [searchQuery, setSearchQuery] = useState('');
  const [minimumIQ, setMinimumIQ] = useState<number>(0);
  const [sortBy, setSortBy] = useState<SortOption>('iq');

  const searchId = useId();
  const iqId = useId();
  const sortId = useId();

  const visiblePeople = people
    .filter((person) => {
      const matchesName = person.name
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase());

      return matchesName && person.iq >= minimumIQ;
    })
    .toSorted((a, b) => {
      const difference =
        sortBy === 'iq' ? b.iq - a.iq : b.age - a.age;

      return difference !== 0 ? difference : a.id.localeCompare(b.id);
    });

  const handleDelete = (id: string) => {
    setPeople((prev) => prev.filter((person) => person.id !== id));
  };

  // Khôi phục danh sách gốc bằng một mảng mới.
  const handleReset = () => {
    setPeople([...SMART_PEOPLE]);
  };

  return (
    <main>
      <header>
        <h1>Scientist & Pioneer Directory</h1>
        <p>Explore the scientists and pioneers in our directory.</p>
      </header>

      <section aria-labelledby="scientists-heading">
        <h2 id="scientists-heading">Scientists</h2>

        <label htmlFor={searchId}>Search by name</label>
        <input
          id={searchId}
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Enter scientist name"
        />

        <label htmlFor={iqId}>Minimum IQ</label>
        <input
          id={iqId}
          type="number"
          min="0"
          step="1"
          value={minimumIQ === 0 ? '' : minimumIQ}
          onChange={(event) => {
            const value = event.currentTarget.valueAsNumber;
            setMinimumIQ(Number.isNaN(value) ? 0 : value);
          }}
          placeholder="Enter minimum IQ"
        />

        <label htmlFor={sortId}>Sort by</label>
        <select
          id={sortId}
          value={sortBy}
          onChange={(event) =>
            setSortBy(event.target.value as SortOption)
          }
        >
          <option value="iq">IQ (High to Low)</option>
          <option value="age">Age (Oldest to Youngest)</option>
        </select>

        <button type="button" onClick={handleReset}>
          Reset
        </button>

        <ul>
          {visiblePeople.map((person) => (
            <li key={person.id}>
              <h3>{person.name}</h3>
              <p>Age: {person.age}</p>
              <p>IQ: {person.iq}</p>
              <button
                type="button"
                onClick={() => handleDelete(person.id)}
                aria-label={`Delete ${person.name}`}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default App;
