#pragma strict

var auditorPrefab : GameObject;
var auditorSpawns : Transform;
private var auditorSpawnPoints : Transform[];
var spawnInterval : float = 1;
var nextSpawnTime : float = 0;

function Start()
{
auditorSpawnPoints = new Transform[auditorSpawns.childCount];
	var X : int = 0;
	for(var theSpawnPoint : Transform in auditorSpawns)
	{
		auditorSpawnPoints[X] = theSpawnPoint;
		X++;
	}
}

function Update ()
{
if(Time.time >= nextSpawnTime)
	{
		SpawnAuditor();
	}
}



function SpawnAuditor()
{
	nextSpawnTime+=spawnInterval;
	var X : int = Random.Range(0,auditorSpawnPoints.length);
	var newAuditor : GameObject = Instantiate(auditorPrefab, auditorSpawnPoints[X].position, auditorSpawnPoints[X].rotation);
}
