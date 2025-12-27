import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Ticket, Users, LogOut, CheckCircle, Inbox, Activity } from 'lucide-react';
import { useAuth } from './AuthProvider';

const Sidebar = ({ role }) => {
    const location = useLocation();
    const { logout } = useAuth();
    const isActive = (path) => location.pathname === path;

    const navItems = role === 'Admin' ? [
        { path: '/admin', label: 'Overview', icon: LayoutDashboard },
        { path: '/admin/tickets', label: 'All Tickets', icon: Ticket },
        { path: '/admin/users', label: 'User Management', icon: Users },
    ] : [
        { path: '/employee', label: 'Inbox', icon: Inbox },
        { path: '/employee-active', label: 'My Active', icon: Activity },
        { path: '/employee-resolved', label: 'Resolved', icon: CheckCircle },
    ];

    // Filter out dummy paths if we haven't built those specific sub-pages yet, 
    // or keep them as placeholders. For now, let's keep it simple based on the single page app structure mostly.
    // Actually, for this specific request, the user wants CLEANUP. 
    // So let's stick to the main "Dashboard" link and maybe one filter link that just passes a param in real life,
    // but visually looks like a nav item.

    return (
        <div style={{
            width: 'var(--sidebar-width)',
            background: 'var(--bg-panel)',
            borderRight: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100vh',
            flexShrink: 0
        }}>
            <div>
                {/* Brand / Header */}
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: '32px', height: '32px', borderRadius: '6px',
                            background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', fontWeight: 'bold'
                        }}>
                            AI
                        </div>
                        <div>
                            <h3 style={{ fontSize: '0.95rem', margin: 0, fontWeight: 700 }}>Cortex Help</h3>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>{role} Workspace</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav style={{ padding: '0 1rem' }}>
                    {role === 'Admin' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                            <SidebarItem
                                icon={LayoutDashboard}
                                label="Dashboard"
                                active={isActive('/admin-dashboard')}
                                to="/admin-dashboard"
                            />
                            {/* Removing extra filler links to match 'minimal' request */}
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                            <SidebarItem
                                icon={Inbox}
                                label="Inbox"
                                active={isActive('/employee')}
                                to="/employee"
                            />
                            {/* In a real app these typically nav to filtered views. 
                                keeping them simple for now or commented out if not implemented 
                            */}
                        </div>
                    )}
                </nav>
            </div>

            {/* Footer */}
            <div style={{ padding: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                    onClick={logout}
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.9rem',
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.background = 'var(--bg-surface)'; e.currentTarget.style.color = 'var(--text-main)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
};

const SidebarItem = ({ icon: Icon, label, active, to }) => (
    <Link
        to={to}
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.65rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 500,
            color: active ? '#fff' : 'var(--text-secondary)',
            background: active ? 'var(--bg-surface)' : 'transparent',
            border: '1px solid',
            borderColor: active ? 'var(--border-strong)' : 'transparent',
            transition: 'all 0.15s ease-out'
        }}
    >
        <Icon size={18} color={active ? 'var(--primary)' : 'currentColor'} />
        {label}
    </Link>
);

export default Sidebar;
