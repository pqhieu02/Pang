package collection;

public class Bullet extends GameObject {
	private Player gunner;

	public Bullet(double x, double y, double destinationX, double destinationY, double size, Color color,
			Player gunner) {
		super(x, y, size, size, BULLET_DEFAULT_DAMAGE, TYPE_CIRCLE, color, false, false);
		getVelocity().setVelocity(x, y, destinationX, destinationY, SPEED.get(SPEED_TARGET_BULLET));
		this.gunner = gunner;
	}

	public void handleCollision(GameObject target) {
		markToBeRemoved();
	}

	public void update() {
		double x = getPositionX();
		double y = getPositionY();
		double size = getSize();
		double velocityX = getVelocity().getX() * BULLET_FRICTION;
		double velocityY = getVelocity().getY() * BULLET_FRICTION;

		if (x - size <= 0 || x + size >= WORLD_WIDTH)
			velocityX *= -1;

		if (y - size <= 0 || y + size >= WORLD_HEIGHT)
			velocityY *= -1;

		if (Math.abs(velocityX) < 1 && Math.abs(velocityY) < 1)
			markToBeRemoved();

		getVelocity().setX(velocityX);
		getVelocity().setY(velocityY);

		super.update();
	}

	public Player getGunner() {
		return gunner;
	}
}
