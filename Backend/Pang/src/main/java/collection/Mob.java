package collection;

import main.Velocity;

public class Mob extends GameObject {
	private double thresholdSize;
	private boolean isSpawning;

	public Mob(double x, double y, double startSize, double maxSize, double sizeThreshold, Color color, String type) {
		super(x, y, startSize, maxSize, MOB_DEFAULT_DAMAGE, type, color, true, true);
		this.thresholdSize = sizeThreshold;
		isSpawning = true;
		// move outside
		getVelocity().setRandomVelocity(x, y, startSize, SPEED.get(SPEED_TARGET_MOB));
	}

	static public String randomMobType() {
		String type = MOB_TYPE[(int) (Math.random() * MOB_TYPE.length)];
		return type;
	}

	public void handleCollision(GameObject target) {
		if (target instanceof Mob)
			return;
		double hp = getHp();
		double damage = target.getDamage();

		if (hp <= 0)
			return;

		hp = Math.max(0, hp - damage);

		setHp(hp);
	}

	public void update() {
		Velocity velocity = getVelocity();
		double x = getPositionX();
		double y = getPositionY();
		double size = getSize();
		double maxSize = getMaxSize();
		double angle = getAngleDegree();
		boolean isClockwise = isClockwise();
		double hp = getHp();

		if (hp <= 0) {
			markToBeRemoved();
			return;
		}

		if (isSpawning) {
			hp = Math.max(hp + 0.1, 1);
			isSpawning = hp >= 1 ? false : isSpawning;

		}
		size = thresholdSize + (maxSize - thresholdSize) * hp;

		if (x - size <= 0 || x + size >= WORLD_WIDTH)
			velocity.setX(velocity.getX() * -1);

		if (y - size <= 0 || y + size >= WORLD_HEIGHT)
			velocity.setY(velocity.getY() * -1);

		if (velocity.getX() > 0)
			isClockwise = true;
		else
			isClockwise = false;

		angle = isClockwise ? angle + ANGLE_ROTATE_SPEED : angle - ANGLE_ROTATE_SPEED;

		setSize(size);
		setVelocity(velocity);
		setAngleDegree(angle);
		setClockwise(isClockwise);
		setHp(hp);
		super.update();
	}
}
