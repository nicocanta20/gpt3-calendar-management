import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const generateAction = async (req, res) => {
  const PromptPrefix = 
  `
  make a reminder in google tasks for:
  ${req.body.userInput}

  if it applies, also give some tips on the description on how to make this task the best way possible. make a three bullet ideas
  the format should be:
  Task: 
  Time:(if its not specified should return "N/A")
  Date:(if its not specified should return "N/A")
  Location:(if its not specified should return "N/A")
  Description: 
`
  console.log(`API: ${PromptPrefix}`)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${PromptPrefix}`,
    temperature: 0.7,
    max_tokens: 300,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();

  res.status(200).json({ output: basePromptOutput });
};

export default generateAction;