package collection_package;

import myPackage.Constant;
import myPackage.Velocity;

public class Mob extends GameObject implements Constant {
	private double expectSize;
	private double sizeThreshold;

	Mob(double x, double y, double startSize, double maxSize, double sizeThreshold, ColorObject color, String type) {
		super(x, y, startSize, maxSize, MOB_DEFAULT_DAMAGE, type, color, true, true);
		this.expectSize = maxSize;
		this.sizeThreshold = sizeThreshold;
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
		double maxSize = getMaxSize();
		double damage = target.getDamage();

		if (hp <= 0)
			return;

		hp = Math.max(0, hp - damage);
		expectSize = hp > 0 ? (maxSize - sizeThreshold) * hp + sizeThreshold : 0;
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

		if (size <= 0) {
			markToBeRemoved();
			return;
		}

		if (expectSize < size) {
			size = Math.max(size - SHRINK_SPEED, 0);
		}
		if (expectSize > size) {
			size += GROW_SPEED;
		}

		if (x - size <= 0 || x + size >= WORLD_WIDTH)
			velocity.setX(velocity.getX() * -1);

		if (y - size <= 0 || y + size >= WORLD_HEIGHT)
			velocity.setY(velocity.getY() * -1);

		if (velocity.getX() > 0)
			isClockwise = true;
		else
			isClockwise = false;

		angle = isClockwise ? angle + ANGLE_ROTATE_SPEED : angle - ANGLE_ROTATE_SPEED;
		hp = Math.max(0, (size - sizeThreshold)) / (maxSize - sizeThreshold);

		setSize(size);
		setVelocity(velocity);
		setAngleDegree(angle);
		setClockwise(isClockwise);
		setHp(hp);
		super.update();
	}
}
