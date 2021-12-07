package myPackage;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.Timer;
import java.util.TimerTask;

import com.google.gson.Gson;

import collection_package.Bullet;
import collection_package.ColorObject;
import collection_package.GameObjectCollection;
import collection_package.Mob;
import collection_package.MobTypeDatamine;
import collection_package.Particle;
import collection_package.Player;
import form_package.GameStateForm;
import form_package.ServerResponseDataForm;
import mathPackage.myMath;

public class World implements Constant {

	private GameObjectCollection gameObjectCollection = new GameObjectCollection();
	private CollisionHandler collisionHandler = new CollisionHandler();
	private CollisionDetector collisionDetector = new CollisionDetector(this, collisionHandler);
	private GameStateForm gameState = new GameStateForm();

	World() {
		init();
	}

	public void init() {
		new Timer().scheduleAtFixedRate(new TimerTask() {
			@Override
			public void run() {
				update();
			}
		}, 0, 1000 / 60);

//		new Timer().scheduleAtFixedRate(new TimerTask() {
//			@Override
//			// mutex !!!
//			public void run() {
//				addRandomMob();
//			}
//		}, MOB_SPAWN_TIME, MOB_SPAWN_TIME);
		for (int i = 0; i < WORLD_MOB_LIMIT; i++) {
			addRandomMob();
		}
	}

	public double[] getRandomSpawnCoordinate(double size, double spawn_zone_size) {
		double x;
		double y;
		do {
			x = myMath.random(size, WORLD_WIDTH - size);
			y = myMath.random(size, WORLD_HEIGHT - size);
		} while (collisionDetector.isOverlapping(x, y, spawn_zone_size));
		double[] coordinate = { x, y };
		return coordinate;
	}

	public String addPlayer(double screenWidth, double screenHeight) {
		double size = PLAYER_SIZE;
		double coordinate[] = getRandomSpawnCoordinate(size, PLAYER_SPAWN_ZONE_SIZE);
		double x = coordinate[0], y = coordinate[1];
		String playerId = gameObjectCollection.addPlayer(x, y, size, PLAYER_COLOR, screenWidth, screenHeight);
		return playerId;
	}

	public Player getPlayer(String playerId) {
		return gameObjectCollection.getPlayer(playerId);
	}

	public void addRandomMob() {
		if (gameObjectCollection.mobsCollectionSize() >= WORLD_MOB_LIMIT)
			return;
		String type = Mob.randomMobType();
		MobTypeDatamine datamine = OBJECT_TYPE_DATAMINE.get(type);

		ColorObject color = new ColorObject((float) Math.random(), 1f, 0.5f);
		double thresholdSize = datamine.thresholdSize;
		double size = myMath.random(datamine.minSize, datamine.maxSize);
		double coordinate[] = getRandomSpawnCoordinate(size, size);
		double x = coordinate[0], y = coordinate[1];

		gameObjectCollection.addRandomMob(x, y, size, thresholdSize, color, type);
	};

	public void addParticles(double x, double y, ColorObject color, String type, int n) {
		MobTypeDatamine datamine = OBJECT_TYPE_DATAMINE.get(type);
		double particleSize = datamine.particleSize;

		for (int i = 0; i < n; i++) {
			gameObjectCollection.addParticles(x, y, particleSize, color, type);
		}
	}

	public void addBullet(Player player, double destinationX, double destinationY) {
		double playerX = player.getPositionX();
		double playerY = player.getPositionY();

		if (!player.getLifeStatus() || player.isVulnerable())
			return;

		gameObjectCollection.addBullet(playerX, playerY, destinationX, destinationY, BULLET_SIZE, BULLET_COLOR, player);
	}

	public void update() {
		collisionDetector.updateGrid();
		collisionDetector.detectCollision();
		gameObjectCollection.update();
		updateGameState();
	}

	public void updateGameState() {
		LinkedList<Mob> mobs = gameObjectCollection.getMobs();
		LinkedList<Bullet> bullets = gameObjectCollection.getBullets();
		HashMap<String, Player> players = gameObjectCollection.getPlayers();
		LinkedList<Particle> particles = gameObjectCollection.getParticles();

		gameState.particles = new ArrayList<Particle>(particles);
		gameState.mobs = new ArrayList<Mob>(mobs);
		gameState.bullets = new ArrayList<Bullet>(bullets);
		gameState.players = new HashMap<String, Player>(players);
	}

	public String getGameState(String playerId) {
		ServerResponseDataForm response = new ServerResponseDataForm();
		Gson gson = new Gson();
		Player player = getPlayer(playerId);
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

	public GameObjectCollection getGameObjectCollection() {
		return gameObjectCollection;
	}
}
