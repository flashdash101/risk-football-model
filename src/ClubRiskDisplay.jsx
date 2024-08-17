import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Search, X, AlertTriangle } from 'lucide-react';

const MAX_SELECTED_CLUBS = 3;

class Club {
  constructor(data) {
    this.name = data['Club'];
    this.score = data['Risk Score'] !== null ? parseFloat(data['Risk Score']) : null;
    this.strategies = data.strategies || [];
    this.category = data.Risk_Catgeogry || this.getCategory();
    this.revenue = data['Total Revenue (£m)'];
    this.wages = data['Annual Wages (£m)'];
    this.rank = data.Rank;
    this.points = data.Points;
    this.goalDifference = data['Goal Difference'];
  }

  getCategory() {
    if (this.score === null) return "Pending";
    if (this.score <= 30) return "Low risk";
    if (this.score <= 60) return "Medium risk";
    return "High risk";
  }

  getColor() {
    if (this.score === null) return "#9CA3AF";
    if (this.score < 33) return "#4CAF50";
    if (this.score < 66) return "#FFC107";
    return "#F44336";
  }

  getStrategy() {
    if (this.score <= 30) return "Maintain current financial strategy and explore growth opportunities.";
    if (this.score <= 60) return "Review expenses and consider optimizing revenue streams.";
    return "Urgent action required. Implement strict financial controls and seek additional funding sources.";
  }
}
//http://127.0.0.1:8000/api/clubs
//https://football-risk-assessment-mkj3ly2lna-uc.a.run.app/api/clubs
const fetchClubs = async () => {
  const response = await axios.get('https://football-risk-assessment3-mkj3ly2lna-uc.a.run.app/api/clubs');
  return response.data;
};
//http://127.0.0.1:8000/api/risk
//https://football-risk-assessment-mkj3ly2lna-uc.a.run.app/api/risk
const fetchRiskData = async (clubNames) => {
  const response = await axios.post('https://football-risk-assessment3-mkj3ly2lna-uc.a.run.app/api/risk', { club_names: clubNames });
  return response.data.clubs;
};

const CircularRiskMeter = ({ score, color }) => {
  if (score == null) {
    score = 12
  }
  const dashArray = 2 * Math.PI * 9;
  const dashOffset = score !== null && score !== undefined
    ? dashArray - (dashArray * score) / 100
    : dashArray;

  return (
    <div style={{ width: '30px', height: '30px', position: 'relative' }}>
      <svg width="30" height="30" viewBox="0 0 30 30">
        <circle cx="15" cy="15" r="12" fill="none" stroke="#4B5563" strokeWidth="3"/>
        <circle
          cx="15"
          cy="15"
          r="12"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={dashArray}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform="rotate(-90 15 15)"
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '12px', fontWeight: 'bold' }}>
          {score !== null && score !== undefined ? Math.round(score) : '-'}
        </span>
      </div>
    </div>
  );
};

const ClubCard = ({ club, onRemove }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#374151',
      padding: '8px 12px',
      borderRadius: '10px',
      marginBottom: '10px',
      // Add or modify these properties to control size and width
      width: '100%',  // Controls the width of the card
      maxWidth: '635px',  // Sets a maximum width
      minHeight: '60px',  // Sets a minimum height
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <CircularRiskMeter score={club.score} color={club.getColor()} />
        <div>
          <p style={{ fontWeight: 'bold', fontSize: '16px' }}>{club.name}</p>
          <p style={{ fontSize: '14px', color: '#9CA3AF' }}>{club.category}</p>
        </div>
      </div>
      <button onClick={() => onRemove(club.name)} style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}>
        <X size={20} />
      </button>
    </div>
  );
};

const SearchBar = ({ searchTerm, onSearch, onSelect, filteredClubs, isLoading }) => {
  return (
    <div style={{ position: 'relative', marginBottom: '12px' }}>
      <input
        type="text"
        placeholder="Search clubs..."
        value={searchTerm}
        onChange={onSearch}
        style={{
          width: '90%',
          padding: '8px 12px 8px 36px',
          backgroundColor: '#374151',
          color: 'white',
          border: '1px solid #4B5563',
          borderRadius: '6px',
          fontSize: '16px'
        }}
      />
      <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} size={20} />
      
      {searchTerm && !isLoading && (
        <ul style={{ 
          marginTop: '8px', 
          backgroundColor: '#374151', 
          border: '1px solid #4B5563', 
          borderRadius: '6px', 
          maxHeight: '200px', 
          overflowY: 'auto',
          listStyle: 'none',
          padding: 0
        }}>
          {filteredClubs.map(club => (
            <li
              key={club}
              onClick={() => onSelect(club)}
              style={{ padding: '8px 12px', cursor: 'pointer', fontSize: '16px' }}
            >
              {club}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const SelectedClubs = ({ clubs, onRemove }) => {
  return (
    <div style={{ marginTop: '20px' }}>
      <h3 style={{ fontWeight: 'bold', marginBottom: '12px', fontSize: '18px' }}>Selected Clubs:</h3>
      <div>
        {clubs.map(club => (
          <ClubCard key={club.name} club={club} onRemove={onRemove} />
        ))}
      </div>
    </div>
  );
};

const MaxClubsWarning = () => {
  console.log("the maximum has been reached")
  return (
    <div style={{ marginTop: '12px', color: '#FFC107', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <AlertTriangle size={20} />
      <span>Maximum of {MAX_SELECTED_CLUBS} clubs can be selected.</span>
    </div>
  );
};

const RiskAssessmentButton = ({ onClick, isPending }) => {
  return (
    <button
      onClick={onClick}
      disabled={isPending}
      style={{
        marginTop: '16px',
        padding: '8px 16px',
        backgroundColor: '#3B82F6',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        width: '100%',
      }}
    >
      {isPending ? 'Getting Risk Assessment...' : 'Get Risk Assessment'}
    </button>
  );
};

const StrategySuggestions = ({ clubs }) => {
  return (
    <div style={{ 
      marginTop: '20px', 
      backgroundColor: '#2D3748', 
      padding: '16px', 
      borderRadius: '8px',
      width: '100%',  // This ensures the box takes up the full width of its container
      maxWidth: '1000px',  // Adjust this value to set the maximum width of the box
      boxSizing: 'border-box',  // This ensures padding is included in the width
    }}>
      <h4 style={{ fontWeight: 'bold', marginBottom: '12px', fontSize: '18px' }}>Strategy Suggestions:</h4>
      {clubs.filter(club => club.score !== null).map(club => (
        <div key={club.name} style={{ marginBottom: '12px' }}>
          <p style={{ fontWeight: 'bold', fontSize: '16px' }}>{club.name}:</p>
          {club.strategies && club.strategies.length > 0 ? (
            club.strategies.map((strategy, index) => (
              <p key={index} style={{ fontSize: '14px', marginBottom: '4px' }}>{strategy}</p>
            ))
          ) : (
            <p style={{ fontSize: '14px', marginBottom: '4px' }}>No strategies available.</p>
          )}
        </div>
      ))}
    </div>
  );
};

const ClubRiskDisplay = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClubs, setSelectedClubs] = useState([]);
  const queryClient = useQueryClient();

  const { data: allClubs = [], isLoading: isLoadingClubs } = useQuery({
    queryKey: ['clubs'],
    queryFn: fetchClubs,
  });

  const riskMutation = useMutation({
    mutationFn: fetchRiskData,
    onSuccess: (data) => {
      console.log("Received data from API:", data);
      const updatedClubs = data.map(clubData => new Club(clubData));
      setSelectedClubs(updatedClubs);
    },
  });

  const filteredClubs = allClubs.filter(club =>
    club.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClubSelect = async (clubName) => {
    console.log("A club has been selected");
    if (selectedClubs.length < MAX_SELECTED_CLUBS && !selectedClubs.some(c => c.name === clubName)) {
      console.log("The club name is ", clubName);
      const newClub = new Club({ Club: clubName });
      setSelectedClubs(prevClubs => [...prevClubs, newClub]);
      
      // Immediately fetch risk data for the new club
      try {
        const data = await fetchRiskData([clubName]);
        const updatedClub = new Club(data[0]);
        setSelectedClubs(prevClubs => 
          prevClubs.map(club => club.name === clubName ? updatedClub : club)
        );
      } catch (error) {
        console.error("Error fetching risk data:", error);
      }
    }
    setSearchTerm('');
  };

  const handleRemoveClub = (clubName) => {
    setSelectedClubs(selectedClubs.filter(c => c.name !== clubName));
  };

  const handleGetRiskAssessment = () => {
    console.log("Getting the risk assessment.");
    const clubNames = selectedClubs.map(club => club.name);
    riskMutation.mutate(clubNames);
  };

  return (
    <div style={{ 
      maxWidth: '1000px',  // Increased from 400px to accommodate wider StrategySuggestions
      margin: '0 auto', 
      padding: '20px', 
      backgroundColor: '#1F2937', 
      borderRadius: '12px',
      boxSizing: 'border-box',  // Ensures padding is included in the width
    }}>
      <SearchBar
        searchTerm={searchTerm}
        onSearch={handleSearch}
        onSelect={handleClubSelect}
        filteredClubs={filteredClubs}
        isLoading={isLoadingClubs}
      />

      {riskMutation.isPending && <p>Loading risk assessments...</p>}
      {riskMutation.isError && <p style={{ color: '#F44336' }}>Error: {riskMutation.error.message}</p>}

      <SelectedClubs clubs={selectedClubs} onRemove={handleRemoveClub} />

      {selectedClubs.length === MAX_SELECTED_CLUBS && <MaxClubsWarning />}

      {selectedClubs.some(club => club.score !== null) && (
        <StrategySuggestions clubs={selectedClubs} />
      )}
    </div>
  );
};

export default ClubRiskDisplay;