package collection;

import form.JsonForm;
import main.Constant;
import main.Velocity;

public abstract class GameObject implements Constant {
	private double x;
	private double y;
	private double size;
	private double maxSize;
	private Color color;
	private double damage;
	private double hp;
	private Velocity velocity;
	private boolean existence;
	private String type;
	private boolean isExplosible;
	private boolean isBouncing;
	private double angleDegree;
	private boolean isClockwise;

	GameObject(double x, double y, double size, double maxSize, double damage, String type, Color color,
			boolean isExplosible, boolean isBouncing) {
		this.x = x;
		this.y = y;
		this.size = size;
		this.maxSize = maxSize;
		this.damage = damage;
		this.type = type;
		this.color = color;
		this.existence = true;
		this.velocity = new Velocity();
		this.hp = size / maxSize;
		this.isExplosible = isExplosible;
		this.isBouncing = isBouncing;
		this.angleDegree = 0;
		this.isClockwise = true;
	}

	static public void bounce(GameObject a, GameObject b) {
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

	public void update() {
		x += velocity.getX();
		y += velocity.getY();
		x = Math.max(size, Math.min(x, WORLD_WIDTH - size));
		y = Math.max(size, Math.min(y, WORLD_HEIGHT - size));
		hp = hp > 0 ? Math.min(1, hp + 0.1f / 60) : hp;
	}

	// should be renamed
	public JsonForm getData() {
		JsonForm data = new JsonForm(x, y, size, color, type, angleDegree, hp);
		return data;
	}

	public abstract void handleCollision(GameObject target);

	public void setPositionX(double x) {
		this.x = x;
	}

	public void setPositionY(double y) {
		this.y = y;
	}

	public double getPositionX() {
		return x;
	}

	public double getPositionY() {
		return y;
	}

	public void setColor(Color color) {
		this.color = color;
	}

	public Color getColor() {
		return color;
	}

	public double getDamage() {
		return damage;
	}

	public void setDamage(double damage) {
		this.damage = damage;
	}

	public void setSize(double size) {
		this.size = size;
	}

	public double getSize() {
		return size;
	}

	public double getHp() {
		return hp;
	}

	public void setHp(double hp) {
		this.hp = hp;
	}

	public double getMaxSize() {
		return maxSize;
	}

	public void setMaxSize(double maxHp) {
		this.maxSize = maxHp;
	}

	public void setVelocity(Velocity v) {
		velocity = v;
	}

	public Velocity getVelocity() {
		return velocity;
	}

	public boolean isExisting() {
		return existence;
	}

	public void markToBeRemoved() {
		existence = false;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getType() {
		return type;
	}

	public boolean isExplosible() {
		return isExplosible;
	}

	public void setExplosive(boolean isExplosive) {
		this.isExplosible = isExplosive;
	}

	public boolean isBouncing() {
		return isBouncing;
	}

	public void setBouncing(boolean isBouncing) {
		this.isBouncing = isBouncing;
	}

	public double getAngleDegree() {
		return angleDegree;
	}

	public void setAngleDegree(double angleDegree) {
		this.angleDegree = angleDegree % 360;
	}

	public boolean isClockwise() {
		return isClockwise;
	}

	public void setClockwise(boolean isClockwise) {
		this.isClockwise = isClockwise;
	}
}
