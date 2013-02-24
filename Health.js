#pragma strict

var hp = 10;
var Enemy = GameObject;


function Update(){
	if (hp==0)
	{
	Time.timeScale = 0;
		if (GUI.Button (Rect (350,350,450,450), "Game over, click here to restart")){
			Application.LoadLevel ("InGame");
		}
	}
}
	
function OnTriggerEnter(){
	if(Enemy)
	{
		(hp--);
	}
}
	

