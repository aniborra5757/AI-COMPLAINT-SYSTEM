const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini only if key is present
let genAI;
let model;

if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-pro" });
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
    // 1. Try Gemini if available
    if (model) {
        try {
            const prompt = `
        You are an AI assistant that categorizes customer complaints. 
        Analyze the following complaint and return a strictly valid JSON object (no markdown formatting).
        Fields: 'category', 'priority' (Low, Medium, High, Critical), 'department', and 'summary' (short summary).
        
        Complaint: "${text}"
      `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            let textResponse = response.text();

            // Clean up markdown code blocks if Gemini sends them
            textResponse = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();

            try {
                const jsonResult = JSON.parse(textResponse);
                return jsonResult;
            } catch (jsonError) {
                console.warn('Gemini returned non-JSON, using fallback:', textResponse);
            }

        } catch (error) {
            console.error('Gemini API Error (switching to fallback):', error.message);
        }
    }

    // 2. Fallback
    console.log('Using local fallback classifier.');
    return fallbackCategorize(text);
};

module.exports = {
    classifyComplaint
};
