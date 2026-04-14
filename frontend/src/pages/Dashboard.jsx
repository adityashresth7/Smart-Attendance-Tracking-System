import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { SubjectContext } from '../context/SubjectContext';
import Navbar from '../components/Navbar';
import SubjectCard from '../components/SubjectCard';

const Dashboard = () => {
  // Pull in user data to display the greeting and target attendance
  const { user } = useContext(AuthContext);
  // Pull in the array of subjects to display the grid of cards
  const { subjects } = useContext(SubjectContext);

  /**
   * Calculates the overall attendance percentage spanning all subjects combined.
   * Total Attended Classes / Total Overall Classes classes * 100
   */
  const calculateTotalPercentage = () => {
    // If no subjects exist, they are technically at 0%
    if (subjects.length === 0) return 0;
    
    // .reduce() loops through all subjects and sums up the totalClasses count
    const total = subjects.reduce((acc, curr) => acc + curr.totalClasses, 0);
    // Same for attendedClasses
    const attended = subjects.reduce((acc, curr) => acc + curr.attendedClasses, 0);
    
    // Avoid division by zero
    return total === 0 ? 0 : ((attended / total) * 100).toFixed(1);
  };

  return (
    // Main page wrapper, spanning the full height of the viewport
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      {/* Top navigation bar */}
      <Navbar />
      
      {/* Main content area, centered with a max-width for large screens */}
      <main style={{ flex: 1, padding: '2rem', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header section containing greeting and overall stat box */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>Dashboard</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Welcome back, {user?.name}</p>
          </div>
          
          {/* Glassmorphism box showing overall attendance statistic */}
          <div className="glass" style={{ padding: '1rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '150px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Overall Attendance</span>
            {/* Dynamically turns green or red depending on if the overall percentage beats the user's target */}
            <span style={{ fontSize: '2rem', fontWeight: 'bold', color: calculateTotalPercentage() >= (user?.targetAttendance || 75) ? 'var(--success)' : 'var(--danger)' }}>
              {calculateTotalPercentage()}%
            </span>
          </div>
        </header>

        {/* Section Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '3rem', marginBottom: '1.5rem' }}>
          <h2>Your Subjects</h2>
        </div>

        {/* CSS Grid layout for the subject cards. Automatically fits as many as possible per row. */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {/* Loop over the subjects array and render a SubjectCard component for each one */}
          {subjects.map(subject => (
            <SubjectCard key={subject._id} subject={subject} />
          ))}
          
          {/* If the user has 0 subjects, display a helpful empty state message instead of a blank page */}
          {subjects.length === 0 && (
            <div className="glass" style={{ padding: '3rem', textAlign: 'center', gridColumn: '1 / -1', color: 'var(--text-secondary)' }}>
              <p>No subjects actively added yet! Head to the Subjects menu to track one.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
