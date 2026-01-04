'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Character {
  id: string;
  name: string;
  portrait: string;
}

export default function CharacterSelector() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch characters on mount
  useEffect(() => {
    async function fetchCharacters() {
      try {
        const res = await fetch('/api/characters');
        if (!res.ok) throw new Error('Failed to load characters');
        const data: Character[] = await res.json();
        setCharacters(data);
      } catch (err) {
        setError('Could not load characters. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchCharacters();
  }, []);

  const handleSelect = (char: Character) => {
    setSelectedCharacter(char);
  };

  const handleConfirm = () => {
    if (selectedCharacter) {
      console.log('Selected:', selectedCharacter);
      // Later: router.push('/game?character=' + selectedCharacter.id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-3xl">Loading fighters...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-3xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-bold mb-12 text-center">SELECT YOUR FIGHTER</h1>

      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 max-w-6xl">
        {characters.map((char) => (
          <div
            key={char.id}
            onClick={() => handleSelect(char)}
            className={`relative cursor-pointer transition-all duration-300 ${
              selectedCharacter?.id === char.id
                ? 'scale-110 ring-4 ring-yellow-400 shadow-2xl'
                : 'hover:scale-105'
            }`}
          >
            <div className="bg-gray-800 rounded-lg overflow-hidden border-4 border-gray-700">
              <Image
                src={char.portrait}
                alt={char.name}
                width={200}
                height={250}
                className="object-cover w-full h-full"
              />
            </div>
            <p className="text-center mt-2 text-lg font-semibold">{char.name}</p>
          </div>
        ))}
      </div>

      {selectedCharacter && (
        <div className="mt-12 flex flex-col items-center">
          <h2 className="text-3xl mb-4">Selected: {selectedCharacter.name}</h2>
          <Image
            src={selectedCharacter.portrait}
            alt={selectedCharacter.name}
            width={300}
            height={400}
            className="rounded-lg shadow-2xl"
          />
          <button
            onClick={handleConfirm}
            className="mt-8 px-12 py-4 bg-red-600 hover:bg-red-700 text-2xl font-bold rounded-lg transition"
          >
            FIGHT!
          </button>
        </div>
      )}
    </div>
  );
}
