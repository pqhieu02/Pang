package form_package;

import java.util.ArrayList;
import java.util.HashMap;

import collection_package.Bullet;
import collection_package.Mob;
import collection_package.Particle;
import collection_package.Player;

public class GameStateForm {
	public double playerX;
	public double playerY;
	public HashMap<String, Player> players = new HashMap<String, Player>();
	public ArrayList<Mob> mobs = new ArrayList<>();
	public ArrayList<Bullet> bullets = new ArrayList<>();
	public ArrayList<Particle> particles = new ArrayList<>();
}
