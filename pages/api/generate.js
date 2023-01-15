import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const generateAction = async (req, res) => {
  console.log(new Date().toDateString())
  const PromptPrefix = 
  `
  make a reminder in google tasks for:
  ${req.body.userInput}, today is: ${new Date().toDateString()}

  the format output should be:
  Task: 
  Time:(if its not specified should return "N/A")
  Date:(if its not specified should return "N/A")
  Location:(if its not specified should return "N/A")
  Description: (give some tips on how to make this task the best way possible. make a three bullet ideas)
`
  console.log(`API: ${PromptPrefix}`)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${PromptPrefix}`,
    temperature: 0.7,
    max_tokens: 300,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();

  function dateToFormat(date){
    //convert date to day-month-year format
    var dateArray = date.split(" ");
    var day = dateArray[2];
    var month = dateArray[1];
    var year = dateArray[3];
    var monthNumber;
    switch(month){
      case "Jan":
        monthNumber="01";
        break;
      case "Feb":
        monthNumber="02";
        break;
      case "Mar":
        monthNumber="03";
        break;
      case "Apr":
        monthNumber="04";
        break;
      case "May":
        monthNumber="05";
        break;
      case "Jun":
        monthNumber="06";
        break;
      case "Jul":
        monthNumber="07";
        break;
      case "Aug":
        monthNumber="08";
        break;
      case "Sep":
        monthNumber="09";
        break;
      case "Oct":
        monthNumber="10";
        break;
      case "Nov":
        monthNumber="11";
        break;
      case "Dec":
        monthNumber="12";
        break;
    }
    return day+"-"+monthNumber+"-"+year;
  }

  function dateIsValid(date) {
    //check if date is valid, the format of date is day-month-year
    var dateArray = date.split("-");
    var day = dateArray[0];
    var month = dateArray[1];
    var year = dateArray[2];
    var date = new Date(year, month, day);
    if (date.getFullYear() == year && date.getMonth() == month && date.getDate() == day) {
      return true;
    }
    return false;
  }

    const dateCompletion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `${req.body.userInput}, today is: ${dateToFormat(new Date().toDateString())} \nget the date future date like if it was a calendar out of this input in (day-month-year) format:`,
      temperature: 0.1,
      max_tokens: 100,
    });
    
    const dataPromptOutput = dateCompletion.data.choices.pop();
    //remove \n from the string
    dataPromptOutput.text=dataPromptOutput.text.replace(/(\r\n|\n|\r)/gm, "")
    if (dateIsValid(dataPromptOutput.text)){
      basePromptOutput.text=basePromptOutput.text.split("Date:")[0]+"Date: "+dataPromptOutput.text+"\n"+"Location:"+basePromptOutput.text.split("Location:")[1]
    }
    else{
      basePromptOutput.text=basePromptOutput.text.split("Date:")[0]+"Date: N/A\n"+"Location:"+basePromptOutput.text.split("Location:")[1]
    }
  res.status(200).json({ output: basePromptOutput });
};

export default generateAction;