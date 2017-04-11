function submitScientist(e){
	e.preventDefault();
	console.log("button click");
	var fNameText = document.getElementById("fname");
	var lNameText = document.getElementById("lname");
	var yearsText = document.getElementById("years");
	var picUrlText = document.getElementById("picUrl");
	var bioText = document.getElementById("bio");
	
	var scientist = 
	{
		"firstName": fNameText.value,
		"lastName": lNameText.value,
		"years": yearsText.value,
		"picUrl": picUrlText.value,
		"bio": bioText.value
	}
	console.log("string made");
	var scientistJson = JSON.stringify(scientist);
	var http = new XMLHttpRequest();
	http.open("POST", "http://localhost:3000/scientist/suggest", true);
	http.setRequestHeader("Content-type", "application/json");
	http.send(scientistJson);
	http.onreadystatechange = function() {
    if (http.readyState == XMLHttpRequest.DONE) {
        document.removeChild(document.documentElement); // clear the document
		document.write(http.responseText);
    }
}
}

window.onload = function init(){
	var form = document.getElementById("form");
	console.log("loaded?");
	form.addEventListener('submit', submitScientist);
}