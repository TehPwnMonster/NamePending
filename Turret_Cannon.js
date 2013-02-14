#pragma strict

var Projectile : GameObject;
var reloadTime : float = 1f;
var turnSpeed : float = 5f;
var firePauseTime : float = .25f;
var myTarget : Transform;
var muzzlePositions : Transform[];
var turretBall : Transform;

private var nextFireTime : float;
private var nextMoveTime : float;
private var desiredRotation : Quaternion;
private var aimError : float;

function start ()
{

}
	
function Update ()
{
	if(myTarget)
	{
		if(Time.time >= nextMoveTime) //if the Time is greater than or equal to move time
		{
			CalculateAimPosition(myTarget.position); //calculate the position to aim at
			turretBall.rotation = Quaternion.Lerp(turretBall.rotation, desiredRotation, Time.deltaTime*turnSpeed); //rotate to said position
		}

		if(Time.time >= nextFireTime) //if Time is greater than or equal to the next fire time
		{
			FireProjectile(); //Shoot
		}
	}
}

function OnTriggerStay(other : Collider)
{
	if(!myTarget)//if I don't already have a target
	{
		if(other.gameObject.tag == "Enemy")
		{
			nextFireTime = Time.time+(reloadTime*.5);
			myTarget = other.gameObject.transform;
		}
	}
}

function OnTriggerExit(other : Collider) //if the "Enemy" leaves the collider
{
	if(other.gameObject.transform == myTarget)
	{
	myTarget = null; //Stop targetting
	}
}

function CalculateAimPosition(targetPos : Vector3) //Points the Muzzles Vector3 (Z axis) towards the Enemy
{
	var aimPoint = Vector3(targetPos.x, targetPos.y, targetPos.z);
	desiredRotation = Quaternion.LookRotation(myTarget.position - turretBall.position);
}


function FireProjectile()
{
	nextFireTime = Time.time+reloadTime;
	
	var m : int = Random.Range(0,1);//Only effective on turrets with multiple muzzles
	var newProjectile = Instantiate(Projectile, muzzlePositions[m].position, muzzlePositions[m].rotation);
	newProjectile.GetComponent(Projectile_cannon).myTarget = myTarget; //Sets the projectiles Target as the targetted Enemy, Used to make the projectiles Home in
}