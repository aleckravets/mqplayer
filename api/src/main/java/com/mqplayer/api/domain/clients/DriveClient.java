package com.mqplayer.api.domain.clients;

import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.json.GoogleJsonResponseException;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.model.About;
import com.mqplayer.api.exceptions.*;

import java.io.IOException;

/**
 * @author akravets
 *
 */
public class DriveClient extends Client{
    protected static final HttpTransport TRANSPORT = new NetHttpTransport();
    protected static final JsonFactory JSON_FACTORY = new JacksonFactory();

    public String getEmailByToken(String token) throws IOException {
        GoogleCredential credential =
                new GoogleCredential.Builder()
                .build()
                .setAccessToken(token);

        Drive drive = new Drive.Builder(TRANSPORT, JSON_FACTORY, credential).build();

        String email;

        try {
            About about = drive.about().get().execute();
            email = about.getUser().getEmailAddress();
        }
        catch(GoogleJsonResponseException exception){
            if (exception.getStatusCode() == 401) {
                // log ?
                throw new AuthenticationException();
            }

            throw exception;
        }

        return email;
    }
}
