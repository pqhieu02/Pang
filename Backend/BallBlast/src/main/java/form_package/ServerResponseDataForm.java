package form_package;

import java.util.ArrayList;

public class ServerResponseDataForm {
	public double playerX;
	public double playerY;
	public ArrayList<JsonForm> players = new ArrayList<>();
	public ArrayList<JsonForm> mobs = new ArrayList<>();
	public ArrayList<JsonForm> bullets = new ArrayList<>();
	public ArrayList<JsonForm> particles = new ArrayList<>();
}
