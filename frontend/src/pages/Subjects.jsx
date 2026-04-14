import { useContext, useState } from 'react';
import { SubjectContext } from '../context/SubjectContext';
import Navbar from '../components/Navbar';
import { Trash2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Subjects = () => {
  const { user } = useContext(AuthContext);
  const { subjects, addSubject, deleteSubject } = useContext(SubjectContext);
  const [newSubject, setNewSubject] = useState({ name: '', totalClasses: 0, attendedClasses: 0 });

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    await addSubject(newSubject.name, parseInt(newSubject.totalClasses), parseInt(newSubject.attendedClasses));
    setNewSubject({ name: '', totalClasses: 0, attendedClasses: 0 });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      <Navbar />
      <main style={{ flex: 1, padding: '2rem', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>Manage Subjects</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Add or delete your tracked subjects here.</p>
        </header>

        <div className="glass" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Add New Subject</h2>
          <form onSubmit={handleAddSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 200px' }}>
              <label className="input-label">Subject Name</label>
              <input type="text" className="input-field" style={{ marginBottom: 0 }} value={newSubject.name} onChange={e => setNewSubject({...newSubject, name: e.target.value})} required />
            </div>
            <div style={{ flex: '1 1 100px' }}>
              <label className="input-label">Total Classes</label>
              <input type="number" className="input-field" style={{ marginBottom: 0 }} value={newSubject.totalClasses} onChange={e => setNewSubject({...newSubject, totalClasses: e.target.value, attendedClasses: parseInt(newSubject.attendedClasses) > parseInt(e.target.value) ? e.target.value : newSubject.attendedClasses})} min="0" />
            </div>
            <div style={{ flex: '1 1 100px' }}>
              <label className="input-label">Attended</label>
              <input type="number" className="input-field" style={{ marginBottom: 0 }} value={newSubject.attendedClasses} onChange={e => {
                const val = parseInt(e.target.value) || 0;
                const max = parseInt(newSubject.totalClasses) || 0;
                setNewSubject({...newSubject, attendedClasses: val > max ? max : val});
              }} min="0" max={newSubject.totalClasses} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.875rem 2rem' }}>Add Subject</button>
          </form>
        </div>

        <div className="glass" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--surface-border)' }}>
             <h2 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--text-primary)' }}>Existing Setup</h2>
          </div>
          {subjects.length === 0 && (
             <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
               <p>No subjects actively added yet! Use the form above to initialize tracking.</p>
             </div>
          )}
          {subjects.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {subjects.map(subject => {
                const percentage = subject.totalClasses === 0 ? 0 : ((subject.attendedClasses / subject.totalClasses) * 100).toFixed(1);
                return (
                 <div key={subject._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', borderBottom: '1px solid var(--surface-border)' }}>
                    <div>
                       <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.4rem 0' }}>{subject.name}</h3>
                       <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: '1.5rem' }}>
                          <span>Attended: <strong style={{color: 'var(--text-primary)'}}>{subject.attendedClasses}</strong> / {subject.totalClasses}</span>
                          <span>Percentage: <strong style={{ color: percentage >= (user?.targetAttendance || 75) ? 'var(--success)' : 'var(--danger)' }}>{percentage}%</strong></span>
                       </div>
                    </div>
                    <button onClick={() => deleteSubject(subject._id)} className="btn btn-outline" style={{ padding: '0.5rem', color: 'var(--danger)', borderColor: 'var(--surface-border)' }} title="Delete Subject">
                      <Trash2 size={18} />
                    </button>
                 </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Subjects;
