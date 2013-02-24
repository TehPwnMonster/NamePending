var skin:GUISkin;
private var gldepth = -0.5;
private var startTime = 0.1;
var mat:Material;
private var tris = 0; //Used to specify the amount of Tris when you view your FPS
private var verts = 0; //See above
private var savedTimeScale:float; //Used to revert to our specific Timescale
private var pauseFilter; //Whether or not the game is paused
private var showfps:boolean; //Do you want the FPs shown
private var showtris:boolean; //Do you want Tris shown
private var showvtx:boolean; //Do you want vertexs shown
private var showfpsgraph:boolean; //Do you want the fps graph shown
var lowFPSColor = Color.red; //If your FPS is low - colour it red
var highFPSColor = Color.green; //If your FPs is high - colour it green
var lowFPS = 30; //Specify what is a low FPS
var highFPS = 50; //Specify what is a high fps
var start:GameObject; //Used to know where to unpause
var url = "unity.html"; //For Restart button
var statColor:Color = Color.yellow; //Colour of the GUI
var credits:String[]=[
	"A Names Pending Production",
	"Programming by Ben"]; //What the Credits show 
var crediticons:Texture[]; //specify texture for the credits
enum Page {
	None,Main,Options,Credits, Exit //Lists all pages in pause menu
}
private var currentPage:Page; //Sets the current page
private var fpsarray:int[]; //Used in checking+Displaying the FPS
private var fps:float; //Also used to checking+Displaying the FPS

function OnPostRender() { //After finished rendering the screen
	if (showfpsgraph && mat != null) {  //If you want to show the graph and the material is anything but null
		GL.PushMatrix ();     //not 100% sure on the rest of this function, it's working out the FPS
		GL.LoadPixelMatrix();
		for (var i = 0; i < mat.passCount; ++i)
		{
			mat.SetPass(i);
			GL.Begin( GL.LINES );
			for (var x=0; x<fpsarray.length; ++x) {
				GL.Vertex3(x,fpsarray[x],gldepth);
			}
		GL.End();
		}
		GL.PopMatrix();
		ScrollFPS();
	}
}
 
function ScrollFPS() { //If you have the FPS scrolling
	for (var x=1; x<fpsarray.length; ++x) {
		fpsarray[x-1]=fpsarray[x];
	}
	if (fps < 1000) { //if the FPS is less than 1000
		fpsarray[fpsarray.length-1]=fps; //uses the fpsarray variable to calculate the FPS
	}
}
 
static function IsDashboard() {
	return Application.platform == RuntimePlatform.OSXDashboardPlayer; //If it's a MAC
}
 
static function IsBrowser() {
	return (Application.platform == RuntimePlatform.WindowsWebPlayer || //If it's a Webplayer, and whether it's MAC or Windows
		Application.platform == RuntimePlatform.OSXWebPlayer);
}
 
function LateUpdate () { //Reload the FPS display again
	if (showfps || showfpsgraph) { //If you're showing FPs or have the FPS graph on
		FPSUpdate(); //Update the FPs
	}
	if (Input.GetKeyDown("escape")) { //If the user pushes Escape 
		switch (currentPage) {  //Switch curentPage
			case Page.None: PauseGame(); break; 
			case Page.Main: if (!IsBeginning()) UnPauseGame(); break; 
			default: currentPage = Page.Main;
		}
	}
}
 
function OnGUI () {
	if (skin != null) { //If no skin set
		GUI.skin = skin; //Use default
	}
	ShowStatNums(); //Show (Static?) numbers
	ShowLegal(); //Show the legal info
	if (IsGamePaused()) { //I the game is paused
		GUI.color = statColor; //Set GUi colour to the static colour
		switch (currentPage) { //switch currentPage
			case Page.Main: PauseMenu(); break;
			case Page.Options: ShowToolbar(); break;
			case Page.Credits: ShowCredits(); break;
		}
	}	
}
 
function ShowLegal() {
	if (!IsLegal()) { //If you're on the Legal page
		GUI.Label(Rect(Screen.width-100,Screen.height-20,90,20), //Create a button with
		"NamePending.com"); //A web link
	}
}
 
function IsLegal() { 
	return !IsBrowser() || //If you're on the legal page in a browser
	Application.absoluteURL.StartsWith("http://www.NamePending.com/") ||
	Application.absoluteURL.StartsWith("http://NamePending.com/");
}
 
private var toolbarInt:int=0;
private var toolbarStrings: String[]= ["Audio","Graphics","Stats","System"]; //Sets a string to be included whenever the variable is called
 
function ShowToolbar() {
	BeginPage(300,300); //Where to begin the toolbar
	toolbarInt = GUILayout.Toolbar (toolbarInt, toolbarStrings);
	switch (toolbarInt) {
		case 0: VolumeControl(); break; //Sets each of the 4 options and seperate buttons 
		case 3: ShowDevice(); break;
		case 1: Qualities(); QualityControl(); break;
		case 2: StatControl(); break;
	}
	EndPage();
}
 
function ShowCredits() {
	BeginPage(300,300); //Where to start the info
	for (var credit in credits) {
		GUILayout.Label(credit); //Displays credits variable
	}
	for (var credit in crediticons) {
		GUILayout.Label(credit);
	}
	EndPage();
}
 
function ShowBackButton() { 
	if (GUI.Button(Rect(20,Screen.height-50,50,20),"Back")) { //If they push the Back button
		currentPage = Page.Main; //sets current page to Main page
	}
}
 
 
function ShowDevice() {
	GUILayout.Label ("Unity player version "+Application.unityVersion); //Gets and displays information about the users system
	GUILayout.Label("Graphics: "+SystemInfo.graphicsDeviceName+" "+
	SystemInfo.graphicsMemorySize+"MB\n"+
	SystemInfo.graphicsDeviceVersion+"\n"+
	SystemInfo.graphicsDeviceVendor);
	GUILayout.Label("Shadows: "+SystemInfo.supportsShadows);
	GUILayout.Label("Image Effects: "+SystemInfo.supportsImageEffects);
	GUILayout.Label("Render Textures: "+SystemInfo.supportsRenderTextures);
}
 
function Qualities() {
        GUILayout.Label(QualitySettings.names[QualitySettings.GetQualityLevel()]);
}
 
function QualityControl() {
	GUILayout.BeginHorizontal();
	if (GUILayout.Button("Decrease")) {
		QualitySettings.DecreaseLevel(); //Allows the user to decrease or increase the game quality
	}
	if (GUILayout.Button("Increase")) {
		QualitySettings.IncreaseLevel();
	}
	GUILayout.EndHorizontal();
}
 
function VolumeControl() { //Allows the user to increase r decrease the volume via a slider interface
	GUILayout.Label("Volume");
	AudioListener.volume = GUILayout.HorizontalSlider(AudioListener.volume,0.0,1.0);
}
 
function StatControl() {
	GUILayout.BeginHorizontal(); //Toggle whether or not the want certain information to be displayed
	showfps = GUILayout.Toggle(showfps,"FPS");
	showtris = GUILayout.Toggle(showtris,"Triangles");
	showvtx = GUILayout.Toggle(showvtx,"Vertices");
	showfpsgraph = GUILayout.Toggle(showfpsgraph,"FPS Graph");
	GUILayout.EndHorizontal();
}
 
function FPSUpdate() {
	var delta = Time.smoothDeltaTime; //Sets a variable "Delta" as Time.smoothDeltaTime
		if (!IsGamePaused() && delta !=0.0) { //If the game is paused and variable delta is anything other than 0.0
			fps = 1 / delta; //Then the fps is 1/delta
		}
}
 
function ShowStatNums() { //Sets all the specific stats to be displayed when selected
	GUILayout.BeginArea(Rect(Screen.width-100,10,100,200));
	if (showfps) {
		var fpsString= fps.ToString ("#,##0 fps");
		GUI.color = Color.Lerp(lowFPSColor, highFPSColor,(fps-lowFPS)/(highFPS-lowFPS));
		GUILayout.Label (fpsString);
	}
	if (showtris || showvtx) {
		GetObjectStats();
		GUI.color = statColor;
	}
	if (showtris) {
		GUILayout.Label (tris+"tri");
	}
	if (showvtx) {
		GUILayout.Label (verts+"vtx");
	}
	GUILayout.EndArea();
}
 
function BeginPage(width,height) {
	GUILayout.BeginArea(Rect((Screen.width-width)/2,(Screen.height-height)/2,width,height));
}
 
function EndPage() {
	GUILayout.EndArea();
	if (currentPage != Page.Main) {
		ShowBackButton();
	}
}
 
function IsBeginning() {
	return Time.time < startTime;
}
 
 
function PauseMenu() {
	BeginPage(200,200); //Where to begin the pause page
	if (GUILayout.Button (IsBeginning() ? "Play" : "Continue")) { //Sets the options for the buttons displayed on the main page of the pause screen
		UnPauseGame();
 
	}
	if (GUILayout.Button ("Options")) {
		currentPage = Page.Options;
	}
	if (GUILayout.Button ("Credits")) {
		currentPage = Page.Credits;
	}
	if (GUILayout.Button ("Exit")) {
		Application.Quit();
	}
	if (IsBrowser() && !IsBeginning() && GUILayout.Button ("Restart")) {
		Application.OpenURL(url);
	}
	EndPage();
}
 
function GetObjectStats() { 
	verts = 0;
	tris = 0;
	var ob = FindObjectsOfType(GameObject);
	for (var obj in ob) {
		GetObjectStats(obj);
	}
}
 
function GetObjectStats(object) {
	var filters : Component[];
	filters = object.GetComponentsInChildren(MeshFilter);
	for( var f : MeshFilter in filters )
	{
    	tris += f.sharedMesh.triangles.Length/3;
  		verts += f.sharedMesh.vertexCount;
	}
}


function PauseGame() { 
    savedTimeScale = Time.timeScale; //Save the current time scale
    Time.timeScale = 0; //Set the time scale to 0 (Stops)
    AudioListener.pause = true; //Stop audio listener (Camera)
    if (pauseFilter) pauseFilter.enabled = true; //If you have a pause filter, turn it on
    currentPage = Page.Main; //Sends you to the main pause menu screen
}

function UnPauseGame() {
	Time.timeScale = savedTimeScale; //Change it back to the saved Timescale above
	AudioListener.pause = false; //Unpause the camera
	if (pauseFilter) pauseFilter.enabled = false; //Remove the pause filter
	currentPage = Page.None; //Set the currentPage to nothing
	Time.timeScale = 1.0; 
	if (IsBeginning() && start != null) { //If fresh game - start from the beginning
		start.active = true;
	}
}
 
function IsGamePaused() {
	return Time.timeScale==0; //If the game is paused, set the Timescale to 0 (Nothing)
}
 
function OnApplicationPause(pause:boolean) {
	if (IsGamePaused()) {
		AudioListener.pause = true; //Freezes Camera - Not currently working for Jakes level
	}
}