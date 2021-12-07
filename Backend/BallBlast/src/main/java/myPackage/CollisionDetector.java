package myPackage;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;

import collection_package.Bullet;
import collection_package.GameObject;
import collection_package.GameObjectCollection;
import collection_package.Mob;
import collection_package.Player;

public class CollisionDetector implements Constant {
	private ArrayList<ArrayList<LinkedList<GameObject>>> grid = new ArrayList<>();
	private HashMap<GameObject, HashMap<GameObject, Boolean>> collisionTracker = new HashMap<>();
	private CollisionHandler collisionHandler;
	private World world;

	CollisionDetector(World world, CollisionHandler collisionHandler) {
		this.world = world;
		this.collisionHandler = collisionHandler;
		initGrid();
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

	public boolean isColliding(GameObject first, GameObject second) {
		if (first.getSize() <= 0 || second.getSize() <= 0)
			return false;

		double X = first.getPositionX() - second.getPositionX();
		double Y = first.getPositionY() - second.getPositionY();
		double limit = first.getSize() + second.getSize();
		double distanceSquare = X * X + Y * Y;
		if (distanceSquare < limit * limit)
			return true;
		return false;
	}

	public boolean isColliding(double x, double y, double size, GameObject target) {
		double X = x - target.getPositionX();
		double Y = y - target.getPositionY();
		double limit = size + target.getSize();
		double distanceSquare = X * X + Y * Y;
		if (distanceSquare < limit * limit)
			return true;
		return false;
	}

	public boolean isOverlapping(double x, double y, double size) {
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

	public void clearGrid() {
		for (int i = 0; i < GRID_WIDTH; i++) {
			for (int j = 0; j < GRID_HEIGHT; j++) {
				LinkedList<GameObject> square = grid.get(i).get(j);
				square.clear();
			}
		}
	}

	public void updateGrid() {
		GameObjectCollection gameObjectCollection = world.getGameObjectCollection();
		LinkedList<Mob> mobs = gameObjectCollection.getMobs();
		LinkedList<Bullet> bullets = gameObjectCollection.getBullets();
		HashMap<String, Player> players = gameObjectCollection.getPlayers();

		clearGrid();
		for (Mob mob : mobs) {
			addObjectToGrid(mob);
		}
		for (Bullet bullet : bullets) {
			addObjectToGrid(bullet);
		}
		for (String playerId : players.keySet()) {
			Player player = players.get(playerId);

			if (!player.getLifeStatus())
				continue;
			addObjectToGrid(player);
		}
	}

	private void resetCollisionTracker() {
		GameObjectCollection gameObjectCollection = world.getGameObjectCollection();
		LinkedList<Mob> mobs = gameObjectCollection.getMobs();
		LinkedList<Bullet> bullets = gameObjectCollection.getBullets();
		HashMap<String, Player> players = gameObjectCollection.getPlayers();

		collisionTracker.clear();
		for (Mob mob : mobs) {
			collisionTracker.put(mob, new HashMap<GameObject, Boolean>());
		}
		for (Bullet bullet : bullets) {
			collisionTracker.put(bullet, new HashMap<GameObject, Boolean>());
		}
		for (String playerId : players.keySet()) {
			Player player = players.get(playerId);

			if (!player.getLifeStatus())
				continue;
			collisionTracker.put(player, new HashMap<GameObject, Boolean>());
		}

	}

	private boolean hasNotCollided(GameObject first, GameObject second) {
		if (collisionTracker.get(first).get(second) == null || collisionTracker.get(second).get(first) == null)
			return true;

		return false;
	}

	public void detectCollision() {
		resetCollisionTracker();
		for (int i = 0; i < GRID_WIDTH; i++) {
			for (int j = 0; j < GRID_HEIGHT; j++) {

				LinkedList<GameObject> square = grid.get(i).get(j);
				for (int x = 0; x < square.size(); x++) {
					GameObject first = square.get(x);
					for (int y = x + 1; y < square.size(); y++) {
						GameObject second = square.get(y);

						if (hasNotCollided(first, second) && isColliding(first, second)) {
							collisionHandler.run(world, first, second);
							collisionTracker.get(first).put(second, true);
							collisionTracker.get(second).put(first, true);
						}
					}
				}
			}
		}
	}
}