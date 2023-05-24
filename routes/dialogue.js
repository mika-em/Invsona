const express = require("express");
const router = express.Router();
const User = require("../models/users");
const dotenv = require('dotenv');
const Dialogue = require("../models/dialogueList");


const {
    Configuration,
    OpenAIApi
} = require('openai');

dotenv.config();
router.use(express.static('public'));

const configuration = new Configuration({
    organization: "org-wZOT14YD6omEzAgdgaFU5gz3",
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function callOpenAIAPi(userPrompt) {
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `${userPrompt}`,
        temperature: 0,
        max_tokens: 1000,
    });
    const responseData = response.data.choices[0].text;
    console.log(responseData);
    return responseData;
}

router.get('/dialogue', (req, res) => {
    res.render("./dialogue/dialogueHome");
});

router.get('/dialogue/new', (req, res) => {
    res.render("dialogueFilters");
});

router.get('/dialogueFilters', (req, res) => {
    res.render("./dialogue/dialogueFilters", {
        output: null
    });
});

//Inner Dialogue
router.get('/dialogue/inner-dialogue', (req, res) => {
    res.render("./dialogue/innerDialogue");
});

router.post('/dialogue/chat/inner-dialogue', async (req, res) => {
    const persona = req.body.persona || "random";
    const situation = req.body.situation || "random";
    const plot = req.body.plot || "random";

    const prompt = `Generate an inner dialogue of a character described as ${persona} whose is in a ${plot} setting where they are faced with ${situation}.`;

    const responseData = await callOpenAIAPi(prompt);

    const currentUsername = req.session.user.username;
    console.log(currentUsername)

    await User.updateOne({
        username: currentUsername
    }, {
        $push: {
            innerDialogueHistory: {
                userPrompt: prompt,
                botResponse: responseData
            }
        }
    })

    const currentUser = await User.findOne({
        username: currentUsername
    });

    const innerDialogueHistory = currentUser.innerDialogueHistory
    console.log(innerDialogueHistory)

    res.render("dialogue/dialogueChat", {
        placeholderText: "Write a prompt here...",
        innerDialogueHistory: innerDialogueHistory
    });
});

//Inner Dialogue Chat
router.get('/dialogue/chat/inner-dialogue', async (req, res) => {
    const currentUser = await User.findOne({
        username: req.session.user.username
    });
    const innerDialogueHistory = currentUser.innerDialogueHistory
    console.log(currentUser)
    console.log(innerDialogueHistory)

    res.render("dialogue/dialogueChat", {
        placeholderText: "Write a prompt here...",
        innerDialogueHistory: innerDialogueHistory
    });
});



//User Persona Chat
router.get('/dialogue/user-persona-chat', async (req, res) => {
    res.render("./dialogue/userPersona");
});

router.post('/dialogue/chat/user-persona-chat', async (req, res) => {
    const name = req.body.name || "random";
    const chat = req.body.chat || "random";

    // const prompt = `Generate a response from a character described as ${name} after it is told ${chat}.`;
    const prompt = `Pretend you're a character described as ${name} after it is told ${chat}.`;

    const responseData = await callOpenAIAPi(prompt);

    const currentUsername = req.session.user.username;
    console.log(currentUsername)

    await User.updateOne({
        username: currentUsername
    }, {
        $push: {
            userPersonaChatHistory: {
                userPrompt: prompt,
                botResponse: responseData
            }
        }
    })

    const currentUser = await User.findOne({
        username: currentUsername
    });

    const userPersonaChatHistory = currentUser.userPersonaChatHistory
    console.log(userPersonaChatHistory)

    res.render("./dialogue/personaChat", {
        placeholderText: "Write a prompt here...",
        userPersonaChatHistory: userPersonaChatHistory
    });
});

//Chat for User Persona Chat
router.get('/dialogue/chat/user-persona', async (req, res) => {
    const currentUser = await User.findOne({
        username: req.session.user.username
    });
    const userPersonaChatHistory = currentUser.userPersonaChatHistory

    res.render("./dialogue/personaChat", {
        placeholderText: "Write a prompt here...",
        userPersonaChatHistory: userPersonaChatHistory
    });
});

//Persona to Persona Chat



//Saved Dialogue
router.post('/dialogue/chat/saved-persona-chat', async (req, res) => {
    const index = req.body.save;
    console.log(index);
    const date = new Date();

    const currentUser = await User.findOne({
        username: req.session.user.username
    });
    const userPersonaChatHistory = currentUser.userPersonaChatHistory

    const dialogue = userPersonaChatHistory[index].botResponse;

    await Dialogue.create({
        userId: currentUser._id,
        dialogue: dialogue,
        date: date
    });
    res.render("./dialogue/personaChat", {
        placeholderText: "Write a prompt here...",
        innerDialogueHistory: userPersonaChatHistory
    });
});

module.exports = router;