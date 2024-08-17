import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Card from './Card.jsx'
import ClubSearchDropdown from './ClubSearchDropdown.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
function App() {

  const queryClient = new QueryClient();
  return (
    <>
      <QueryClientProvider client={queryClient}>
     <Card
        heading="Dynamic Risk Managment"
        paragraph="Select a club and receive strategies!"
        // imageUrl="https://via.placeholder.com/150"
      />
      </QueryClientProvider>
    </>
  );
}

export default App
