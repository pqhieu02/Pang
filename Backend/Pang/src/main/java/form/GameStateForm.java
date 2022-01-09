package form;

import java.util.ArrayList;
import java.util.HashMap;

import collection.Bullet;
import collection.Mob;
import collection.Particle;
import collection.Player;

public class GameStateForm {
	public double playerX;
	public double playerY;
	public HashMap<String, Player> players = new HashMap<String, Player>();
	public ArrayList<Mob> mobs = new ArrayList<>();
	public ArrayList<Bullet> bullets = new ArrayList<>();
	public ArrayList<Particle> particles = new ArrayList<>();
}
