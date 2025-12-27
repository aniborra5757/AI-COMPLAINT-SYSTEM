import { useEffect, useState } from 'react';
import { getComplaints } from '../api/backend';
import { useAuth } from '../components/AuthProvider';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Activity, Clock, CheckCircle, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [stats, setStats] = useState({ total: 0, open: 0, resolved: 0 });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const { data } = await getComplaints();
            const all = data.complaints || [];
            setComplaints(all);

            setStats({
                total: all.length,
                open: all.filter(c => c.status === 'Open').length,
                resolved: all.filter(c => c.status === 'Resolved' || c.status === 'Closed').length
            });
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const categoryData = complaints.reduce((acc, curr) => {
        const cat = curr.category || 'Uncategorized';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {});
    const barData = Object.keys(categoryData).map(key => ({ name: key, count: categoryData[key] }));
    const CHART_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#10b981'];

    const priorityData = complaints.reduce((acc, curr) => {
        const p = curr.priority || 'Medium';
        acc[p] = (acc[p] || 0) + 1;
        return acc;
    }, {});
    const pieData = Object.keys(priorityData).map(key => ({ name: key, count: priorityData[key] }));

    const { logout } = useAuth(); // Add logout hook

    return (
        <div className="full-screen" style={{ flexDirection: 'column' }}>
            {/* Navbar / Header Area */}
            <nav style={{
                height: 'var(--header-height)', borderBottom: '1px solid var(--border-strong)',
                display: 'flex', alignItems: 'center', padding: '0 2rem', background: 'var(--bg-panel)',
                justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        width: '32px', height: '32px', borderRadius: '6px',
                        background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontWeight: 'bold'
                    }}>
                        AI
                    </div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Executive Dashboard</h2>
                </div>
                <button
                    onClick={logout}
                    className="btn btn-secondary"
                    style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                >
                    Sign Out
                </button>
            </nav>

            <div className="main-content scroll-container" style={{ padding: '2rem' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>

                    {/* Intro */}
                    <div style={{ marginBottom: '3rem' }}>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>Overview</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>System Performance & Analytics</p>
                    </div>

                    {/* Stats Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                        <StatCard label="Total Tickets" value={stats.total} icon={Activity} color="var(--primary)" />
                        <StatCard label="Pending" value={stats.open} icon={Clock} color="#fbbf24" />
                        <StatCard label="Resolved" value={stats.resolved} icon={CheckCircle} color="#34d399" />
                        <StatCard label="Resolution Rate" value={`${stats.total ? Math.round((stats.resolved / stats.total) * 100) : 0}%`} icon={TrendingUp} color="#a855f7" />
                    </div>

                    {/* Charts & Context */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                        <div className="panel" style={{ minHeight: '350px', padding: '1.5rem' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', fontWeight: 600 }}>Volume by Category</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={barData}>
                                    <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ background: 'var(--bg-panel)', border: '1px solid var(--border-strong)', borderRadius: '8px', color: '#fff' }}
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    />
                                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                        {barData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="panel" style={{ padding: '1.5rem' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', fontWeight: 600 }}>Ticket Priority</h3>
                            <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="count"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ background: 'var(--bg-panel)', border: '1px solid var(--border-strong)', borderRadius: '8px', color: '#fff' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                {pieData.map(d => <span key={d.name} style={{ margin: '0 0.5rem' }}>{d.name}: {d.count}</span>)}
                            </div>
                        </div>
                    </div>

                    {/* Recent Table */}
                    <div className="panel">
                        <div className="panel-header">
                            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Recent Activity</h3>
                        </div>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                                    <th style={{ padding: '1rem', fontWeight: 500 }}>Tracking ID</th>
                                    <th style={{ padding: '1rem', fontWeight: 500 }}>Category</th>
                                    <th style={{ padding: '1rem', fontWeight: 500 }}>Status</th>
                                    <th style={{ padding: '1rem', fontWeight: 500 }}>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {complaints.slice(0, 5).map(c => (
                                    <tr key={c._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                        <td style={{ padding: '1rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{c.trackingCode}</td>
                                        <td style={{ padding: '1rem', fontWeight: 500 }}>{c.category}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span className={`badge badge-${c.status === 'Resolved' ? 'resolved' : 'open'}`}>
                                                {c.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon: Icon, color }) => (
    <div className="panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>{label}</span>
            {Icon && <Icon size={18} color={color} />}
        </div>
        <div style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1 }}>{value}</div>
    </div>
);

const HealthMetric = ({ label, value, score, color }) => (
    <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
            <span style={{ fontWeight: 600 }}>{value}</span>
        </div>
        <div style={{ width: '100%', height: '4px', background: 'var(--bg-app)', borderRadius: '2px' }}>
            <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: '2px' }}></div>
        </div>
    </div>
);

export default AdminDashboard;
