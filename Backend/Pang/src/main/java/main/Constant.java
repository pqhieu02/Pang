package main;

import java.util.HashMap;

import collection.Color;
import collection.MobTypeDatamine;

@SuppressWarnings("serial")
public interface Constant {
	final String SPEED_TARGET_MOB = "MOB";
	final String SPEED_TARGET_BULLET = "BULLET";
	final String SPEED_TARGET_PARTICLE = "PARTICLE";
	final HashMap<String, Double> SPEED = new HashMap<>() {
		{
			put(SPEED_TARGET_MOB, 0.3d);
			put(SPEED_TARGET_BULLET, 10d);
			put(SPEED_TARGET_PARTICLE, 10d);
		}
	};

	final String TYPE_HEXAGON = "HEXAGON";
	final String TYPE_SQUARE = "SQUARE";
	final String TYPE_TRIANGLE = "TRIANGLE";
	final String TYPE_CIRCLE = "CIRCLE";
	final String[] MOB_TYPE = { TYPE_HEXAGON, TYPE_SQUARE, TYPE_TRIANGLE };
	final HashMap<String, MobTypeDatamine> OBJECT_TYPE_DATAMINE = new HashMap<>() {
		{
			put(TYPE_HEXAGON, new MobTypeDatamine(MOB_HEXAGON_MIN_SIZE, MOB_HEXAGON_MAX_SIZE,
					MOB_HEXAGON_SIZE_THRESHOLD, HEXAGON_PARTICLE_SIZE));

			put(TYPE_SQUARE, new MobTypeDatamine(MOB_SQUARE_MIN_SIZE, MOB_SQUARE_MAX_SIZE, MOB_SQUARE_SIZE_THRESHOLD,
					SQUARE_PARTICLE_SIZE));

			put(TYPE_TRIANGLE, new MobTypeDatamine(MOB_TRIANGLE_MIN_SIZE, MOB_TRIANGLE_MAX_SIZE,
					MOB_TRIANGLE_SIZE_THRESHOLD, TRIANGLE_PARTICLE_SIZE));

			put(TYPE_CIRCLE, new MobTypeDatamine(PLAYER_SIZE, PLAYER_SIZE, 0, CIRCLE_PARTICLE_SIZE));
		}
	};

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
	final Color PLAYER_COLOR = new Color(1f, 1f, 1f);
	final double PLAYER_SIZE = 30;
	final int PLAYER_STEP = 5;
	final double PLAYER_DEFAULT_MAX_HP = 100;
	final int PLAYER_CIRLCE_SIZE_THRESHOLD = 5;
	final double PLAYER_GROW_SPEED = (double) PLAYER_SIZE / (double) 120;
	final int FIRE_RATE = 1000;
	final double PLAYER_DEFAULT_DAMAGE = 0.1;

	final Color BULLET_COLOR = new Color(1f, 1f, 1f);
	final int BULLET_SIZE = 5;
	final double BULLET_DEFAULT_DAMAGE = 0.1;
	final double BULLET_FRICTION = 0.99;

	final int MOB_SPAWN_TIME = 2000;
	final double MOB_DEFAULT_DAMAGE = 0.05;

	final int MOB_TRIANGLE_MIN_SIZE = 30;
	final int MOB_TRIANGLE_MAX_SIZE = 35;
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
