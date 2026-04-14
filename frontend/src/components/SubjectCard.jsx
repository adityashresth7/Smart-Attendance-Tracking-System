import { useContext } from 'react';
import { SubjectContext } from '../context/SubjectContext';
import { AuthContext } from '../context/AuthContext';
import { Check, X } from 'lucide-react';

const SubjectCard = ({ subject }) => {
  // Grab the markAttendance function from our global Subject state
  const { markAttendance } = useContext(SubjectContext);
  // Grab the currently logged-in user to access their preferences
  const { user } = useContext(AuthContext);

  // --- ATTENDANCE CALCULATIONS ---
  
  // Calculate the current attendance percentage. If total classes is 0, avoid division by zero and return 0.
  const percentage = subject.totalClasses === 0 ? 0 : ((subject.attendedClasses / subject.totalClasses) * 100).toFixed(1);
  
  // Get the user's target attendance goal from their profile. Defaults to 75% if not set.
  const target = user?.targetAttendance || 75;
  
  // Boolean flag to quickly check if the student is currently above or equal to their target
  const isSafe = percentage >= target;

  /**
   * Calculates how many consecutive classes the student MUST attend to reach their target percentage.
   * Formula derived from: (attended + x) / (total + x) = target / 100
   */
  const getRequiredClasses = () => {
    const p = target / 100; // Convert percentage to a decimal (e.g., 75 -> 0.75)
    // Math.ceil rounds up to ensure we get a whole number of classes
    const req = Math.ceil((p * subject.totalClasses - subject.attendedClasses) / (1 - p));
    // If the requirement is negative, they are already safe, so return 0
    return req > 0 ? req : 0;
  };
  const requiredClasses = getRequiredClasses();

  /**
   * Calculates how many consecutive classes the student can SAFELY MISS without dropping below the target.
   * Formula derived from: attended / (total + y) = target / 100
   */
  const getSafeBunks = () => {
    const p = target / 100;
    if (p === 0) return 0; // Prevent division by zero if target is 0%
    // Math.floor rounds down to ensure we don't accidentally say it's safe to skip a full class when it's really 0.8
    const bunks = Math.floor((subject.attendedClasses - p * subject.totalClasses) / p);
    // If bunks is negative, they can't skip any, so return 0
    return bunks > 0 ? bunks : 0;
  };
  // Only calculate safe bunks if they are currently safe, otherwise default to 0
  const safeBunks = isSafe ? getSafeBunks() : 0;

  // --- UI RENDERING ---

  return (
    // Main wrapper for the card. Uses a glassmorphism aesthetic and flexbox for layout
    <div className="glass" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      
      {/* Left-side visual indicator: A thin border element that dynamically changes color based on 'isSafe' */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', background: isSafe ? 'var(--success)' : 'var(--danger)' }}></div>
      
      {/* Card Header: Contains the subject name */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{subject.name}</h3>
      </div>

      {/* Main Content Area: Circular progress bar and statistics text */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Dynamic circular progress bar using 'conic-gradient'. Color is green if safe, red if in danger. */}
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: `conic-gradient(${isSafe ? 'var(--success)' : 'var(--danger)'} ${percentage}%, var(--surface-border) 0)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Inner circle mask to make it look like a hollow ring instead of a pie chart */}
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--surface-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 'bold' }}>
            {percentage}%
          </div>
        </div>
        
        {/* Statistics Text Group */}
        <div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Classes Total</p>
          <p style={{ fontSize: '1.2rem', fontWeight: '600' }}>{subject.attendedClasses} / {subject.totalClasses}</p>
          
          {/* Conditional rendering for dynamic feedback text (bunks vs needed classes) */}
          {requiredClasses > 0 ? (
            // Danger state: Show how many classes are needed to recover
            <p style={{ fontSize: '0.85rem', color: 'var(--danger)', marginTop: '0.35rem', fontWeight: '500' }}>
              Attend {requiredClasses} more class{requiredClasses > 1 ? 'es' : ''} to reach {target}%
            </p>
          ) : (
            // Safe state: Confirm they are on track, or show safe bunks if total classes > 0
            subject.totalClasses > 0 && (
              <p style={{ fontSize: '0.85rem', color: 'var(--success)', marginTop: '0.35rem', fontWeight: '500' }}>
                {safeBunks > 0 
                  ? `Safe to bunk ${safeBunks} class${safeBunks > 1 ? 'es' : ''}` // Has leeway to bunk
                  : `On track (${target}% met)`} {/* On the exact borderline, cannot bunk yet */}
              </p>
            )
          )}
        </div>
      </div>

      {/* Footer Area: Action buttons to mark attendance */}
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
        {/* Present Button - Triggers 'markAttendance' from Context with 'present' payload */}
        <button onClick={() => markAttendance(subject._id, 'present')} className="btn btn-primary" style={{ flex: 1, padding: '0.6rem', fontSize: '0.9rem' }}>
          <Check size={16} strokeWidth={3} /> Present
        </button>
        {/* Absent Button - Triggers 'markAttendance' from Context with 'absent' payload */}
        <button onClick={() => markAttendance(subject._id, 'absent')} className="btn btn-outline" style={{ flex: 1, padding: '0.6rem', fontSize: '0.9rem' }}>
          <X size={16} strokeWidth={3} /> Absent
        </button>
      </div>
    </div>
  );
};

export default SubjectCard;
