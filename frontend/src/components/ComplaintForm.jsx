import { useState } from 'react';
import { createComplaint } from '../api/backend';
import { Sparkles } from 'lucide-react';

const ComplaintForm = ({ onSuccess }) => {
    const [text, setText] = useState('');
    const [orderId, setOrderId] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await createComplaint({ text, orderId, category });
            setText('');
            setOrderId('');
            setCategory('');
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error(err);
            setError('Failed to submit. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="panel">
            <div className="panel-header">
                <div>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>New Ticket</h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Describe your issue in detail.</p>
                </div>
            </div>

            <div className="panel-body">
                {error && <div style={{ color: 'var(--danger-text)', background: 'var(--danger-bg)', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="label">Category</label>
                        <select className="select" value={category} onChange={e => setCategory(e.target.value)} required>
                            <option value="">Select Category...</option>
                            {['Delivery Issue', 'Billing', 'Account', 'Technical', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="label">Order ID (Optional)</label>
                        <input className="input" placeholder="e.g. #ORD-12345" value={orderId} onChange={e => setOrderId(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label className="label">Description</label>
                        <textarea
                            className="textarea"
                            rows={6}
                            placeholder="What happened?"
                            value={text}
                            onChange={e => setText(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', alignItems: 'center', marginTop: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--primary)', marginRight: 'auto' }}>
                            <Sparkles size={14} />
                            <span>AI Auto-Triage Enabled</span>
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Processing...' : 'Submit Ticket'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ComplaintForm;
