package collection_package;

public class Particle extends GameObject {
	Particle(double x, double y, double size, ColorObject color, String type) {
		super(x, y, size, size, 0, type, color, false, false);
		getVelocity().setX((Math.random() - 0.5) * SPEED.get(SPEED_TARGET_PARTICLE));
		getVelocity().setY((Math.random() - 0.5) * SPEED.get(SPEED_TARGET_PARTICLE));
	}

	public void handleCollision(GameObject target) {
		// Do nothing
	}

	public void update() {
		double x = getPositionX();
		double y = getPositionY();
		double size = getSize();
		double velocityX = getVelocity().getX();
		double velocityY = getVelocity().getY();
		boolean isClockwise = isClockwise();
		double angle = getAngleDegree();

		if (Math.abs(velocityX) < 0.25 && Math.abs(velocityY) < 0.25)
			markToBeRemoved();

		velocityX *= PARTICLE_FRICTION;
		velocityY *= PARTICLE_FRICTION;

		if (velocityX > 0)
			isClockwise = true;
		else
			isClockwise = false;

		angle = isClockwise ? angle + ANGLE_ROTATE_SPEED : angle - ANGLE_ROTATE_SPEED;

		if (x - size <= 0 || x + size >= WORLD_WIDTH)
			velocityX *= -1;

		if (y - size <= 0 || y + size >= WORLD_HEIGHT)
			velocityY *= -1;

		getVelocity().setX(velocityX);
		getVelocity().setY(velocityY);
		setClockwise(isClockwise);
		setAngleDegree(angle);
		super.update();
	}

}
