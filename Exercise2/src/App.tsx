
import { useId, useState } from 'react';
import { SMART_PEOPLE } from './data/smartPeople';
import type { Scientist, SortOption } from './types/scientist';
import styles from './App.module.css';

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
      const difference = sortBy === 'iq'
        ? b.iq - a.iq
        : b.age - a.age;

      return difference !== 0 ? difference : a.id.localeCompare(b.id);
    });

  const handleDelete = (id: string) => {
    setPeople((prev) => prev.filter((person) => person.id !== id));
  };

  const handleReset = () => {
    setPeople([...SMART_PEOPLE]);
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>INTERACTIVE DIRECTORY</p>
        <h1>Scientist & Pioneer Directory</h1>
        <p className={styles.subtitle}>
          Explore influential minds and discover their achievements.
        </p>
      </header>

      <section
        className={styles.directory}
        aria-labelledby="scientists-heading"
      >
        <div className={styles.sectionHeader}>
          <h2 id="scientists-heading">Scientists</h2>
          <button
            type="button"
            className={styles.resetButton}
            onClick={handleReset}
          >
            Reset Directory
          </button>
        </div>

        <div className={styles.filters}>
          <div className={styles.field}>
            <label htmlFor={searchId}>Search by name</label>
            <input
              id={searchId}
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Enter scientist name"
            />
          </div>

          <div className={styles.field}>
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
              placeholder="Minimum IQ"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor={sortId}>Sort by</label>
            <select
              id={sortId}
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value as SortOption)
              }
            >
              <option value="iq">IQ (High to Low)</option>
              <option value="age">Age (Oldest First)</option>
            </select>
          </div>
        </div>

        <div className={styles.resultsHeader}>
          <output role="status" aria-live="polite">
            Showing {visiblePeople.length} of {people.length} scientists
          </output>
        </div>

        {visiblePeople.length === 0 ? (
          <p className={styles.emptyState}>
            No scientists match your current filters.
          </p>
        ) : (
          <ul className={styles.peopleList}>
            {visiblePeople.map((person) => (
              <li className={styles.personCard} key={person.id}>
                <div className={styles.personInfo}>
                  <h3>{person.name}</h3>
                  <div className={styles.details}>
                    <span>Age: {person.age}</span>
                    <span>IQ: {person.iq}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={() => handleDelete(person.id)}
                  aria-label={`Delete ${person.name}`}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;
