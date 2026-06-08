import { useState } from "react";
import "./App.css";
import ReactMarkdown from "react-markdown";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

console.log("API KEY:", API_KEY);

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function generateResponse(feature) {
    if (input.trim() === "") {
      setResponse("Please enter some text first.");
      return;
    }

    let prompt = "";

    if (feature === "explain") {
      prompt = `Explain this concept in simple words: ${input}`;
    } 
    
    else if (feature === "summarize") {
      prompt = `Summarize the following text into bullet points: ${input}`;
    } 
    
    else if (feature === "quiz") {
      prompt = `Generate 5 quiz questions about: ${input}`;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await res.json();

      console.log("FULL RESPONSE:", data);

      if (data.error) {
        setResponse(
          `Error ${data.error.code}: ${data.error.message}`
        );
        setLoading(false);
        return;
      }

      setResponse(
        data.candidates[0].content.parts[0].text
      );
    } 
    
    catch (error) {
      console.error("FETCH ERROR:", error);

      setResponse(
        `Error: ${error.message}`
      );
    }

    setLoading(false);
  }

  return (
    <div className="container">
      <h1>AI Study Assistant</h1>

      <textarea
        placeholder="Enter your topic or text..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <div className="buttons">
        <button onClick={() => generateResponse("explain")}>
          Explain Concept
        </button>

        <button onClick={() => generateResponse("summarize")}>
          Summarize
        </button>

        <button onClick={() => generateResponse("quiz")}>
          Generate Quiz
        </button>

        <button
          onClick={() => {
            setInput("");
            setResponse("");
          }}
        >
          Clear
        </button>
      </div>

      {loading && <p>🤖 Thinking...</p>}

      <div className="output">
        <ReactMarkdown>{response}</ReactMarkdown>
      </div>
    </div>
  );
}

export default App;