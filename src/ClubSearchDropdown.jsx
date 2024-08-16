import React, { useState } from 'react';
import { Search } from 'lucide-react';

// Assuming we have a list of club names from our data
const clubNames = [
  "Manchester City",
  "Manchester Utd",
  "Liverpool",
  "Chelsea",
  "Arsenal",
  "Tottenham",
  "West Ham Utd",
  "Leicester City",
  "Brighton",
  "Wolves",
  "Newcastle Utd",
  "Crystal Palace",
  "Brentford",
  "Aston Villa",
  "Southampton",
  "Everton",
  "Leeds Utd",
  "Watford",
  "Norwich City"
];

const ClubSearchDropdown = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClubs, setSelectedClubs] = useState([]);

  const filteredClubs = clubNames.filter(club =>
    club.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClubSelect = (club) => {
    if (!selectedClubs.includes(club)) {
      setSelectedClubs([...selectedClubs, club]);
    }
    setSearchTerm('');
  };

  const handleRemoveClub = (club) => {
    setSelectedClubs(selectedClubs.filter(c => c !== club));
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="relative">
        <input
          type="text"
          placeholder="Search for a club..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
      </div>
      
      {searchTerm && (
        <ul className="mt-2 bg-white border rounded-md shadow-lg">
          {filteredClubs.map(club => (
            <li
              key={club}
              onClick={() => handleClubSelect(club)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {club}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4">
        <h3 className="font-semibold mb-2">Selected Clubs:</h3>
        <ul className="space-y-2">
          {selectedClubs.map(club => (
            <li key={club} className="flex items-center justify-between bg-blue-100 px-3 py-1 rounded">
              {club}
              <button
                onClick={() => handleRemoveClub(club)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ClubSearchDropdown;