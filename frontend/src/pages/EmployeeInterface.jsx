import { useState, useEffect } from 'react';
import { getComplaints, updateComplaintStatus } from '../api/backend';
import Sidebar from '../components/Sidebar';
import { Search, Filter, Clock, AlertCircle, CheckCircle, User, MessageSquare, Inbox } from 'lucide-react';
import { format } from 'date-fns';

const EmployeeInterface = () => {
    const [complaints, setComplaints] = useState([]);
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [resolutionNote, setResolutionNote] = useState('');
    const [filter, setFilter] = useState('All');

    // Derived Logic
    const selectedTicket = complaints.find(c => c._id === selectedTicketId);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const { data } = await getComplaints();
            setComplaints(data.complaints || []);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async (newStatus) => {
        if (!selectedTicketId) return;
        try {
            const { data } = await updateComplaintStatus(selectedTicketId, {
                status: newStatus,
                resolutionNotes: resolutionNote
            });
            // Optimistic update
            setComplaints(prev => prev.map(c => c._id === selectedTicketId ? data : c));
            if (newStatus === 'Resolved') setResolutionNote('');
        } catch (err) {
            alert('Update failed');
        }
    };

    const filteredList = complaints
        .filter(c => filter === 'All' || c.status === filter)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
        <div className="full-screen">
            <Sidebar role="Agent" />

            {/* Middle Pane: Ticket List */}
            <div style={{
                width: '380px',
                background: 'var(--bg-app)',
                borderRight: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div style={{ position: 'relative', marginBottom: '1rem' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                        <input
                            className="input"
                            placeholder="Search tickets..."
                            style={{ paddingLeft: '2.5rem', background: 'var(--bg-panel)', borderColor: 'var(--border-subtle)' }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {['All', 'Open', 'Resolved'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                style={{
                                    fontSize: '0.8rem', padding: '0.3rem 0.75rem', borderRadius: '6px',
                                    border: '1px solid',
                                    borderColor: filter === f ? 'var(--primary)' : 'var(--border-strong)',
                                    background: filter === f ? 'var(--primary)' : 'transparent',
                                    color: filter === f ? '#fff' : 'var(--text-secondary)',
                                    cursor: 'pointer'
                                }}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {isLoading ? <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>Loading...</div> : filteredList.map(c => (
                        <div
                            key={c._id}
                            onClick={() => setSelectedTicketId(c._id)}
                            style={{
                                padding: '1rem 1.25rem',
                                borderBottom: '1px solid var(--border-subtle)',
                                cursor: 'pointer',
                                background: selectedTicketId === c._id ? 'var(--bg-surface)' : 'transparent',
                                borderLeft: selectedTicketId === c._id ? '3px solid var(--primary)' : '3px solid transparent',
                                transition: 'background 0.15s'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <span className={`badge badge-${c.priority.toLowerCase()}`} style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>{c.priority}</span>
                                    <span className={`badge badge-${c.status === 'Resolved' ? 'resolved' : 'open'}`} style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>{c.status}</span>
                                </div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{format(new Date(c.createdAt), 'MMM d')}</span>
                            </div>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: selectedTicketId === c._id ? '#fff' : 'var(--text-main)', marginBottom: '0.25rem' }}>
                                {c.category}
                            </h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {c.text}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Pane: Reading View */}
            <div style={{ flex: 1, background: 'var(--bg-panel)', display: 'flex', flexDirection: 'column' }}>
                {selectedTicket ? (
                    <>
                        {/* Ticket Header */}
                        <div style={{ padding: '2rem', borderBottom: '1px solid var(--border-subtle)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff' }}>{selectedTicket.category}</h1>
                                        <span className={`badge badge-${selectedTicket.status === 'Resolved' ? 'resolved' : 'open'}`}>
                                            {selectedTicket.status}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={16} /> {format(new Date(selectedTicket.createdAt), 'PPpp')}</span>
                                        <span style={{ fontFamily: 'monospace' }}>#{selectedTicket.trackingCode}</span>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>User ID</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                                        <User size={16} /> {selectedTicket.user_id.substring(0, 8)}...
                                    </div>
                                </div>
                            </div>

                            {/* Reference Order */}
                            {selectedTicket.orderId && (
                                <div style={{
                                    display: 'inline-flex', padding: '0.75rem 1rem', background: 'var(--bg-app)',
                                    border: '1px solid var(--border-strong)', borderRadius: '8px', fontSize: '0.9rem'
                                }}>
                                    <span style={{ color: 'var(--text-secondary)', marginRight: '0.5rem' }}>Ref Order:</span>
                                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{selectedTicket.orderId}</span>
                                </div>
                            )}
                        </div>

                        {/* Ticket Body / Conversation */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
                            <div style={{ maxWidth: '800px' }}>
                                <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '1rem' }}>Original Complaint</h3>
                                <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: 'var(--text-main)', marginBottom: '3rem' }}>
                                    {selectedTicket.text}
                                </p>

                                {/* Resolution Section */}
                                <div style={{ paddingTop: '2rem', borderTop: '1px solid var(--border-subtle)' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <MessageSquare size={20} color="var(--primary)" />
                                        Reponse & Action
                                    </h3>

                                    {selectedTicket.status === 'Resolved' ? (
                                        <div style={{ padding: '1.5rem', background: 'var(--success-bg)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '12px' }}>
                                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                                <CheckCircle style={{ color: 'var(--success-text)' }} />
                                                <div>
                                                    <div style={{ color: 'var(--success-text)', fontWeight: 600, marginBottom: '0.5rem' }}>Resolved</div>
                                                    <p style={{ color: 'var(--text-main)' }}>{selectedTicket.resolutionNotes}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ background: 'var(--bg-app)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-strong)' }}>
                                            <textarea
                                                className="textarea"
                                                rows={5}
                                                placeholder="Write your resolution response here..."
                                                value={resolutionNote}
                                                onChange={(e) => setResolutionNote(e.target.value)}
                                                style={{ marginBottom: '1rem', background: 'var(--bg-panel)' }} // Slightly lighter for input
                                            />
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                                <button
                                                    onClick={() => handleUpdate('In Progress')}
                                                    className="btn btn-secondary"
                                                >
                                                    Mark In Progress
                                                </button>
                                                <button
                                                    onClick={() => handleUpdate('Resolved')}
                                                    className="btn btn-primary"
                                                >
                                                    Resolve & Close
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                            <Inbox size={32} opacity={0.5} />
                        </div>
                        <p>Select a ticket from the list to view details</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployeeInterface;
