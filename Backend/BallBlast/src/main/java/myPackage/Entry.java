package myPackage;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;

import com.google.gson.Gson;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class Entry extends HttpServlet implements Constant {
	private static final long serialVersionUID = 1L;
	private World world = new World();;

//	public Entry() {
//		super();
//	}

	public String requestHandler(ClientRequestDataForm data) {
		switch (data.action) {
		case ACTION_TEST:
			System.out.println(data.playerId);
			System.out.println(world.getPlayer(data.playerId));
			System.out.println("Done");
			return data.playerId;
		case ACTION_REGISTER: {
			double width = data.screenWidth;
			double height = data.screenHeight;
			String playerId = world.addPlayer(width, height);

			return playerId;
		}
		case ACTION_GET_GAME_STATE: {
			String playerId = data.playerId;
			String gameState = world.getGameState(playerId);
			return gameState;
		}
		case ACTION_FIRE: {
			String playerId = data.playerId;
			double x = data.x;
			double y = data.y;
			world.addBullet(playerId, x, y);
			return "ok";
		}
		case ACTION_SET_KEY: {
			String playerId = data.playerId;
			Character key = data.key;

			world.getPlayer(playerId).setKey(key);
			return "ok";
		}
		case ACTION_UNSET_KEY: {
			String playerId = data.playerId;
			Character key = data.key;

			world.getPlayer(playerId).unsetKey(key);
			return "ok";
		}
		}
		return "";
	}

	public void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		PrintWriter printWriter = response.getWriter();
		response.addHeader("Access-Control-Allow-Origin", "*");
		response.setContentType("application/json");

		StringBuilder buffer = new StringBuilder();
		BufferedReader reader = request.getReader();
		String line;
		while ((line = reader.readLine()) != null) {
			buffer.append(line);
			buffer.append(System.lineSeparator());
		}
		String data = buffer.toString();
		Gson gson = new Gson();
		ClientRequestDataForm requestData = gson.fromJson(data, ClientRequestDataForm.class);

		String res = requestHandler(requestData);
		printWriter.println(res);
	}
}
