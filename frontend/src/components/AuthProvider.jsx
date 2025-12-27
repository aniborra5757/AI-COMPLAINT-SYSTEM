import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import axios from 'axios';

const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchRole = async (session) => {
        if (!session?.user) {
            setRole(null);
            return;
        }
        try {
            // Call Sync Endpoint
            const res = await axios.post(`${API_URL}/users/sync`, {}, {
                headers: { Authorization: `Bearer ${session.access_token}` }
            });
            setRole(res.data.role);
        } catch (err) {
            console.error("Failed to sync user role", err);
            setRole('user'); // Fallback
        }
    };

    useEffect(() => {
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            setUser(session?.user ?? null);
            if (session?.user) await fetchRole(session);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) await fetchRole(session);
            else setRole(null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
    };

    const signUp = async (email, password) => {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ user, role, login, signUp, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
