import { useEffect, useState } from 'react';
import { getComplaints, updateComplaint } from '../api/backend';
import { useAuth } from '../components/AuthProvider';

const EmployeeDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const { logout } = useAuth();
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [resolutionNote, setResolutionNote] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const { data } = await getComplaints();
        setComplaints(data.complaints || []);
    };

    const handleUpdate = async (status) => {
        if (!selectedTicket) return;
        try {
            await updateComplaint(selectedTicket._id, {
                status,
                resolutionNotes: resolutionNote
            });
            alert(`Ticket updated to ${status}`);
            setSelectedTicket(null);
            fetchData(); // Refresh
        } catch (err) {
            console.error(err);
            alert('Failed to update');
        }
    };

    return (
        <div className="container">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="heading" style={{ margin: 0 }}>Employee Workspace</h1>
                <button onClick={logout} className="btn">Logout</button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Ticket List */}
                <div>
                    <h3>Work Queue</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {complaints.filter(c => c.status !== 'Closed').map(c => (
                            <div
                                key={c._id}
                                className="card"
                                style={{ cursor: 'pointer', border: selectedTicket?._id === c._id ? '2px solid var(--primary)' : '1px solid var(--border)' }}
                                onClick={() => setSelectedTicket(c)}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <strong>{c.category}</strong>
                                    <span className={`badge badge-${c.priority.toLowerCase()}`}>{c.priority}</span>
                                </div>
                                <p style={{ fontSize: '0.875rem', margin: '0.5rem 0' }}>{c.text.substring(0, 80)}...</p>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Code: {c.trackingCode}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Panel */}
                <div>
                    {selectedTicket ? (
                        <div className="card" style={{ position: 'sticky', top: '2rem' }}>
                            <h2>Ticket Actions</h2>
                            <div style={{ marginBottom: '1rem' }}>
                                <p><strong>Tracking:</strong> {selectedTicket.trackingCode}</p>
                                <p><strong>Issue:</strong> {selectedTicket.text}</p>
                                {selectedTicket.orderId && <p><strong>Order ID:</strong> {selectedTicket.orderId}</p>}
                            </div>

                            <textarea
                                className="input"
                                rows="4"
                                placeholder="Resolution notes..."
                                value={resolutionNote}
                                onChange={(e) => setResolutionNote(e.target.value)}
                                style={{ marginBottom: '1rem' }}
                            />

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button className="btn" style={{ background: '#f59e0b', color: '#000' }} onClick={() => handleUpdate('In Progress')}>
                                    In Progress
                                </button>
                                <button className="btn" style={{ background: '#10b981', color: '#fff' }} onClick={() => handleUpdate('Resolved')}>
                                    Resolve
                                </button>
                                <button className="btn" style={{ background: '#64748b', color: '#fff' }} onClick={() => handleUpdate('Closed')}>
                                    Close
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                            <p>Select a ticket to begin work.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
