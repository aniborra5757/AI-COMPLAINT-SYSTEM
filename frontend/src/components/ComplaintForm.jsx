import { useState } from 'react';
import { createComplaint } from '../api/backend';
import { useNavigate } from 'react-router-dom';

const ComplaintForm = () => {
    const [text, setText] = useState('');
    const [orderId, setOrderId] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await createComplaint({ text, orderId, category });
            navigate('/dashboard'); // Explicit redirect
        } catch (err) {
            console.error(err);
            setError('Failed to submit complaint. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const categories = ['Delivery Issue', 'Billing Issue', 'Product Quality', 'Technical Support', 'Other'];

    return (
        <div className="card">
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>New Complaint</h2>
            {error && <div style={{ color: 'var(--error)', marginBottom: '1rem' }}>{error}</div>}

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Order ID (Optional)</label>
                        <input className="input" value={orderId} onChange={e => setOrderId(e.target.value)} placeholder="e.g. #123456" />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Category</label>
                        <select className="input" value={category} onChange={e => setCategory(e.target.value)} required>
                            <option value="">Select a Category</option>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Describe your issue in detail</label>
                    <textarea
                        className="input"
                        rows="5"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="e.g. My package arrived damaged..."
                        required
                        style={{ fontFamily: 'inherit' }}
                    />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Analyzing & Submitting...' : 'Submit Complaint'}
                </button>
            </form>
            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                <span style={{ marginRight: '0.5rem' }}>✨</span>
                If you select "Other", our AI will automatically categorize it for you.
            </p>
        </div>
    );
};

export default ComplaintForm;
