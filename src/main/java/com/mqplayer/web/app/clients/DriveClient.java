package com.mqplayer.web.app.clients;

import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.json.GoogleJsonResponseException;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.model.About;
import org.springframework.stereotype.Service;

import java.io.IOException;

/**
 * @author akravets
 *
 */
public class DriveClient implements Client{
    protected static final HttpTransport TRANSPORT = new NetHttpTransport();
    protected static final JsonFactory JSON_FACTORY = new JacksonFactory();

    public String getEmailByToken(String token) {
        GoogleCredential credential =
                new GoogleCredential.Builder()
                .build()
                .setAccessToken(token);

        Drive drive = new Drive.Builder(TRANSPORT, JSON_FACTORY, credential).build();

        String email = null;

        try {
            About about = drive.about().get().execute();
            email = about.getUser().getEmailAddress();
        }
        catch(IOException exception){
            if (exception instanceof GoogleJsonResponseException && ((GoogleJsonResponseException) exception).getStatusCode() == 401) {
                // unauthorized
            }
            else {
                throw new RuntimeException(exception);
            }
        }

        return email;
    }
}
