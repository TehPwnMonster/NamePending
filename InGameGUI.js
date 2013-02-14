#pragma strict
//Placement Plane items
var placementPlanesRoot : Transform;
var hoverMat : Material;
var placementLayerMask : LayerMask;
private var originalMat : Material;
private var lastHitObj : GameObject;

//build selection items
var onColor : Color;
var offColor : Color;
var allStructures : GameObject[];
var buildBtnGraphics : UISlicedSprite[];
private var structureIndex : int =0;

function Start()
{
	//reset the structure index, refresh the GUI
	structureIndex = 0;
	UpdateGUI();
}


function Update () 
{		
	//create a ray, and shoot it from the mouse position, forward into the game
	var ray = Camera.main.ScreenPointToRay (Input.mousePosition);
	var hit : RaycastHit;
	if(Physics.Raycast (ray, hit, 1000, placementLayerMask)) //if the RAY hits anything on right LAYER, within 1000 meters, save the hit item in variable "HIT", then...
	{
		if(lastHitObj) //if we had previously hit an object...
		{
			lastHitObj.renderer.material = originalMat; //visually de-select that object
		}
		
		lastHitObj = hit.collider.gameObject; //replace the "selected plane" with this new plane that the raycast just hit
		originalMat = lastHitObj.renderer.material; //store the new plane's starting material, so we can reset it later
		lastHitObj.renderer.material = hoverMat; //set the plane's material to the highlighted look
	}
	else //...if the raycast didn't hit anything (ie, the mouse moved outside the tiles) ...
	{
		if(lastHitObj) //if we had previously hit something...
		{
			lastHitObj.renderer.material = originalMat; //visually de-select that object
			lastHitObj = null; //nullify the plane selection- this is so that we can't accidentally drop turrets without a proper and valid location selected
		}
	}
	
	//drop turrets on click
	if(Input.GetMouseButtonDown(0) && lastHitObj) //left mouse was clicked, and we have a tile selected
	{
		if(lastHitObj.tag == "PlacementPlane_Open") //if the selected tile is "open"...
		{
			//drop the chosen structure exactly at the tile's position, and rotation of zero. See how the "index" comes in handy here? :)
			var newStructure : GameObject = Instantiate(allStructures[structureIndex], lastHitObj.transform.position, Quaternion.identity);
			//set this tile's tag to "Taken", so we can't double-place structures
			lastHitObj.tag = "PlacementPlane_Taken";
		}
	}
}	


//
//-- Custom Functions --//

//One Update to Rule them All!
//this function will eventually contain all generic update events
//this makes sure we don't have the same small parts being called over and over in different ways, throughout the script
function UpdateGUI()
{
	//Go through all structure buttons (the buttons in the build panel), and set them to "off"
	for(var theBtnGraphic : UISlicedSprite in buildBtnGraphics)
	{
		theBtnGraphic.color = offColor;
	}
	//set the selected build button to "on"
	buildBtnGraphics[structureIndex].color = onColor;
}


