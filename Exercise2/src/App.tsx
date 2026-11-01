
import { useId, useState } from 'react';
import { SMART_PEOPLE } from './data/smartPeople';
import type { Scientist } from './types/scientist';

function App() {
  const [people] = useState<Scientist[]>(() => [...SMART_PEOPLE]);
  const [searchQuery, setSearchQuery] = useState('');

  const searchId = useId();

  // Danh sách hiển thị được tính trực tiếp từ state.
  const visiblePeople = people.filter((person) =>
    person.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

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
