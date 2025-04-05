
import React, { useState } from "react";

const Chatbot = () => {
    const [message, setMessage] = useState("");
    const [response, setResponse] = useState("");

    const sendMessage = async () => {
        const res = await fetch("http://localhost:5000/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message }),
        });
        const data = await res.json();
        setResponse(data.reply);
    };

    return (
        <div>
            <h2>💬 Chatbot Fiscal</h2>
            <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Posez votre question..."
            />
            <button onClick={sendMessage}>Envoyer</button>
            <p>🧠 Réponse: {response}</p>
        </div>
    );
};

export default Chatbot;