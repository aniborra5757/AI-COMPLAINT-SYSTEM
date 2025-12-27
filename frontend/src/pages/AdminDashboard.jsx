import { useEffect, useState } from 'react';
import { getComplaints } from '../api/backend';
import { useAuth } from '../components/AuthProvider';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [stats, setStats] = useState({ total: 0, open: 0, resolved: 0 });
    const { logout } = useAuth();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const { data } = await getComplaints();
            const all = data.complaints || [];
            setComplaints(all);

            // Calculate Stats
            const total = all.length;
            const open = all.filter(c => c.status === 'Open').length;
            const resolved = all.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;
            setStats({ total, open, resolved });
        } catch (err) {
            console.error(err);
        }
    };

    // Prepare Chart Data
    const categoryData = complaints.reduce((acc, curr) => {
        const cat = curr.category || 'Uncategorized';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {});

    const barData = Object.keys(categoryData).map(key => ({ name: key, count: categoryData[key] }));
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
        <div className="container">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="heading" style={{ margin: 0 }}>Admin Dashboard</h1>
                <button onClick={logout} className="btn">Logout</button>
            </header>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div className="card" style={{ textAlign: 'center' }}>
                    <h3>Total Complaints</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{stats.total}</p>
                </div>
                <div className="card" style={{ textAlign: 'center', borderColor: 'var(--warning)' }}>
                    <h3>Open</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: 'var(--warning)' }}>{stats.open}</p>
                </div>
                <div className="card" style={{ textAlign: 'center', borderColor: 'var(--success)' }}>
                    <h3>Resolved</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: 'var(--success)' }}>{stats.resolved}</p>
                </div>
            </div>

            {/* Visual Analytics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                <div className="card" style={{ height: '300px' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Complaints by Category</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData}>
                            <XAxis dataKey="name" stroke="var(--text-muted)" />
                            <YAxis stroke="var(--text-muted)" />
                            <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }} />
                            <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Simple Employee List (Mock for now or if we had employee API) */}
                <div className="card">
                    <h3>Employee Efficiency</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Top Solvers (Demo Data)</p>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>Alice: 12 Resolved</li>
                        <li style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>Bob: 8 Resolved</li>
                    </ul>
                </div>
            </div>

            {/* Recent Activity Table */}
            <div className="card">
                <h3>Recent Complaints</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border)' }}>
                            <th style={{ padding: '0.5rem' }}>ID</th>
                            <th style={{ padding: '0.5rem' }}>Category</th>
                            <th style={{ padding: '0.5rem' }}>Priority</th>
                            <th style={{ padding: '0.5rem' }}>Status</th>
                            <th style={{ padding: '0.5rem' }}>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {complaints.slice(0, 10).map(c => (
                            <tr key={c._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '0.5rem', fontFamily: 'monospace' }}>{c.trackingCode}</td>
                                <td style={{ padding: '0.5rem' }}>{c.category}</td>
                                <td style={{ padding: '0.5rem' }}>{c.priority}</td>
                                <td style={{ padding: '0.5rem' }}>{c.status}</td>
                                <td style={{ padding: '0.5rem' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
