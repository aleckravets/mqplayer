package com.mqplayer.web.app.clients;

import com.mqplayer.web.app.domain.AppException;

import java.io.IOException;

/**
 * @author akravets
 */
public abstract class Client {
    public abstract String getEmailByToken(String token) throws IOException;

    public static Client resolve(String service) {
        switch (service) {
            case "drive":
                return new DriveClient();
            case "dropbox":
                return new DropboxClient();
            default:
                throw new AppException(String.format("Unknown service (%s)", service));
        }
    }
}
