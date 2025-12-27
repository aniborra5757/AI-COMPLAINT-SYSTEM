const OpenAI = require('openai');

// Initialize OpenAI only if key is present
let openai;
if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
}

// Fallback logic
const fallbackCategorize = (text) => {
    const lowerText = text.toLowerCase();

    if (lowerText.includes('late') || lowerText.includes('delivery') || lowerText.includes('shipping') || lowerText.includes('package')) {
        return { category: 'Delivery', priority: 'Medium', department: 'Logistics' };
    }
    if (lowerText.includes('refund') || lowerText.includes('charge') || lowerText.includes('bill') || lowerText.includes('money')) {
        return { category: 'Billing', priority: 'High', department: 'Finance' };
    }
    if (lowerText.includes('broken') || lowerText.includes('damage') || lowerText.includes('defect')) {
        return { category: 'Product Quality', priority: 'High', department: 'Quality Assurance' };
    }
    if (lowerText.includes('login') || lowerText.includes('password') || lowerText.includes('error')) {
        return { category: 'Technical Issue', priority: 'Medium', department: 'IT' };
    }

    return { category: 'General', priority: 'Low', department: 'Customer Support' };
};

const classifyComplaint = async (text) => {
    // 1. Try OpenAI/LLM if available
    if (openai) {
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are an AI assistant that categorizes customer complaints. Analyze the complaint and return a JSON object with fields: 'category', 'priority' (Low, Medium, High, Critical), and 'department'."
                    },
                    {
                        role: "user",
                        content: text
                    }
                ],
                temperature: 0.3,
            });

            const content = response.choices[0].message.content;
            // Basic JSON parsing attempt (LLM might return extra text, usually strict JSON with system prompt is better but for this demo:)
            try {
                const result = JSON.parse(content);
                return result;
            } catch (jsonError) {
                console.warn('AI returned non-JSON, using fallback:', content);
                // If JSON parse fails, fall through to fallback
            }

        } catch (error) {
            console.error('OpenAI API Error (switching to fallback):', error.message);
            // Fall through to fallback
        }
    }

    // 2. Fallback
    console.log('Using local fallback classifier.');
    return fallbackCategorize(text);
};

module.exports = {
    classifyComplaint
};
