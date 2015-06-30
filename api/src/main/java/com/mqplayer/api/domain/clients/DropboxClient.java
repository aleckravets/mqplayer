package com.mqplayer.api.domain.clients;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Map;
import com.mqplayer.api.exceptions.*;

/**
 * @author akravets
 */
public class DropboxClient extends Client {
    private final String URL = "https://api.dropbox.com/1/account/info";

    @Override
    public String getEmailByToken(String token) throws IOException {
        String requestUrl = URL + "?access_token=" + token;

        URL url = new URL(requestUrl);
        HttpURLConnection connection = (HttpURLConnection)url.openConnection();
        connection.setRequestMethod("GET");
        connection.connect();

        int responseCode = connection.getResponseCode();

        if (responseCode == 401) {
            throw new AuthenticationException();
        }

        String responseText = readStream(connection.getInputStream());

        ObjectMapper objectMapper = new ObjectMapper();

        Map<String, Object> userInfo = objectMapper.readValue(responseText, Map.class);

        if (!userInfo.containsKey("email")) {
            throw new RuntimeException("Failed to get email from Dropbox");
        }

        return (String)userInfo.get("email");
    }

    private String readStream(InputStream stream) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(stream));
        String inputLine;
        StringBuffer response = new StringBuffer();
        while ((inputLine = in.readLine()) != null) {
            response.append(inputLine);
        }
        in.close();
        return response.toString();
    }
}
