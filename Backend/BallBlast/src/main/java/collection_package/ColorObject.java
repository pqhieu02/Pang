package myPackage;

import java.awt.Color;

public class ColorObject {
	private float h;
	private float s;
	private float l;

	ColorObject(float h, float s, float l) {
		this.h = h;
		this.s = s;
		this.l = l;
	}

	public Color getColor() {
		Color color = Color.getHSBColor(h, s, l);
		return color;
	}

}
