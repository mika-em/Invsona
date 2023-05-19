const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const User = require("../models/users").usersModel;
const { Configuration, OpenAIApi } = require("openai");

dotenv.config();

const configuration = new Configuration({
  organization: "org-IK9aHGvfAPS3zqJgEZurc5B7",
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

router.get("/persona", (req, res) => {
  res.render("./persona/persona");
router.get('/persona', (req, res) => {
    res.render("./persona/persona");
});

// General Prompt
router.get("/persona/general-prompt", (req, res) => {
  res.render("./persona/generalPrompt");
router.get('/persona/general-prompt', (req, res) => {
    console.log(chatPrompt)
    res.render("./persona/generalPrompt");
});

router.post("/persona/chat/general", async (req, res) => {
  const gender = req.body.gender || "random";
  const name = req.body.name || "random";
  const age = req.body.age || "random";
  const plot = req.body.plot || "random";
router.post("/persona/chat/general", async (req, res) => {
  const gender = req.body.gender || "random";
  const name = req.body.name || "random";
  const age = req.body.age || "random";
  const plot = req.body.plot || "random";

  console.log("gender", gender);
  console.log("name", name);
  console.log("age", age);
  console.log("plot", plot);
  const prompt = `Generate a random ${gender} character whose name is ${name} and age is ${age}, and is in a ${plot} setting.`;
  console.log(prompt);

  const responseData = await callOpenAIAPi(prompt);

  const currentUsername = req.session.user.username;
  console.log(currentUsername);

  await User.updateOne(
    {
      username: currentUsername,
    },
    {
      $push: {
        personaHistory: {
          userPrompt: prompt,
          botResponse: responseData,
        },
      },
    }
  );

  const currentUser = await User.findOne({
    username: currentUsername,
  });

  const personaHistory = currentUser.personaHistory;
  console.log(personaHistory);

  res.render("chat", {
    placeholderText: "Write a prompt here...",
    personaHistory: personaHistory,
  });
});

router.get('/persona/saved-prompt', (req, res) => {
    res.render("./persona/savedPrompt");
});

// New Prompt Parameters
router.get("/persona/new-prompt", (req, res) => {
  res.render("./persona/newPrompt", { newParameter: newParameter });
});

router.post("/persona/new-prompt", (req, res) => {
  const parameter = req.body.parameter;
  newParameter.push(parameter);
  console.log(newParameter);
  res.render("./persona/newPrompt", { newParameter: newParameter });
});

router.post("/persona/new-prompt/delete", (req, res) => {
  const { index } = req.body;
  if (index >= 0 && index < newParameter.length) {
    newParameter.splice(index, 1);
    console.log(newParameter);
    res.render("./persona/newPrompt", { newParameter: newParameter });
  } else {
    res.status(400).send("Invalid index"); // Send an error response to the client
  }
});

router.post("/persona/new-prompt/saved", async (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const parameterSet = newParameter;
  const date = new Date();

  const currentUser = await User.findOne({
    username: req.session.user.username,
  });

  await Parameter.create({
    userId: currentUser._id,
    title: title,
    description: description,
    parameterSet: parameterSet,
    date: date,
  });
  res.render("./persona/newPrompt", { newParameter: newParameter });
});

router.get("/persona/chat", async (req, res) => {
  const currentUser = await User.findOne({
    username: req.session.user.username,
  });
  const personaHistory = currentUser.personaHistory;

  res.render("chat", {
    placeholderText: "Write a prompt here...",
    personaHistory: personaHistory,
  });
});

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

router.post("/persona/chat", async (req, res) => {
  const prompt = req.body.prompt;
  const currentUsername = req.session.user.username;
  console.log(prompt);

  const responseData = await callOpenAIAPi(prompt);

  await User.updateOne(
    {
      username: currentUsername,
    },
    {
      $push: {
        personaHistory: {
          userPrompt: prompt,
          botResponse: responseData,
        },
      },
    }
  );
  const currentUser = await User.findOne({
    username: req.session.user.username,
  });
  const personaHistory = currentUser.personaHistory;

  console.log(personaHistory);

  res.render("chat", {
    placeholderText: "Write a prompt here...",
    personaHistory: personaHistory,
  });
});

module.exports = router;
