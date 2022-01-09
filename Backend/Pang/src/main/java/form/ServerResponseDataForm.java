package form;

import java.util.ArrayList;

public class ServerResponseDataForm {
	public double playerX;
	public double playerY;
	public boolean isAlive;
	public ArrayList<ObjectJsonForm> players = new ArrayList<>();
	public ArrayList<ObjectJsonForm> mobs = new ArrayList<>();
	public ArrayList<ObjectJsonForm> bullets = new ArrayList<>();
	public ArrayList<ObjectJsonForm> particles = new ArrayList<>();
}
