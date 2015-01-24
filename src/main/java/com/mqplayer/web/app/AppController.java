package com.mqplayer.web.app;

import com.mqplayer.web.app.clients.DriveClient;
import com.mqplayer.web.app.db.Db;
import com.mqplayer.web.app.domain.Playlist;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

/**
 * @author akravets
 */
@RestController
public class AppController {
    @Autowired
    private Db db;

    @RequestMapping("/playlists")
    public List<Playlist> getPlaylists() {
        // get authenticated user's id
        int userId = 1;

        return db.getPlaylists(userId);
    }

    @RequestMapping("/about")
    public Object about(@RequestParam String token) {
        return "in app";
//        DriveClient client = new DriveClient();
//        return client.getEmailByToken(token);
    }
}
