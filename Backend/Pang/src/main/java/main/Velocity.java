package main;

import math.MyMath;

public class Velocity {
	private double x = 0;
	private double y = 0;

	public void setVelocity(double a, double b, double c, double d, double factor) {
		double[] v = MyMath.getVelocity(a, b, c, d, factor);
		setX(v[0]);
		setY(v[1]);
	}

	public void setRandomVelocity(double x, double y, double range, double factor) {
		double[] v = MyMath.getRandomVelocity(x, y, range, factor);
		setX(v[0]);
		setY(v[1]);
	}

	public void setX(double x) {
		this.x = x;
	}

	public void setY(double y) {
		this.y = y;
	}

	public double getX() {
		return x;
	}

	public double getY() {
		return y;
	}
}
