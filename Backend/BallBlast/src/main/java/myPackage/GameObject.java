package myPackage;

import java.awt.Color;

public abstract class GameObject implements Constant {
	private double x;
	private double y;
	private double size;
	private double maxSize;
	private ColorObject color;
	private double damage;
	private double hp;
	private Velocity velocity;
	private boolean existence;
	private String type;
	private boolean isExplosive;
	private boolean isBouncing;
	private double angleDegree;
	private boolean isClockwise;

	GameObject(double x, double y, double size, double maxSize, double damage, String type, ColorObject color,
			boolean isExplosive, boolean isBouncing) {
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
		this.isExplosive = isExplosive;
		this.isBouncing = isBouncing;
		this.angleDegree = 0;
		this.isClockwise = true;
	}

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

	public void setColorObject(ColorObject color) {
		this.color = color;
	}

	public ColorObject getColorObject() {
		return color;
	}

	public Color getColor() {
		return color.getColor();
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

	public boolean isExplosive() {
		return isExplosive;
	}

	public void setExplosive(boolean isExplosive) {
		this.isExplosive = isExplosive;
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

	public void update() {
		x += velocity.getX();
		y += velocity.getY();
		x = Math.max(size, Math.min(x, WORLD_WIDTH - size));
		y = Math.max(size, Math.min(y, WORLD_HEIGHT - size));
		hp = hp > 0 ? Math.min(1, hp + 0.1f / 60) : hp;
	}

	public JsonForm getData() {
		JsonForm data = new JsonForm(x, y, size, color, type, angleDegree, hp);
		return data;
	}

	public abstract void handleCollision(GameObject target);
}
