package com.mqplayer.api.controllers;

import com.mqplayer.api.db.PlaylistDao;
import com.mqplayer.api.entities.Playlist;
import com.mqplayer.api.entities.Record;
import com.mqplayer.api.entities.User;
import com.mqplayer.api.models.PlaylistEditModel;
import com.mqplayer.api.security.SecurityContext;
import com.mqplayer.api.security.SecurityManager;
import com.mqplayer.api.services.PlaylistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

/**
 * @author akravets
 */
@RestController
@RequestMapping("/playlists")
public class PlaylistController {
    @Autowired
    private SecurityManager securityManager;

    @Autowired
    private SecurityContext securityContext;

    @Autowired
    private PlaylistService playlistService;

    @RequestMapping(method = RequestMethod.GET)
    public List<Playlist> getPlaylists() {
        User user = securityContext.getUser();
        return playlistService.getAll(user.getId());
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public Playlist getPlaylist(@PathVariable long id) {
        Playlist playlist = playlistService.getOne(id);
        securityManager.authorize(playlist);
        return playlist;
    }

    @RequestMapping(method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.OK)
    public void addPlaylist(@RequestBody PlaylistEditModel playlistEditModel) {
    }

    @RequestMapping(value = "/{id}/records", method = RequestMethod.GET)
    public List<Record> getPlaylistRecords(@PathVariable long id) {
        Playlist playlist = playlistService.getOne(id);
        securityManager.authorize(playlist);
        return playlistService.getRecords(id);
    }
}
