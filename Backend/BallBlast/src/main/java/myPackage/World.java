package myPackage;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.ListIterator;
import java.util.Timer;
import java.util.TimerTask;

import com.google.gson.Gson;

public class World implements Constant {

	private class CollisionManagementMethod {
		private boolean isColliding(GameObject first, GameObject second) {
			if (first.getSize() <= 0 || second.getSize() <= 0)
				return false;
			if (first instanceof Bullet && second instanceof Player) {
				Bullet bullet = (Bullet) first;
				Player player = (Player) second;
				if (bullet.getGunner() == player)
					return false;
			}
			if (second instanceof Bullet && first instanceof Player) {
				Bullet bullet = (Bullet) second;
				Player player = (Player) first;
				if (bullet.getGunner() == player)
					return false;
			}

			double X = first.getPositionX() - second.getPositionX();
			double Y = first.getPositionY() - second.getPositionY();
			double limit = first.getSize() + second.getSize();
			double distance = Math.sqrt(X * X + Y * Y);
			if (distance < limit)
				return true;
			return false;
		}

		private boolean isColliding(double x, double y, double size, GameObject target) {
			double X = x - target.getPositionX();
			double Y = y - target.getPositionY();
			double limit = size + target.getSize();
			double distance = Math.sqrt(X * X + Y * Y);
			if (distance < limit)
				return true;
			return false;
		}

		private boolean isOverlapping(double x, double y, double size) {
			int startX = (int) Math.max(0, Math.floor((x - size) / GRID_SQUARE_SIZE));
			int startY = (int) Math.max(0, Math.floor((y - size) / GRID_SQUARE_SIZE));
			int endX = (int) Math.min(GRID_WIDTH - 1, Math.floor((x + size) / GRID_SQUARE_SIZE));
			int endY = (int) Math.min(GRID_HEIGHT - 1, Math.floor((y + size) / GRID_SQUARE_SIZE));

			for (int i = startX; i <= endX; i++) {
				for (int j = startY; j <= endY; j++) {
					LinkedList<GameObject> square = grid.get(i).get(j);
					for (GameObject target : square) {
						if (isColliding(x, y, size, target))
							return true;
					}
				}
			}
			return false;
		}

		private void bounce(GameObject a, GameObject b) {
			// https://en.wikipedia.org/wiki/Elastic_collision#Two-dimensional_collision_with_two_moving_objects
			// no mass

			Velocity vA = a.getVelocity();
			Velocity vB = b.getVelocity();

			double x1 = a.getPositionX() - b.getPositionX();
			double x2 = b.getPositionX() - a.getPositionX();

			double y1 = a.getPositionY() - b.getPositionY();
			double y2 = b.getPositionY() - a.getPositionY();

			double d = x1 * x1 + y1 * y1;
			double dot1 = (vA.getX() - vB.getX()) * x1 + (vA.getY() - vB.getY()) * y1;
			double dot2 = (vB.getX() - vA.getX()) * x2 + (vB.getY() - vA.getY()) * y2;

			vA.setX(vA.getX() - (dot1 / d) * x1);
			vA.setY(vA.getY() - (dot1 / d) * y1);

			vB.setX(vB.getX() - (dot2 / d) * x2);
			vB.setY(vB.getY() - (dot2 / d) * y2);

			double ratio = 1 - Math.sqrt(d) / (a.getSize() + b.getSize());
			a.setPositionX(a.getPositionX() + x1 * ratio);
			a.setPositionY(a.getPositionY() + y1 * ratio);

			b.setPositionX(b.getPositionX() + x2 * ratio);
			b.setPositionY(b.getPositionY() + y2 * ratio);
		}

		private void detectCollision() {
			for (int i = 0; i < GRID_WIDTH; i++)
				for (int j = 0; j < GRID_HEIGHT; j++) {

					LinkedList<GameObject> square = grid.get(i).get(j);
					for (int x = 0; x < square.size(); x++) {
						GameObject first = square.get(x);
						for (int y = x + 1; y < square.size(); y++) {
							GameObject second = square.get(y);
							if (isColliding(first, second)) {
								if (first.isExplosive()) {
									double firstX = first.getPositionX();
									double firstY = first.getPositionY();
									ColorObject firstColor = first.getColorObject();
									String type = first.getType();
									addParticle(firstX, firstY, firstColor, type, COLLISION_PARTICLE_TOTAL);
								}

								if (second.isExplosive()) {
									double secondX = second.getPositionX();
									double secondY = second.getPositionY();
									ColorObject secondColor = second.getColorObject();
									String type = second.getType();
									addParticle(secondX, secondY, secondColor, type, COLLISION_PARTICLE_TOTAL);
								}

								if (first.isBouncing() && second.isBouncing())
									bounce(first, second);

								first.handleCollision(second);
								second.handleCollision(first);
							}
						}
					}
				}
		}

	}

	private HashMap<String, Player> players = new HashMap<String, Player>();
	private LinkedList<Mob> mobs = new LinkedList<>();
	private LinkedList<Bullet> bullets = new LinkedList<>();
	private LinkedList<Particle> particles = new LinkedList<>();
	private ArrayList<ArrayList<LinkedList<GameObject>>> grid = new ArrayList<>();
	private CollisionManagementMethod CollisionManager = new CollisionManagementMethod();

	private GameStateForm gameState = new GameStateForm();

	World() {
		initGrid();
		init();
		new Timer().scheduleAtFixedRate(new TimerTask() {
			@Override
			public void run() {
				update();
			}
		}, 0, 1000 / 60);
	}

	public void init() {
		new Timer().scheduleAtFixedRate(new TimerTask() {
			@Override
			public void run() {
				addMob();
			}
		}, MOB_SPAWN_TIME, MOB_SPAWN_TIME);
		for (int i = 0; i < WORLD_MOB_LIMIT; i++) {
			addMob();
		}
	}

	public void initGrid() {
		for (int x = 0; x < GRID_WIDTH; x++) {
			ArrayList<LinkedList<GameObject>> row = new ArrayList<>();
			for (int y = 0; y < GRID_HEIGHT; y++) {
				LinkedList<GameObject> column = new LinkedList<>();
				row.add(column);
			}
			grid.add(row);
		}
	}

	public void addObjectToGrid(GameObject obj) {
		double x = obj.getPositionX();
		double y = obj.getPositionY();
		double size = obj.getSize();

		int startX = (int) Math.max(0, Math.floor((x - size) / GRID_SQUARE_SIZE));
		int startY = (int) Math.max(0, Math.floor((y - size) / GRID_SQUARE_SIZE));
		int endX = (int) Math.min(GRID_WIDTH - 1, Math.floor((x + size) / GRID_SQUARE_SIZE));
		int endY = (int) Math.min(GRID_HEIGHT - 1, Math.floor((y + size) / GRID_SQUARE_SIZE));

		for (int i = startX; i <= endX; i++) {
			for (int j = startY; j <= endY; j++) {
				LinkedList<GameObject> square = grid.get(i).get(j);
				if (square.indexOf(obj) > -1)
					continue;
				square.add(obj);
			}
		}
	}

	public void removeObjectFromGrid(GameObject obj) {
		double x = obj.getPositionX();
		double y = obj.getPositionY();
		double size = obj.getSize();

		int startX = (int) Math.max(0, Math.floor((x - size) / GRID_SQUARE_SIZE));
		int startY = (int) Math.max(0, Math.floor((y - size) / GRID_SQUARE_SIZE));
		int endX = (int) Math.min(GRID_WIDTH - 1, Math.floor((x + size) / GRID_SQUARE_SIZE));
		int endY = (int) Math.min(GRID_HEIGHT - 1, Math.floor((y + size) / GRID_SQUARE_SIZE));

		for (int i = startX; i <= endX; i++) {
			for (int j = startY; j <= endY; j++) {
				LinkedList<GameObject> square = grid.get(i).get(j);
				square.remove(obj);
			}
		}

	}

	public String addPlayer(double worldWidth, double worldHeight) {
		double x = Math.random() * (WORLD_WIDTH - PLAYER_SIZE) + PLAYER_SIZE;
		double y = Math.random() * (WORLD_HEIGHT - PLAYER_SIZE) + PLAYER_SIZE;
//		double x = Math.random() * (1000 - PLAYER_SIZE) + PLAYER_SIZE;
//		double y = Math.random() * (1000 - PLAYER_SIZE) + PLAYER_SIZE;

		while (CollisionManager.isOverlapping(x, y, PLAYER_SPAWN_ZONE_SIZE)) {
			x = Math.random() * (WORLD_WIDTH - PLAYER_SIZE) + PLAYER_SIZE;
			y = Math.random() * (WORLD_HEIGHT - PLAYER_SIZE) + PLAYER_SIZE;
		}
		Player player = new Player(x, y, PLAYER_SIZE, PLAYER_COLOR, worldWidth, worldHeight);
		String playerId = player.getId();
		players.put(playerId, player);
		addObjectToGrid(player);
		return playerId;
	}

	public Player getPlayer(String playerId) {
		return players.get(playerId);
	}

	public void addMob() {
		if (mobs.size() >= WORLD_MOB_LIMIT)
			return;
		double x, y;
		double size = 0;
		double sizeThreshold = 0;
		ColorObject color = new ColorObject((float) Math.random(), 1f, 0.5f);
		String type = new String();
		int random_type = (int) (Math.random() * 3);
		switch (random_type) {
		case 0: {
			type = TYPE_HEXAGON;
			size = Math.random() * (MOB_HEXAGON_MAX_SIZE - MOB_HEXAGON_MIN_SIZE) + MOB_HEXAGON_MIN_SIZE;
			sizeThreshold = MOB_HEXAGON_SIZE_THRESHOLD;
			break;
		}
		case 1: {
			type = TYPE_SQUARE;
			size = Math.random() * (MOB_SQUARE_MAX_SIZE - MOB_SQUARE_MIN_SIZE) + MOB_SQUARE_MIN_SIZE;
			sizeThreshold = MOB_SQUARE_SIZE_THRESHOLD;
			break;
		}
		case 2: {
			type = TYPE_TRIANGLE;
			size = Math.random() * (MOB_TRIANGLE_MAX_SIZE - MOB_TRIANGLE_MIN_SIZE) + MOB_TRIANGLE_MIN_SIZE;
			sizeThreshold = MOB_TRIANGLE_SIZE_THRESHOLD;
			break;
		}
		}

		x = Math.random() * (WORLD_WIDTH - size) + size;
		y = Math.random() * (WORLD_HEIGHT - size) + size;
		if (CollisionManager.isOverlapping(x, y, size))
			return;
		Mob mob = new Mob(x, y, 1, size, sizeThreshold, color, type);
		mobs.add(mob);
		addObjectToGrid(mob);
	};

	private void addParticle(double x, double y, ColorObject color, String type, int n) {
		double size = 0;
		switch (type) {
		case TYPE_HEXAGON: {
			size = HEXAGON_PARTICLE_SIZE;
			break;
		}
		case TYPE_SQUARE: {
			size = SQUARE_PARTICLE_SIZE;
			break;
		}
		case TYPE_TRIANGLE: {
			size = TRIANGLE_PARTICLE_SIZE;
			break;
		}
		case TYPE_CIRCLE: {
			size = CIRCLE_PARTICLE_SIZE;
		}
		}
		for (int i = 0; i < n; i++) {
			Particle particle = new Particle(x, y, size, color, type);
			particles.add(particle);
		}
	}

	public void addBullet(String playerId, double destinationX, double destinationY) {
		Player player = players.get(playerId);
		double playerX = player.getPositionX();
		double playerY = player.getPositionY();

		if (!player.getLifeStatus() || player.isVulnerable())
			return;
		Bullet bullet = new Bullet(playerX, playerY, destinationX, destinationY, BULLET_SIZE, BULLET_COLOR, player);
		bullets.add(bullet);
		addObjectToGrid(bullet);
	}

	public void removeObjects() {
		ListIterator<Mob> Mob_it = mobs.listIterator();
		while (Mob_it.hasNext()) {
			Mob mob = Mob_it.next();
			if (!mob.isExisting()) {
				Mob_it.remove();
				removeObjectFromGrid(mob);
			}
		}

		ListIterator<Bullet> Bullet_it = bullets.listIterator();
		while (Bullet_it.hasNext()) {
			Bullet bullet = (Bullet) Bullet_it.next();
			Player gunner = bullet.getGunner();
			if (!bullet.isExisting() || !gunner.getLifeStatus()) {
				Bullet_it.remove();
				removeObjectFromGrid(bullet);
			}
		}

		Iterator<Player> Player_it = players.values().iterator();
		while (Player_it.hasNext()) {
			Player player = (Player) Player_it.next();
			if (!player.isExisting()) {
				Player_it.remove();
				removeObjectFromGrid(player);
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

	public void update() {
		CollisionManager.detectCollision();
		removeObjects();

		for (Bullet bullet : bullets) {
			removeObjectFromGrid(bullet);
			bullet.update();
			addObjectToGrid(bullet);
		}
		for (Mob mob : mobs) {
			removeObjectFromGrid(mob);
			mob.update();
			addObjectToGrid(mob);
		}

		for (Particle particle : particles) {
			particle.update();
		}

		for (String playerId : players.keySet()) {
			Player player = players.get(playerId);

			removeObjectFromGrid(player);
			if (!player.getLifeStatus())
				continue;
			player.update();
			addObjectToGrid(player);
		}
		updateGameState();
	}

	public void updateGameState() {
		gameState.particles = new ArrayList<Particle>(particles);
		gameState.mobs = new ArrayList<Mob>(mobs);
		gameState.bullets = new ArrayList<Bullet>(bullets);
		gameState.players = new HashMap<String, Player>(players);
	}

	public String getGameState(String playerId) {
		ServerResponseDataForm response = new ServerResponseDataForm();
		Gson gson = new Gson();
		Player player = players.get(playerId);
		double cameraTopX = player.getCameraTopX();
		double cameraTopY = player.getCameraTopY();
		double cameraBotX = player.getCameraBotX();
		double cameraBotY = player.getCameraBotY();

		response.playerX = player.getPositionX();
		response.playerY = player.getPositionY();

		for (Particle particle : gameState.particles) {
			double x = particle.getPositionX();
			double y = particle.getPositionY();
			double size = particle.getSize();

			if (x + size < cameraTopX || x - size > cameraBotX || y + size < cameraTopY || y - size > cameraBotY)
				continue;
			response.particles.add(particle.getData());
		}

		for (Bullet bullet : gameState.bullets) {
			double x = bullet.getPositionX();
			double y = bullet.getPositionY();
			double size = bullet.getSize();

			if (x + size < cameraTopX || x - size > cameraBotX || y + size < cameraTopY || y - size > cameraBotY)
				continue;

			response.bullets.add(bullet.getData());
		}

		for (Mob mob : gameState.mobs) {
			double x = mob.getPositionX();
			double y = mob.getPositionY();
			double size = mob.getSize();
			if (x + size < cameraTopX || x - size > cameraBotX || y + size < cameraTopY || y - size > cameraBotY)
				continue;

			response.mobs.add(mob.getData());
		}
		for (String id : gameState.players.keySet()) {
			Player other = gameState.players.get(id);
			if (!other.getLifeStatus()) // ???
				continue;

			double x = other.getPositionX();
			double y = other.getPositionY();
			double size = other.getSize();

			if (x + size < cameraTopX || x - size > cameraBotX || y + size < cameraTopY || y - size > cameraBotY)
				continue;

			response.players.add(other.getData());
		}

		String json = gson.toJson(response);
		return json;
	}
}
