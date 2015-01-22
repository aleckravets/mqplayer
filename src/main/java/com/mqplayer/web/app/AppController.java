package com.mqplayer.web.app;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
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

    @Autowired
    private AuthManager authManager;

    @RequestMapping("/playlists")
    public List<Playlist> getPlaylists() {
        int accountId = 1;

        return db.getPlaylists(accountId);
    }

    @RequestMapping("/about")
    public Object about(@RequestParam String token) throws IOException {
        return authManager.checkToken(token);
    }
}
