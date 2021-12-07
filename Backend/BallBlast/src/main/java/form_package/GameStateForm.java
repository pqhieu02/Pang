package myPackage;

import java.util.ArrayList;
import java.util.HashMap;

public class GameStateForm {
	public double playerX;
	public double playerY;
	public HashMap<String, Player> players = new HashMap<String, Player>();
	public ArrayList<Mob> mobs = new ArrayList<>();
	public ArrayList<Bullet> bullets = new ArrayList<>();
	public ArrayList<Particle> particles = new ArrayList<>();
}
