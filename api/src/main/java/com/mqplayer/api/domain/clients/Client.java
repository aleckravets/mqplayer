package com.mqplayer.api.domain.clients;


import com.mqplayer.api.exceptions.AppException;

import java.io.IOException;

/**
 * @author akravets
 */
public abstract class Client {
    public abstract String getEmailByToken(String token) throws IOException;
    private static final String driveAppName = "mqplayer";

    public static Client resolve(String service) {
        switch (service) {
            case "drive":
                return new DriveClient(driveAppName);
            case "dropbox":
                return new DropboxClient();
            default:
                throw new AppException(String.format("Unknown service (%s)", service));
        }
    }
}
