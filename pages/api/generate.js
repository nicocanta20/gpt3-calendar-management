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

  function dateIsValid(date) {
    return date instanceof Date && !isNaN(date);
  }

  let date=basePromptOutput.text.split("Date:")[1].split("Location:")[0].trim()
  if(date=="Tomorrow"){
    date=new Date()
    date.setDate(date.getDate()+1)
    date=date.toDateString()
    basePromptOutput.text=basePromptOutput.text.split("Date:")[0]+"Date: "+date+basePromptOutput.text.split("Tomorrow")[1]

  }
  else{
    const dateCompletion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `transform ${date} to this type: month-date-2023`,
      temperature: 0.7,
      max_tokens: 300,
    });
    
    const dataPromptOutput = dateCompletion.data.choices.pop();
    //remove \n from the string
    dataPromptOutput.text=dataPromptOutput.text.replace(/(\r\n|\n|\r)/gm, "")
    if (dateIsValid(new Date(dataPromptOutput.text))){
      basePromptOutput.text=basePromptOutput.text.split("Date:")[0]+"Date: "+dataPromptOutput.text+"\n"+"Location:"+basePromptOutput.text.split("Location:")[1]
    }
    else{
      basePromptOutput.text=basePromptOutput.text.split("Date:")[0]+"Date: N/A\n"+"Location:"+basePromptOutput.text.split("Location:")[1]
    }
  }
  res.status(200).json({ output: basePromptOutput });
};

export default generateAction;