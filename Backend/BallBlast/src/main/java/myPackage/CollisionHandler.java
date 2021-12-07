package myPackage;

import collection_package.Bullet;
import collection_package.ColorObject;
import collection_package.GameObject;
import collection_package.Player;

public class CollisionHandler implements Constant {
	public void run(World world, GameObject first, GameObject second) {
		if (first instanceof Bullet && second instanceof Player) {
			Bullet bullet = (Bullet) first;
			Player player = (Player) second;
			if (bullet.getGunner() == player)
				return;
		}
		if (second instanceof Bullet && first instanceof Player) {
			Bullet bullet = (Bullet) second;
			Player player = (Player) first;
			if (bullet.getGunner() == player)
				return;
		}

		if (first.isExplosible()) {
			double firstX = first.getPositionX();
			double firstY = first.getPositionY();
			ColorObject firstColor = first.getColorObject();
			String type = first.getType();
			world.addParticles(firstX, firstY, firstColor, type, COLLISION_PARTICLE_TOTAL);
		}

		if (second.isExplosible()) {
			double secondX = second.getPositionX();
			double secondY = second.getPositionY();
			ColorObject secondColor = second.getColorObject();
			String type = second.getType();
			world.addParticles(secondX, secondY, secondColor, type, COLLISION_PARTICLE_TOTAL);
		}
		if (first.isBouncing() && second.isBouncing())
			GameObject.bounce(first, second);
		first.handleCollision(second);
		second.handleCollision(first);
	}
}
