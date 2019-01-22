/* Javascript to run the Rio 2.0 Questionnaire
* Written by dh4gan (01-Aug-2017)
* Runs the quiz, and records all answers along with Q, J, delta and R
*/


// Variables to hold the question data //
var questionset;

var previousKey = "";
var questionKey="Type";
var typeChoice="";
var unitChoice = "";

var answers = ["","",0.0];
var qID = 0;
var nQ=3;



// Unit selection question
var unit_type_question = {
    text:"Select Unit Type:",
    choices: ["Distance", "Mass","Time"],
    values: ["Distance", "Mass","Time"],
    qtype:"multichoice",
    explainertext:""
}

// Distance Variables

var distance_choices = ["cm", "m", "Moon Radii", "Mars Radii", "Earth Radii", "Neptune Radii", "Jupiter Radii", "Solar Radii", "AU", "parsecs", "kiloparsecs", "megaparsecs"];

var distance_values = [1.0, 100.0, 1.73814e8, 3.396e8, 6.371e8, 2.4764e9, 6.0268e9, 7.1492e9, 6.995e10, 1.496e13, 3.08568e18, 3.08568e21, 3.08568e24];

var distance_dict = {};
distance_choices.forEach((key,i) => distance_dict[key] = distance_values[i]);

var distance_question = {text: "Select Current Distance Unit:",
			 choices: distance_choices,
			 values: distance_values,
			 dictionary: distance_dict,
			 qtype: "multichoice",
			 explainertext:""
			}    

// Mass Variables

var mass_choices = ["g", "kg", "Moon Masses", "Mars Masses", "Earth Masses", "Neptune Masses", "Saturn Masses", "Jupiter Masses", "Solar Masses"];
var mass_values = [1.0, 1000.0, 7.3477e25, 6.4185e26, 5.9736e27, 1.024e29, 5.6834e29, 1.8986e30, 1.988920e33];

var mass_dict = {};
mass_choices.forEach((key,i) => mass_dict[key] = mass_values[i]);

var mass_question = {text: "Select Current Mass Unit:",
		     choices: mass_choices,
		     values :mass_values,
		     dictionary: mass_dict,
		     qtype: "multichoice",
		     explainertext:""
		    }


// Time Variables

var time_choices = ["seconds", "minutes", "hours", "days", "Martian sols", "weeks", "years", "Martian years", "Jovian years"];
var time_values = [1.0, 60.0, 3600.0, 86400.0, 88775.244, 604800.0, 31556926.0, 59354294.4 , 374335776.0];

var time_dict = {};
time_choices.forEach((key,i) => time_dict[key] = time_values[i]);

var time_question = {text: "Select Current Time Unit:",
		     choices: time_choices,
		     values: time_values,
		     dictionary: time_dict,
		     qtype: "multichoice",
		     explainertext:""
		    }
		    


// Unit Value

var value_question = {text: "Enter Current Unit Value:",
		      qtype: "textbox",
		      minimum: -1.0e30,
		      maximum: 1.0e30,
		      explainertext:""
		     }

var questionset = {"Type": unit_type_question, "Distance": distance_question, "Mass":mass_question, "Time":time_question, "Value":value_question}


// Function that drives the quiz


startQuiz();


/*
 *
 * Function definitions
 *
 */


function startQuiz() {
    /*
     * Begins the quiz
     */

    console.log(questionKey)
    
    askQuestion(questionKey);
}




function askQuestion(questionkey) {
    /*
     * Asks a question - decides which type to ask
     */
    
    question = questionset[questionKey];

    console.log(question, questionKey, question.qtype)
    
    // Clear previous question
    clearBox("answersbox");
    
    // Set new question text
    document.getElementById("ask").innerHTML = question.text;
    
    // Get either radio buttons for multiple choice or text box
    if (question.qtype=='multichoice')
	{
	    askMultiChoice(question);
	}
    
    else if (question.qtype =='textbox')
	{
	    askTextBox(question);
	}

    document.getElementById("explainbox").innerHTML = question.explainertext;
    
}


function askMultiChoice(question){
    /*
     * sets up a multiple choice question
     */
    
    // Create radio buttons for possible choices
    for (i=0; i< question.choices.length; i++){
	console.log("HERE")
	
	var choiceLabel = document.createElement('label');
	choiceLabel.setAttribute('name', 'label'+String(i+1));
	var choiceRadioButton = document.createElement('input');
	var choiceString = 'multichoice';
	
	choiceRadioButton.setAttribute('type', 'radio');
	choiceRadioButton.setAttribute('name', choiceString);
	
	choiceLabel.appendChild(choiceRadioButton);
	choiceLabel.appendChild(document.createTextNode(question.choices[i]));
	choiceLabel.appendChild(document.createElement('br'));
	
	document.getElementById("answersbox").appendChild(choiceLabel);
    }
}

function askTextBox(question){
    /*
     * Sets up a question with a text box for answering
     */
    
    // Create text box for answer
    var choiceLabel = document.createElement('label');
    var textBox = document.createElement('input');
    
    var boxString = "tbox";
    textBox.setAttribute('type', 'text');
    textBox.setAttribute('name', boxString);
    textBox.setAttribute('id',boxString);
    textBox.setAttribute('value', 0);
    
    document.getElementById("answersbox").appendChild(textBox);
}


function getQuestionAnswer(){
    /*
     * Interrogates page for question answer
     * Either sets up next question
     * Or calculates total from this question set
     */
    
    document.getElementById("confirm").innerHTML = "";
    currentQuestion = questionset[questionKey];
    
    
    console.log("getting question answer");
    
    qtype = currentQuestion.qtype;
    choice = -1;
    
    
    // If question multichoice, then obtain which radio button was ticked
    if(qtype=="multichoice")
	{
	    nchoices = currentQuestion.choices.length;
	    var buttonList = document.getElementsByName("multichoice");
	    choice = -10;
	    for (i=0; i < nchoices; i++)
		{
		    
		    var ischecked = buttonList[i].checked;
		    if(ischecked) choice = i;
		}
	    
        
	    if(choice==-10)
		{
		    document.getElementById("confirm").innerHTML = "Please select an option before continuing"
			return;
		}


	    previousKey = questionKey;
	    if(questionKey=="Type")
	    {
		questionKey = currentQuestion.values[choice];
		typeChoice = questionKey;
	    }
	    else
	    {
		unitChoice = currentQuestion.choices[choice];
		questionKey = "Value";
	    }

	    answers[qID] = questionKey;
	    
	}
    
    // Else if question textbox, obtain value from textbox and check it for veracity
    else if(qtype=="textbox")
	{
	    try
		{
		    answers[qID] = Number(document.getElementById("tbox").value);// Get value of textbox
		    
		    if (isNaN(answers[qID])) throw "Not a valid number - try again";
		    if (answers[qID]<currentQuestion.minimum) throw "Number too low - try again";
		    if (answers[qID]>currentQuestion.maximum) throw "Number too high - try again"
														}
	    catch(err)
		{
		    if(err!="TypeError")
			{
			    document.getElementById("confirm").innerHTML = err;
			    return;
			}
		}
	    
	}
    
    
    
    console.log("Answer is "+answers[qID]);

    //  update the question ID
    qID++;
    
    
    // If we haven't run out of questions, ask the next one
    if(qID <nQ)
	{
	    askQuestion(questionKey);
	    
	    // Otherwise, calculate the total from this section and move on
	}
    
    else
	{
	    console.log("Entry Complete");
	    doConversion();
	    
	}
    
}


function goBack()
{
    /*
     * Goes back a question
     */


    // Don't go back if we're at the first question

    if (qID==0){
	return;
    }
    
    // Set question ID back one

    qID--;
    questionKey=previousKey;

    // Delete current answer value
    answers[qID]=0.0;

    // Ask this question
    askQuestion(questionKey);

}



function doConversion(){

    /*
     * Calculates the unit Conversion and displays to screen
     *
     */


    // Get all unit labels and values

    var dictionary = questionset[typeChoice].dictionary;
    
    var labels = questionset[typeChoice].choices;
    
    var allvalues = questionset[typeChoice].values;

    
    var entryvalue = answers[nQ-1];

    console.log(entryvalue);

    // Convert user entry into cgs

    var cgs_value = entryvalue*dictionary[unitChoice];


    // Now convert into each available unit

    var answerString = "";
    var i;
    for (i=0; i< labels.length; i++)
    {
	var convertedValue = cgs_value/dictionary[labels[i]].toExponential();
	answerString = answerString + labels[i]+":&emsp; "+convertedValue+"<br>";
    }

    document.getElementById("resultheader").style.visibility = "visible";
    document.getElementById("submitbutton").style.visibility = "hidden";
    document.getElementById("backbutton").style.visibility = "hidden";
    
    
    document.getElementById("results").innerHTML = answerString;
    console.log(answerString);
    
    
    console.log(cgs_value, unitChoice,dictionary[unitChoice]);
    
    //
   


    
    

    

}




function clearBox(elementID)
{ 
    // Simple helper function to empty HTML elements
    document.getElementById(elementID).innerHTML = "";
}

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}
