package collection;

import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.ListIterator;

import main.Constant;

public class GameObjectCollection implements Constant {
	private HashMap<String, Player> players = new HashMap<String, Player>();
	private LinkedList<Mob> mobs = new LinkedList<>();
	private LinkedList<Bullet> bullets = new LinkedList<>();
	private LinkedList<Particle> particles = new LinkedList<>();

	// wrong solution
	private LinkedList<Mob> mobsQueue = new LinkedList<>();
	private LinkedList<Bullet> bulletsQueue = new LinkedList<>();
	private HashMap<String, Player> playersQueue = new HashMap<String, Player>();

	public String addPlayer(double x, double y, double size, Color color, double screenWidth, double screenHeight) {
		Player player = new Player(x, y, size, color, screenWidth, screenHeight);
		String playerId = player.getId();
		playersQueue.put(playerId, player);
		return playerId;
	}

	public Player getPlayer(String playerId) {
		return players.get(playerId);
	}

	public int getMobsCollectionSize() {
		return mobs.size();
	}

	public void addRandomMobToQueue(double x, double y, double size, double thresholdSize, Color color, String type) {
		Mob mob = new Mob(x, y, 1, size, thresholdSize, color, type);
		mobsQueue.add(mob);
	};

	public void addBulletToQueue(double playerX, double playerY, double destinationX, double destinationY, double size,
			Color color, Player player) {
		if (!player.getLifeStatus() || player.isVulnerable())
			return;
		Bullet bullet = new Bullet(playerX, playerY, destinationX, destinationY, BULLET_SIZE, BULLET_COLOR, player);
		bulletsQueue.add(bullet);
	}

	public void addParticle(double x, double y, double size, Color color, String type) {
		Particle particle = new Particle(x, y, size, color, type);
		particles.add(particle);

	}

	public void removeObjects() {
		ListIterator<Mob> Mob_it = mobs.listIterator();
		while (Mob_it.hasNext()) {
			Mob mob = Mob_it.next();
			if (!mob.isExisting()) {
				Mob_it.remove();

			}
		}

		ListIterator<Bullet> Bullet_it = bullets.listIterator();
		while (Bullet_it.hasNext()) {
			Bullet bullet = (Bullet) Bullet_it.next();
			Player gunner = bullet.getGunner();
			if (!bullet.isExisting() || !gunner.getLifeStatus()) {
				Bullet_it.remove();

			}
		}

		Iterator<Player> Player_it = players.values().iterator();
		while (Player_it.hasNext()) {
			Player player = (Player) Player_it.next();
			if (!player.isExisting()) {
				Player_it.remove();

			}
		}

		ListIterator<Particle> Particle_it = particles.listIterator();
		while (Particle_it.hasNext()) {
			Particle particle = Particle_it.next();
			if (!particle.isExisting()) {
				Particle_it.remove();
			}
		}
	}

	public void addGameObjectInQueueToWorld() {
		for (Mob mob : mobsQueue) {
			mobs.add(mob);
		}
		for (Bullet bullet : bulletsQueue) {
			bullets.add(bullet);
		}
		for (String id : playersQueue.keySet()) {
			Player player = playersQueue.get(id);
			players.put(id, player);
			System.out.println("Added " + id + " to collection GameObject 107");
		}
		mobsQueue.clear();
		bulletsQueue.clear();
		playersQueue.clear();
	}

	public void update() {
		removeObjects();
		for (Bullet bullet : bullets) {
			bullet.update();
		}
		for (Mob mob : mobs) {
			mob.update();
		}

		for (Particle particle : particles) {
			particle.update();
		}

		for (String playerId : players.keySet()) {
			Player player = players.get(playerId);

			// rename getLifeStatus -> isAlive ?
			if (!player.getLifeStatus())
				continue;
			player.update();
		}
	}

	public LinkedList<Mob> getMobs() {
		return mobs;
	}

	public LinkedList<Bullet> getBullets() {
		return bullets;
	}

	public HashMap<String, Player> getPlayers() {
		return players;
	}

	public LinkedList<Particle> getParticles() {
		return particles;
	}
}
