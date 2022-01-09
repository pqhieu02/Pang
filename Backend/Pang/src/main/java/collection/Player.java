package collection;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.UUID;

import main.Velocity;

public class Player extends GameObject {
	protected class WASD {
		private boolean w = false;
		private boolean a = false;
		private boolean s = false;
		private boolean d = false;

		public void reset() {
			w = false;
			a = false;
			s = false;
			d = false;
		}

		public Boolean getW() {
			return w;
		}

		public void setW(Boolean w) {
			this.w = w;
		}

		public Boolean getA() {
			return a;
		}

		public void setA(Boolean a) {
			this.a = a;
		}

		public Boolean getS() {
			return s;
		}

		public void setS(Boolean s) {
			this.s = s;
		}

		public Boolean getD() {
			return d;
		}

		public void setD(Boolean d) {
			this.d = d;
		}
	}

	private String name;
	private double score;
	protected WASD controller = new WASD();
	private String id;
	private boolean isAlive;
	private LocalDateTime lastHeartBeat;

	private boolean isVulnerable;
	private double screenWidth;
	private double screenHeight;
	private double cameraTopX;
	private double cameraTopY;
	private double cameraBotX;
	private double cameraBotY;

	Player(double x, double y, double size, Color color, double screenWidth, double screenHeight) {
		super(x, y, size, size, PLAYER_DEFAULT_DAMAGE, TYPE_CIRCLE, color, true, false);
		id = UUID.randomUUID().toString();
		isVulnerable = true;
		isAlive = true;
		lastHeartBeat = LocalDateTime.now();
		setScreenWidth(screenWidth);
		setScreenHeight(screenHeight);
		updatePlayerCamera();
	}

	public void setKey(Character key) {
		switch (key) {
		case 'w':
			controller.setW(true);
			break;
		case 'a':
			controller.setA(true);
			break;
		case 's':
			controller.setS(true);
			break;
		case 'd':
			controller.setD(true);
			break;
		}
	}

	public void unsetKey(Character key) {
		switch (key) {
		case 'w':
			controller.setW(false);
			break;
		case 'a':
			controller.setA(false);
			break;
		case 's':
			controller.setS(false);
			break;
		case 'd':
			controller.setD(false);
			break;
		}
	}

	public void handleCollision(GameObject target) {
		if (isVulnerable || getHp() <= 0)
			return;

		double hp = getHp();
		double damage = target.getDamage();

		hp = Math.max(0, hp - damage);
		if (hp <= 0)
			kill();

		setHp(hp);
	}

	public void kill() {
		setSize(0);
		setHp(0);
		isAlive = false;
	}

	private void updatePlayerCamera() {
		double x = getPositionX();
		double y = getPositionY();
		double bonusBotX, bonusBotY, bonusTopX, bonusTopY;

		bonusTopX = x + screenWidth / 2 > WORLD_WIDTH ? WORLD_WIDTH - x - screenWidth / 2 : 0;
		bonusTopY = y + screenHeight / 2 > WORLD_HEIGHT ? WORLD_HEIGHT - y - screenHeight / 2 : 0;

		bonusBotX = x - screenWidth / 2 < 0 ? -x + screenWidth / 2 : 0;
		bonusBotY = y - screenHeight / 2 < 0 ? -y + screenHeight / 2 : 0;

		cameraTopX = Math.max(x - screenWidth / 2 + bonusTopX, 0);
		cameraTopY = Math.max(y - screenHeight / 2 + bonusTopY, 0);

		cameraBotX = Math.min(x + screenWidth / 2 + bonusBotX, WORLD_WIDTH);
		cameraBotY = Math.min(y + screenHeight / 2 + bonusBotY, WORLD_HEIGHT);
	}

	public void update() {
		Duration duration = Duration.between(lastHeartBeat, LocalDateTime.now());
		long timeBetween = duration.toSeconds();

		if (timeBetween >= 10) {
			kill();
		}

		Velocity velocity = getVelocity();

		int w = controller.getW() && isAlive ? -PLAYER_STEP : 0;
		int a = controller.getA() && isAlive ? -PLAYER_STEP : 0;
		int s = controller.getS() && isAlive ? PLAYER_STEP : 0;
		int d = controller.getD() && isAlive ? PLAYER_STEP : 0;

		velocity.setX(a + d);
		velocity.setY(w + s);

		isVulnerable = false;

		super.update();
		updatePlayerCamera();
	}

	public void updateHeartBeat(LocalDateTime time) {
		lastHeartBeat = time;
	}

	public String getId() {
		return id;
	}

	public boolean isAlive() {
		return isAlive;
	}

	public boolean isVulnerable() {
		return isVulnerable;
	}

	public void setVulnerable(boolean isVulnerable) {
		this.isVulnerable = isVulnerable;
	}

	public double getScreenWidth() {
		return screenWidth;
	}

	public void setScreenWidth(double screenWidth) {
		this.screenWidth = screenWidth;
	}

	public double getScreenHeight() {
		return screenHeight;
	}

	public void setScreenHeight(double screenHeight) {
		this.screenHeight = screenHeight;
	}

	public double getCameraTopX() {
		return cameraTopX;
	}

	public void setCameraTopX(double cameraTopX) {
		this.cameraTopX = cameraTopX;
	}

	public double getCameraTopY() {
		return cameraTopY;
	}

	public void setCameraTopY(double cameraTopY) {
		this.cameraTopY = cameraTopY;
	}

	public double getCameraBotX() {
		return cameraBotX;
	}

	public void setCameraBotX(double cameraBotX) {
		this.cameraBotX = cameraBotX;
	}

	public double getCameraBotY() {
		return cameraBotY;
	}

	public void setCameraBotY(double cameraBotY) {
		this.cameraBotY = cameraBotY;
	}

}
