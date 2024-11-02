const express = require('express');
const { OpenAI } = require('openai');
const app = express();
const cors = require('cors');


const openai = new OpenAI({
    apiKey: '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', // Replace with your actual OpenAI API key
});

app.use(cors());
app.use(express.json());

app.post('/ask', async (req, res) => {
    const { transcript, question } = req.body;
    const prompt = `Context: ${transcript}\nQuestion: ${question}\nPlease respond in one paragraph.`;

    try {
        // Use createChatCompletion for gpt-3.5-turbo or gpt-4 models
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo-0125', // Or 'gpt-4-turbo' or 'gpt-3.5-turbo' for more cost-effective options
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: prompt },
            ],
        });
        const answer = response.choices[0].message.content.trim();
        res.json({ answer });
    } catch (error) {
        console.error('Error fetching response from OpenAI API:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error fetching response from ChatGPT' });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
