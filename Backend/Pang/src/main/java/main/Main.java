package main;

class Parent {
	public int x;

	Parent(int x) {
		this.x = x;
	}

	void show() {
		System.out.println("Parent.Show");
	}

	void eat() {
		System.out.println("Parent.Eat");
	}
}

class Child extends Parent {
	public int y;

	Child(int x, int y) {
		super(x);
		this.y = y;
	}

	Child(int x) {
		super(x);
	}

	void show() {
		System.out.println("Child.Show");
	}

	void sing() {
		System.out.println("Child.Sing");
	}
}

public class Main {
	public static void main(String[] args) {
		Parent p = new Child(1);
		Child c = (Child) p;
		c.eat();
	}
}
