import { useState, useEffect, useRef } from 'react'
import Markdown from 'react-markdown'
import { decodeAudio } from './utils'
import './App.css'

const recognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition

function ChatBot() {
  const [recording, setRecording] = useState(false)
  const [messages, setMessages] = useState([])
  const [currentMessage, setCurrentMessage] = useState({ message: '', final: false })
  const audio = useRef(null)
  const recognition = useRef(null)
  const lastMessage = useRef(null)

  function startRecording() {
    setRecording(true)
    recognition.current.start()
    setCurrentMessage({ message: '', final: false })
  }

  function stopRecording() {
    setRecording(false)
    recognition.current.stop()
  }

  function handleRecord() {
    if (recording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  useEffect(() => {
    let tts = new recognitionClass()
    tts.lang = 'en-US'
    tts.continuous = true

    tts.onend = () => {
      setRecording(false)
      setCurrentMessage(prev => ({ ...prev, final: true }))
    }

    tts.onresult = (event) => {
      let result = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          result += event.results[i][0].transcript + ' ';
        } else {
          result += event.results[i][0].transcript;
        }
      }
      setCurrentMessage(prev => ({ ...prev, message: prev.message + result }))
    }

    recognition.current = tts
  }, [])

  useEffect(() => {
    async function fetchResponse() {
      try {
        const response = await fetch(process.env.REACT_APP_CHATBOT_API, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: currentMessage.message })
        })

        if (!response.ok) {
          throw new Error("HTTP error")
        }
        const jsonData = await response.json()
        setMessages(prev => [...prev, { content: jsonData.response, source: 'bot' }])
        let url = decodeAudio(jsonData.audio_response)
        audio.current.src = url
        audio.current.play()
      } catch (error) {
        console.error(error)
      } finally {
        setCurrentMessage({ message: '', final: false })
      }
    }

    if (currentMessage.final) {
      setMessages(prev => [...prev, { content: currentMessage.message, source: 'user' }])
      fetchResponse()
    }
  }, [currentMessage])

  return (
    <div className='chatbot-container'>
      <audio ref={audio}></audio>
      <div className='chatbot-messages'>
        {messages.map((message, index) => {
          let isLast = false
          if (index === messages.length - 1) {
            isLast = true
            setTimeout(() => lastMessage.current.scrollIntoView({ behavior: 'smooth' }), 50)
          }
          return (
            <div key={index} ref={isLast ? lastMessage : null} className={message.source === 'user' ? 'user-message' : 'chatbot-message'}>
              <Markdown children={message.content} />
            </div>
          )
        })}

      </div>

      <button
        className='record-btn'
        onClick={() => handleRecord()}
      >{recording ? "Stop" : "Record"}</button>
    </div>
  )
}

function ChatContainer() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia
    || (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window))) {
    return (
      <div><p>Browser is not supported :(</p></div>
    )
  }

  return (
    <>
      <div className='main-header'>
        <h1>Hello Chatbot! I am World!</h1>
      </div>
      <ChatBot />
      <div>
        <p>by Salvador Loera Quiroz</p>
      </div>
    </>
  )
}

function App() {
  return (
    <div className='main-container'>
      <ChatContainer />
    </div>
  )
}

export default App
