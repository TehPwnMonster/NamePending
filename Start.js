#pragma strict
var textFieldString = "Game level is under construction and may cause lag at this point.. Sorry about that :(!";

function OnGUI () {
	if (GUI.Button (Rect (40,40,100,100), "Start!")) {
		Application.LoadLevel ("InGame");
	}
	textFieldString = GUI.TextField (Rect (40, 140, 500, 60), textFieldString);
}
