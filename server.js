const PORT = 8000
const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
require('dotenv').config()

const { GoogleGenerativeAI} = require('@google/generative-ai')

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEN_AI_KEY)

app.post('/gemini', async (req, res) =>{
    console.log(req.body.history)
    console.log(req.body.message)
    const model = genAI.getGenerativeModel({model: "gemini-pro"})

    const chat = model.startChat({
        //history: req.body.history
        history: [
            {
              role: "user",
              parts: [{ text: "Hello" }],
            },
            {
              role: "model",
              parts: [{ text: "Great to meet you. What would you like to know?" }],
            },
          ]
    })

    const instructions = "Unless I am asking for a list/lists, answer in 2-3 sentences: "
    const msg = req.body.message
    const result = await chat.sendMessage(concat(instructions, msg))
    const response = await result.response
    const text = response.text()

    res.send(text)
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))

