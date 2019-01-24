/* Javascript to run the exoplanet unit converter
* Written by dh4gan (23-Jan-2019)
*/

var typeChoice = "";
var unitChoice = "";


// Unit selection question
var unit_type_question = {
    text:"Select Unit Type:",
    choices: ["Distance", "Mass","Time"],
    values: ["Distance", "Mass","Time"],
    qtype:"multichoice",
    explainertext:""
}

// Distance Variables

var distance_choices = ["cm", "inches","m", "double decker buses", "blue whales", "km","miles", "Moon Radii", "Mars Radii", "Earth Radii", "Neptune Radii", "Saturn Radii", "Jupiter Radii", "Solar Radii", "AU", "lightyears", "parsecs", "kiloparsecs", "megaparsecs", "gigaparsecs", "attoparsecs"];

var distance_values = [1.0, 2.54, 100.0, 1865.0, 2500.0, 1.0e5, 160934.4, 1.73814e8, 3.396e8, 6.371e8, 2.4764e9, 6.0268e9, 7.1492e9, 6.995e10, 1.496e13, 9.461e17,3.08568e18, 3.08568e21, 3.08568e24, 3.08568e27, 3.08568];

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

var mass_choices = ["g", "kg", "double decker buses", "blue whales", "Moon Masses", "Mars Masses", "Earth Masses", "Neptune Masses", "Saturn Masses", "Jupiter Masses", "Solar Masses"];
var mass_values = [1.0, 1000.0, 8.0e7, 1.4e8, 7.3477e25, 6.4185e26, 5.9736e27, 1.024e29, 5.6834e29, 1.8986e30, 1.988920e33];

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

var time_choices = ["seconds", "minutes", "hours", "days", "Martian sols", "weeks", "years", "Martian years", "Brexits", "Jovian years"];
var time_values = [1.0, 60.0, 3600.0, 86400.0, 88775.244, 604800.0, 31556926.0, 59354294.4, 8.7264e7, 374335776.0];

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

    askMultiChoice(questionset["Type"], "typebox", "typequestion");
}


function getUnitList(){

    
    typeChoice = getMultiChoiceAnswer(questionset["Type"], "typequestion");

    console.log(typeChoice);
    if(typeChoice!=undefined)
    {
	console.log("HERE");
	askMultiChoice(questionset[typeChoice],"unitbox", "unitquestion");

	document.getElementById("unitquestion").style.visibility="visible";
	document.getElementById("submitUnit").style.visibility="visible";
	document.getElementById("resultheader").style.visibility="hidden";
	clearBox("confirm");
	clearBox("valuebox");
	clearBox("results");

	document.getElementById("submitValue").style.visibility="hidden";
	document.getElementById("valuequestion").style.visibility="hidden";

	
    }
}

function getUnit(){

    unitChoice = getMultiChoiceAnswer(questionset[typeChoice],"unitquestion");

    if (unitChoice!=undefined)
    {
	if(document.getElementById("tbox") == undefined)
	{
	    askTextBox(questionset["Value"], "valuebox","valuequestion");
	}

	document.getElementById("submitValue").style.visibility="visible";
	document.getElementById("valuequestion").style.visibility="visible";
	document.getElementById("valuequestion").innerHTML = "Enter "+typeChoice;
	clearBox("confirm");
    }
}


function doConversion(){

    /*
     * Calculates the unit Conversion and displays to screen
     *
     */


    clearBox("confirm");
    var entryValue = 0.0;

    console.log(entryValue);
    // get value in textbox
    try
    {
	console.log(document.getElementById("tbox").value);
	entryValue = Number(document.getElementById("tbox").value);// Get value of textbox

	console.log(entryValue);
	if (isNaN(entryValue)) throw "Not a valid number - try again";												}
	catch(err)
	{
	    if(err!="TypeError")
	    {
		document.getElementById("confirm").innerHTML = err;
		return;
	    }
	}

	// Get all unit labels and values
	
	var dictionary = questionset[typeChoice].dictionary;
	var labels = questionset[typeChoice].choices;
	var allvalues = questionset[typeChoice].values;
	
	console.log(entryValue);
	
	// Convert user entry into cgs
	
	var cgs_value = entryValue*dictionary[unitChoice];
	
	
	// Now convert into each available unit
	
	var answerString = "Input: "+entryValue+" "+unitChoice +"<br><br>"  ;
	var i;
	for (i=0; i< labels.length; i++)
	{
	    var convertedValue = (cgs_value/dictionary[labels[i]]).toExponential(5);
	    answerString = answerString + labels[i]+":&emsp; "+convertedValue+"<br>";
	}
	
	document.getElementById("resultheader").style.visibility = "visible";
	
	
	document.getElementById("results").innerHTML = answerString;
	console.log(answerString);
	
	
	console.log(cgs_value, unitChoice,dictionary[unitChoice]);
	
	//

}


function askMultiChoice(question,boxID, questionName){
    /*
     * sets up a multiple choice question
     */


    clearBox(boxID);
    
    // Create radio buttons for possible choices
    for (i=0; i< question.choices.length; i++){

	
	var choiceLabel = document.createElement('label');
	choiceLabel.setAttribute('name', 'label'+String(i+1));
	var choiceRadioButton = document.createElement('input');
	var choiceString = questionName;
	
	choiceRadioButton.setAttribute('type', 'radio');
	choiceRadioButton.setAttribute('name', choiceString);
	
	choiceLabel.appendChild(choiceRadioButton);
	choiceLabel.appendChild(document.createTextNode(' '+question.choices[i]));
	choiceLabel.appendChild(document.createElement('br'));
	
	document.getElementById(boxID).appendChild(choiceLabel);
    }

    
}



function getMultiChoiceAnswer(question, elementName){

    var buttonList = document.getElementsByName(elementName);
    choice = -10;

    for (i=0; i < buttonList.length; i++)
    {	
	var ischecked = buttonList[i].checked;
	if(ischecked) choice = i;
    }

    console.log("Choice is ", choice, buttonList.length);
    
    if(choice==-10){
	document.getElementById("confirm").innerHTML = "Please select an option before continuing";
	return undefined;
    }
    else
	return question.choices[choice];
}



function askTextBox(question, boxID, elementName){
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

    // Get the input field
    var input = document.getElementById("myInput");

    
    // Execute a function when the user releases a key on the keyboard
    textBox.addEventListener("keyup", function(event) {
	// Cancel the default action, if needed
	event.preventDefault();
	// Number 13 is the "Enter" key on the keyboard
	if (event.keyCode === 13) {
	    // Trigger the button element with a click
	    document.getElementById("submitValue").click();
	}
    });
    
    document.getElementById(boxID).appendChild(textBox);
}


function clearBox(elementID)
{ 
    // Simple helper function to empty HTML elements
    document.getElementById(elementID).innerHTML = "";
}

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

