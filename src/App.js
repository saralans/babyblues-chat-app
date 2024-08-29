import {useState} from'react'
import ReactMarkdown from 'react-markdown'

const App = () => {
  const [value, setValue ] = useState("")
  const [error, setError] = useState("")
  const [chatHistory, setChatHistory] = useState([])

  

  const surpriseOptions = [
    'What are the symptoms of postpartum depression?',
    'Who is at risk for postpartum depression?',
    'I'm feeling down?'
  ]

  const surprise = () => {
    const randomValue = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)]
    setValue(randomValue)
  }

  const getResponse = async () => {
    if (!value) {
      setError("Error! Please ask a question.")
      return
    }
    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({
          history: chatHistory,
          message: value
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }

      const response = await fetch('http://localhost:8000/gemini', options)
      const data = await response.text()
      //console.log(data)
      setChatHistory(oldChatHistory => [...oldChatHistory, {
        role: "user",
        parts: value
      },
      {
        role:"model",
        parts: data
      }    
    ])

    setValue("")

    } catch (error) {
      console.error(error)
      setError("Something went wrong! Please try again later")
    }
  }

  const clear = () => {
    setValue("")
    setError("")
    setChatHistory([])
  }

  // Change Markdown response to HTML
  const ChatMessage = ({ message }) => {
    return <ReactMarkdown>{message}</ReactMarkdown>;
  };

  return (
      <div className = "app">
        <p>What do you want to know?
          <button className = "surprise" onClick={surprise} disabled={!chatHistory}>Surprise me!</button>
        </p>
        <div className="input-container">
          <input
            value={value}
            placeholder="What's on your mind?"
            onChange={(e) =>setValue(e.target.value)}
          />
          {!error && <button onClick={getResponse}>Ask me</button>}
          {error && <button onClick={clear}>Clear</button>}
        </div>
        {error && <p>{error}</p>}
        <div className="search-result">
          {chatHistory.map((chatItem, _index) => <div key={_index}>
           <p><strong>{chatItem.role}:</strong></p>
            <ChatMessage message={chatItem.parts} />
            </div>)}
        </div>
      </div>
  )
}

export default App
