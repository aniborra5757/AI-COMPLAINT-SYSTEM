import { useState } from 'react';
import { createComplaint } from '../api/backend';
import { useNavigate } from 'react-router-dom';

const ComplaintForm = () => {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await createComplaint({ text });
            navigate('/'); // Redirect to dashboard
        } catch (err) {
            console.error(err);
            setError('Failed to submit complaint. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>New Complaint</h2>
            {error && <div style={{ color: 'var(--error)', marginBottom: '1rem' }}>{error}</div>}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Describe your issue in detail</label>
                    <textarea
                        className="input"
                        rows="5"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="e.g. My package (ID: 123) arrived damaged yesterday..."
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
                Our AI will automatically categorize and prioritize your request.
            </p>
        </div>
    );
};

export default ComplaintForm;
