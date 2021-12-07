package mathPackage;

public class myMath {
	public static double getMag(double a, double b, double c, double d) {
		double X = c - a;
		double Y = d - b;
		double mag = Math.sqrt(X * X + Y * Y) + 1e-5;
		return mag;
	}

	public static double[] getVelocity(double a, double b, double c, double d, double factor) {
		double mag = getMag(a, b, c, d);
		double x = ((c - a) / mag) * factor;
		double y = ((d - b) / mag) * factor;
		return new double[] { x, y };
	}

	public static double[] getRandomVelocity(double x, double y, double range, double factor) {
		double theta = Math.random() * 2 * Math.PI;
		double distance = Math.random() * range;
		double X = x + distance * Math.cos(theta);
		double Y = y + distance * Math.sin(theta);
		return getVelocity(x, y, X, Y, factor);
	}

	public static double random(double min, double max) {
		double number = Math.random() * (max - min) + min;
		return number;
	}
}
