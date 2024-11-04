const express = require('express');
const { OpenAI } = require('openai');
const app = express();
const cors = require('cors');
const axios = require('axios');
const { google } = require('googleapis');
const { spawn } = require('child_process');



const openai = new OpenAI({
    apiKey: 'API_KEY', // TODO: Replace with the actual OpenAI API key
});

app.use(cors());
app.use(express.json());

// Function to fetch transcript using the Python script
function fetchTranscript(videoId) {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python3', ['fetch_transcript.py', videoId]);

        let transcript = '';
        pythonProcess.stdout.on('data', (data) => {
            transcript += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error("Error in Python script:", data.toString());
            reject("Error fetching transcript.");
        });

        pythonProcess.on('close', (code) => {
            if (code === 0) {
                if (transcript.startsWith("Error:")) {
                    reject(transcript.trim());
                } else {
                    resolve(transcript.trim());
                }
            } else {
                reject("Python script exited with error.");
            }
        });
    });
}

app.post('/ask', async (req, res) => {
    const { videoId, question } = req.body;

    try {
        const transcript = await fetchTranscript(videoId);
        if (!transcript) {
            return res.json({ answer: "Unable to retrieve transcript due to restrictions or format limitations." });
        }
        // Debug purpose:
        // console.log("Transcript content:", transcript);

        // Combine transcript with the user question as context
        const prompt = `Context: ${transcript}\nQuestion: ${question}\nPlease respond concisely.`;

        // Use createChatCompletion for gpt-3.5-turbo or gpt-4 models;Send to gpt
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
