#pragma strict

var hp = 2;
var Projectile = Transform;
	
function OnTriggerEnter(){
	if(Projectile)
	{
		(hp--);
		Debug.Log("-1");
	}
	if (hp==0){
		Destroy(gameObject);
	}
}