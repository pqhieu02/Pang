package collection;

public class MobTypeDatamine {
	public final double maxSize;
	public final double minSize;
	public final double thresholdSize;
	public final double particleSize;

	public MobTypeDatamine(double minSize, double maxSize, double thresholdSize, double particleSize) {
		this.minSize = minSize;
		this.maxSize = maxSize;
		this.thresholdSize = thresholdSize;
		this.particleSize = particleSize;
	}
}
