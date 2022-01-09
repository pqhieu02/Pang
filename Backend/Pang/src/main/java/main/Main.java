package main;

import java.time.Duration;
import java.time.LocalDateTime;

public class Main {

	public static void main(String[] args) throws InterruptedException {
//		Date time = LocalDateTime.now();
		LocalDateTime time = LocalDateTime.now();
		LocalDateTime time1 = LocalDateTime.now();
		Duration duration = Duration.between(time, time1);
		long a = duration.toSeconds();
		System.out.println(a);
		System.out.println(duration);
	}

}
