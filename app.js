const express = require('express');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3000;

// 🔑 Gemini API Key
const API_KEY = 'AIzaSyDkvoH9QY32Sqw_yD87kFEqAB2mrpVVaa8'; // Replace with your actual key

// ⚙️ Setup Gemini Model
const genAI = new GoogleGenerativeAI(API_KEY);

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Home page
app.get('/', (req, res) => {
  res.render('index');
});

// Analyze code
app.post('/analyze', async (req, res) => {
  const code = req.body.code;

  const prompt = `
You are an AI assistant that helps debug and optimize code.
1. Analyze the following code:
${code}
2. Identify any errors or inefficiencies.
3. Suggest optimized code.
4. Explain what the code does.
5. Estimate time and space complexity in para format.
Return your response in a structured way with proper formatting using Markdown and also don't give any type of table.
`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = await response.text();

    // Render the response in an HTML page
    res.render('result', { output: text });
  } catch (err) {
    console.error(err);
    res.send('Error: ' + err.message);
  }
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
