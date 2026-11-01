
import { useId, useState } from 'react';
import { SMART_PEOPLE } from './data/smartPeople';
import type { Scientist } from './types/scientist';

function App() {
  const [people] = useState<Scientist[]>(() => [...SMART_PEOPLE]);
  const [searchQuery, setSearchQuery] = useState('');
  const [minimumIQ, setMinimumIQ] = useState<number>(0);

  const searchId = useId();
  const iqId = useId();

  // Kết hợp tìm kiếm tên và lọc IQ.
  const visiblePeople = people.filter((person) => {
    const matchesName = person.name
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase());

    const matchesIQ = person.iq >= minimumIQ;

    return matchesName && matchesIQ;
  });

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

            // Input trống hoặc không hợp lệ sẽ trở về 0.
            setMinimumIQ(Number.isNaN(value) ? 0 : value);
          }}
          placeholder="Enter minimum IQ"
        />

        <ul>
          {visiblePeople.map((person) => (
            <li key={person.id}>
              <h3>{person.name}</h3>
              <p>Age: {person.age}</p>
              <p>IQ: {person.iq}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default App;
