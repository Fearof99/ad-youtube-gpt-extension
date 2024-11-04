# ad-youtube-gpt-extension

This is a Chrome extension that enables
users to ask questions about YouTube
videos as they watch them. The extension
requests the video transcript from YouTube
and sends it to ChatGPT (using the free
online version) as context. When a new
question is asked, ChatGPT responds and
sends the answer back to the user on the
YouTube page through a chat window. To
expedite responses, consider adding
prompts that constrain the length and
format of the response. The backend
routes questions to ChatGPT and sends
the response back to the chat window, with
some acceptable delay.

This project uses ChatGPT API and youtube-transcript-api package (https://github.com/jdepoix/youtube-transcript-api) since Youtube API v3 is not supporting caption download now. (2024/11/01)

Commands to compile the code base:

pip install youtube-transcript-api

cd backend
npm init -y
npm install express axios

Commands to run the code:

node server.js

Go to chrome://extensions/

Enable "Developer Mode"; Click "Load Unpack", Select "extension" directory then confirm. 

Now go to Youtube, it should be working now

