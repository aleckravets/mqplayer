package com.mqplayer.web.app;

import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.drive.Drive;
import org.springframework.stereotype.Service;

import java.io.IOException;

/**
 * @author akravets
 *
 */
@Service
public class AuthManager {
    protected static final HttpTransport TRANSPORT = new NetHttpTransport();
    protected static final JsonFactory JSON_FACTORY = new JacksonFactory();

    public Object checkToken(String token) throws IOException {
        GoogleCredential credential =
                new GoogleCredential.Builder()
                .build()
                .setAccessToken(token);

        Drive drive = new Drive.Builder(TRANSPORT, JSON_FACTORY, credential).build();

        return drive.about().get().execute();
    }
}
