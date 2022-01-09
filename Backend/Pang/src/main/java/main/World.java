package main;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.Timer;
import java.util.TimerTask;

import com.google.gson.Gson;

import collection.Bullet;
import collection.Color;
import collection.GameObjectCollection;
import collection.Mob;
import collection.MobTypeDatamine;
import collection.Particle;
import collection.Player;
import form.GameStateForm;
import form.ServerResponseDataForm;
import math.MyMath;

public class World implements Constant {

	private GameObjectCollection gameObjectCollection = new GameObjectCollection();
	private CollisionHandler collisionHandler = new CollisionHandler();
	private CollisionDetector collisionDetector = new CollisionDetector(this, collisionHandler);

	private GameStateForm gameState = new GameStateForm();

	World() {
		init();
	}

	public void init() {
		for (int i = 0; i < WORLD_MOB_LIMIT; i++) {
			addRandomMob();
		}

		new Timer().scheduleAtFixedRate(new TimerTask() {
			@Override
			public void run() {
				update();
			}
		}, 0, 1000 / 60);

		new Timer().scheduleAtFixedRate(new TimerTask() {
			@Override
			public void run() {
				addRandomMob();
			}
		}, MOB_SPAWN_TIME, MOB_SPAWN_TIME);
	}

	public double[] getRandomSpawnCoordinate(double size, double spawnZoneSize) {
		double x;
		double y;
		do {
			x = MyMath.random(size, WORLD_WIDTH - size);
			y = MyMath.random(size, WORLD_HEIGHT - size);
		} while (collisionDetector.isOverlapping(x, y, spawnZoneSize));
		double[] coordinate = { x, y };
		return coordinate;
	}

	public String addPlayer(double screenWidth, double screenHeight) {
		double size = PLAYER_SIZE;
		double coordinate[] = getRandomSpawnCoordinate(size, PLAYER_SPAWN_ZONE_SIZE);
		double x = coordinate[0], y = coordinate[1];
		x = 100;
		y = 100;
		String playerId = gameObjectCollection.addPlayer(x, y, size, PLAYER_COLOR, screenWidth, screenHeight);
		return playerId;
	}

	public Player getPlayer(String playerId) {
		return gameObjectCollection.getPlayer(playerId);
	}

	public void addRandomMob() {
		if (gameObjectCollection.getMobsCollectionSize() >= WORLD_MOB_LIMIT)
			return;
		String mobType = Mob.randomMobType();
		MobTypeDatamine datamine = OBJECT_TYPE_DATAMINE.get(mobType);

		Color color = new Color((float) Math.random(), 1f, 0.5f);
		double thresholdSize = datamine.thresholdSize;
		double size = MyMath.random(datamine.minSize, datamine.maxSize);
		double coordinate[] = getRandomSpawnCoordinate(size, size);
		double x = coordinate[0], y = coordinate[1];
		gameObjectCollection.addRandomMobToQueue(x, y, size, thresholdSize, color, mobType);
	};

	public void addParticles(double x, double y, Color color, String type, int n) {
		MobTypeDatamine datamine = OBJECT_TYPE_DATAMINE.get(type);
		double particleSize = datamine.particleSize;

		for (int i = 0; i < n; i++) {
			gameObjectCollection.addParticle(x, y, particleSize, color, type);
		}
	}

	public void addBullet(Player player, double destinationX, double destinationY) {
		double playerX = player.getPositionX();
		double playerY = player.getPositionY();

		if (!player.isAlive() || player.isVulnerable())
			return;

		gameObjectCollection.addBulletToQueue(playerX, playerY, destinationX, destinationY, BULLET_SIZE, BULLET_COLOR,
				player);
	}

	public void update() {
		gameObjectCollection.addGameObjectInQueueToWorld();
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
		Player player = gameState.players.get(playerId);
		player.updateHeartBeat(LocalDateTime.now());

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
