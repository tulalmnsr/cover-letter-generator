require("dotenv").config();
const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const csv = require("csv-parser");
const streamifier = require("streamifier");
const axios = require("axios");
const { OpenAI } = require("openai");
const cors = require("cors");

const app = express();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(cors());
app.use(fileUpload());

// Health check
app.get("/", (req, res) => {
  res.send(
    "AI Cover Letter Generator API is running. POST to /generate with PDFs + CSV."
  );
});

// Endpoint to handle file uploads and generate content
app.post("/generate", async (req, res) => {
  // Check if CSV is present
  if (!req.files || !req.files.csv) {
    return res
      .status(400)
      .send("Missing job description CSV file (field name: 'csv').");
  }

  // Collect PDFs (may be single or array)
  const pdfs = req.files.pdfs
    ? Array.isArray(req.files.pdfs)
      ? req.files.pdfs
      : [req.files.pdfs]
    : [];

  // Enforce minimum 3 PDFs
  if (pdfs.length < 3) {
    return res
      .status(400)
      .send("Please upload at least 3 past cover-letter PDF files.");
  }

  // 1️⃣ Parse PDFs
  let pastLetters = "";
  for (const pdf of pdfs) {
    try {
      const parsed = await pdfParse(pdf.data);
      pastLetters += parsed.text + "\n\n";
    } catch (err) {
      console.warn("Warning: error parsing a PDF — skipping:", err.message);
    }
  }
  if (!pastLetters.trim()) {
    // fallback
    pastLetters =
      "[No valid cover letters parsed. Using a professional, clear tone.]";
  }

  // 2️⃣ Parse CSV from buffer
  const jobUrls = await new Promise((resolve, reject) => {
    const urls = [];
    const bufferStream = streamifier.createReadStream(req.files.csv.data);
    bufferStream
      .pipe(csv())
      .on("data", (row) => {
        const url = row.url || Object.values(row)[0];
        if (url) urls.push(url);
      })
      .on("end", () => resolve(urls))
      .on("error", (err) => reject(err));
  });

  // 3️⃣ Fetch job descriptions
  let jobDescriptions = "";
  for (const url of jobUrls) {
    try {
      const { data } = await axios.get(url);
      jobDescriptions += data + "\n\n";
    } catch (err) {
      console.warn(`Could not fetch ${url}:`, err.message);
      jobDescriptions += `[Could not fetch ${url}]\n`;
    }
  }

  // 4️⃣ Build prompt and call OpenAI
  const prompt = `
You are an AI job application assistant.

Below are past cover letters (to learn style):
${pastLetters}

Below is the job description (fetched from CSV URLs):
${jobDescriptions}

Now generate:
=== Tailored Cover Letter ===
[Write a few paragraphs addressing the job and company, using the above style]

=== CV Improvement Suggestions ===
- [List specific resume changes for this role]

=== Personalized Application Tips ===
1. [Tailored next steps or advice]
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });
    return res.send(completion.choices[0].message.content);
  } catch (err) {
    console.error("OpenAI error:", err);
    return res
      .status(500)
      .send("Error generating content from OpenAI. Please try again.");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
