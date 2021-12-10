package form_package;

import collection_package.ColorObject;

@SuppressWarnings("unused")
public class JsonForm {
	private double x;
	private double y;
	private double size;
	private ColorObject color;
	private String type;
	private double angle;
	private double hp;

	public JsonForm(double x, double y, double size, ColorObject color, String type, double angle, double hp) {
		this.x = x;
		this.y = y;
		this.size = size;
		this.color = color;
		this.type = type;
		this.angle = angle;
		this.hp = hp;
	}
}