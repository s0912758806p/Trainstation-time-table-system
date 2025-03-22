import { useState } from 'react';

const Input: React.FC = () => {
  const [search, setSearch] = useState<string>('');

  return (
    <>
      <div>
        <input
          type="text"
          value={search}
          onChange={() => setSearch((search) => search)}
        />
      </div>
    </>
  );
};

export default Input;
