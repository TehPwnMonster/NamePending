#pragma strict

//var myExplosion : GameObject;
var myRange : float = 10;
var mySpeed : float = 10;
var myTarget : Transform;
var myDamageAmount : float = 25;
private var myDist : float;

function Start (){

}

function Update ()
{
	transform.Translate(Vector3.forward * Time.deltaTime * mySpeed); //Moves forwards on Vector3
	myDist += Time.deltaTime * mySpeed; 
	if(myDist >= myRange) //If the projectiles goes out of the given Range
		Explode(); //It Explodes

	if(myTarget) //If it can find myTarget (Easier than Boolean)
	{
		transform.LookAt(myTarget); //Aim Vector3 at the new position
	}
	else
	{
		Explode(); //Makes the Projectile explode if the "Enemy" no longer exists
	}
}


function OnTriggerEnter(other : Collider) //When it hits a collider
{
	if(other.gameObject.tag == "Enemy") //With an "Enemy" tag
		{
			Explode(); //Explode
		}
}

function Explode() //Explode = Destroy (Animation to be added in future)
{
	Destroy(gameObject); 
}