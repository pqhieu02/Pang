package myPackage;

import java.util.HashMap;

public interface Constant {
	final String SPEED_TARGET_MOB = "MOB";
	final String SPEED_TARGET_BULLET = "BULLET";
	final String SPEED_TARGET_PARTICLE = "PARTICLE";
	final HashMap<String, Double> SPEED = new HashMap<String, Double>() {
		{
			put("MOB", 0.5d);
			put("BULLET", 8d);
			put("PARTICLE", 10d);
		}
	};

	final String TYPE_HEXAGON = "HEXAGON";
	final String TYPE_SQUARE = "SQUARE";
	final String TYPE_TRIANGLE = "TRIANGLE";
	final String TYPE_CIRCLE = "CIRCLE";
	final double SHRINK_SPEED = 0.5;
	final double GROW_SPEED = 0.5;

	final double WORLD_WIDTH = 6000;
	final double WORLD_HEIGHT = 6000;
	final int WORLD_MOB_LIMIT = 500;
	final double DEFAULT_HP_GENERATION = 0;

	final double ANGLE_ROTATE_SPEED = 0.5;

	final int GRID_SQUARE_SIZE = 250;
	final double GRID_WIDTH = WORLD_WIDTH / GRID_SQUARE_SIZE;
	final double GRID_HEIGHT = WORLD_HEIGHT / GRID_SQUARE_SIZE;

	final int PLAYER_SPAWN_ZONE_SIZE = 100;
	final ColorObject PLAYER_COLOR = new ColorObject(1f, 1f, 1f);
	final double PLAYER_SIZE = 30;
	final int PLAYER_STEP = 5;
	final double PLAYER_DEFAULT_MAX_HP = 100;
	final int PLAYER_CIRLCE_SIZE_THRESHOLD = 5;
	final double PLAYER_GROW_SPEED = (double) PLAYER_SIZE / (double) 120;
	final int FIRE_RATE = 1000;
	final double PLAYER_DEFAULT_DAMAGE = 0.1;

	final ColorObject BULLET_COLOR = new ColorObject(1f, 1f, 1f);
	final int BULLET_SIZE = 5;
	final double BULLET_DEFAULT_DAMAGE = 0.1;
	final double BULLET_FRICTION = 0.99;

	final int MOB_SPAWN_TIME = 2000;
	final double MOB_DEFAULT_DAMAGE = 0.01;

	final int MOB_TRIANGLE_MIN_SIZE = 25;
	final int MOB_TRIANGLE_MAX_SIZE = 30;
	final int MOB_TRIANGLE_SIZE_THRESHOLD = 10;

	final int MOB_SQUARE_MIN_SIZE = 30;
	final int MOB_SQUARE_MAX_SIZE = 35;
	final int MOB_SQUARE_SIZE_THRESHOLD = 15;

	final int MOB_HEXAGON_MIN_SIZE = 30;
	final int MOB_HEXAGON_MAX_SIZE = 35;
	final int MOB_HEXAGON_SIZE_THRESHOLD = 15;

	final int COLLISION_PARTICLE_TOTAL = 3;
	final int HEXAGON_PARTICLE_SIZE = 3;
	final int CIRCLE_PARTICLE_SIZE = 3;
	final int TRIANGLE_PARTICLE_SIZE = 3;
	final int SQUARE_PARTICLE_SIZE = 3;
	final double PARTICLE_FRICTION = 0.98;

	// ACTIONS
	final String ACTION_REGISTER = "register";
	final String ACTION_GET_GAME_STATE = "getGameState";
	final String ACTION_FIRE = "fire";
	final String ACTION_SET_KEY = "setKey";
	final String ACTION_UNSET_KEY = "unsetKey";
	final String ACTION_TEST = "test";
}
