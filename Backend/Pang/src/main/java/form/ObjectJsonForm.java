package form;

import collection.Color;

@SuppressWarnings("unused")
public class ObjectJsonForm {
	private String name;
	private double x;
	private double y;
	private double size;
	private Color color;
	private String type;
	private double angle;
	private double hp;

	public ObjectJsonForm(double x, double y, double size, Color color, String type, double angle, double hp) {
		this.setName(null);
		this.setX(x);
		this.setY(y);
		this.setSize(size);
		this.setColor(color);
		this.setType(type);
		this.setAngle(angle);
		this.setHp(hp);
	}

	public ObjectJsonForm(String name, double x, double y, double size, Color color, String type, double angle,
			double hp) {
		this.setName(name);
		this.setX(x);
		this.setY(y);
		this.setSize(size);
		this.setColor(color);
		this.setType(type);
		this.setAngle(angle);
		this.setHp(hp);
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public void setX(double x) {
		this.x = x;
	}

	public void setY(double y) {
		this.y = y;
	}

	public void setSize(double size) {
		this.size = size;
	}

	public void setColor(Color color) {
		this.color = color;
	}

	public void setType(String type) {
		this.type = type;
	}

	public void setAngle(double angle) {
		this.angle = angle;
	}

	public void setHp(double hp) {
		this.hp = hp;
	}
}