#pragma strict

var destination : Transform;
private var showGUI : boolean = false;
 


function OnTriggerEnter(other : Collider){
	if(other.gameObject.tag == "Player"){
		showGUI = true;
	}
}

function OnTriggerStay(other : Collider){
		if(Input.GetKeyDown (KeyCode.Mouse0)){
		Debug.Log("Teleported");
		other.transform.position = destination.position;
	}

}

function OnTriggerExit(other : Collider){
	if(other.gameObject.tag == "Player"){
	showGUI = false ;
	}
}
 
function OnGUI(){
	if(showGUI){
		GUI.Box (Rect (10,10,150,50), "Left Click to Teleport!");
	}
}