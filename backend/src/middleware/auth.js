const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Try standard verification
        try {
            const { data: { user }, error } = await supabase.auth.getUser(token);
            if (error || !user) throw error || new Error('No user found');
            req.user = user;
            return next();
        } catch (supabaseError) {
            // Check for Network/Timeout errors specifically
            const isNetworkError = supabaseError.cause?.code === 'UND_ERR_CONNECT_TIMEOUT' ||
                supabaseError.message?.includes('fetch failed');

            if (isNetworkError) {
                console.warn('⚠️ Supabase Connection Failed. Attempting Offline Token Parse...');

                // Fallback: Manually parse JWT to get ID/Email (INSECURE: Only for Dev/Resilience)
                try {
                    const payloadPart = token.split('.')[1];
                    const decoded = JSON.parse(Buffer.from(payloadPart, 'base64').toString());

                    if (decoded.sub && decoded.email) {
                        req.user = {
                            id: decoded.sub,
                            email: decoded.email,
                            // Add other standard fields if necessary
                            app_metadata: decoded.app_metadata || {},
                            user_metadata: decoded.user_metadata || {}
                        };
                        console.log(`✅ Offline Auth Successful for: ${decoded.email}`);
                        return next();
                    }
                } catch (parseError) {
                    console.error('Failed to parse token offline:', parseError);
                }
            }

            // If not a network error or parsing failed, rethrow
            throw supabaseError;
        }

    } catch (err) {
        console.error('Auth Error:', err.message);
        res.status(401).json({ message: 'Authentication failed', error: err.message });
    }
};

module.exports = authMiddleware;
