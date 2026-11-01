
import { useState } from 'react';
import { SMART_PEOPLE } from './data/smartPeople';
import type { Scientist } from './types/scientist';

function App() {
  const [people] = useState<Scientist[]>(() => [...SMART_PEOPLE]);

  return (
    <main>
      <header>
        <h1>Scientist & Pioneer Directory</h1>
        <p>Explore the scientists and pioneers in our directory.</p>
      </header>

      <section aria-labelledby="scientists-heading">
        <h2 id="scientists-heading">Scientists</h2>

        <ul>
          {people.map((person) => (
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
