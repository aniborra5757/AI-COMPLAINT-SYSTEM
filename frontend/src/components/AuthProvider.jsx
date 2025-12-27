import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import axios from 'axios';

const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchRole = async (session, retries = 3) => {
        if (!session?.user) {
            setRole(null);
            return;
        }
        try {
            // Call Sync Endpoint
            const res = await axios.post(`${API_URL}/users/sync`, {}, {
                headers: { Authorization: `Bearer ${session.access_token}` },
                timeout: 5000 // 5s timeout
            });
            setRole(res.data.role);
        } catch (err) {
            console.error(`Sync failed. Retries left: ${retries}`, err);

            if (retries > 0) {
                // Wait 2 seconds and retry (helps with Render Cold Starts)
                await new Promise(res => setTimeout(res, 2000));
                return fetchRole(session, retries - 1);
            }

            // Only fallback if truly failed after retries
            // setRole('user'); // DANGEROUS: Don't default to user, keep null? 
            // Better to default to 'user' for safety but maybe 'null' prevents redirect loop?
            // User went with 'redirecting within seconds', so let's default to user but only after retrying.
            setRole('user');
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
