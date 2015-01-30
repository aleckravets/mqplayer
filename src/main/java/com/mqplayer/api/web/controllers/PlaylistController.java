package com.mqplayer.api.web.controllers;

import com.mqplayer.api.utils.ObjectMapper;
import com.mqplayer.api.domain.dto.AddPlaylistDto;
import com.mqplayer.api.domain.entities.Playlist;
import com.mqplayer.api.domain.entities.Record;
import com.mqplayer.api.domain.entities.User;
import com.mqplayer.api.security.SecurityContext;
import com.mqplayer.api.security.SecurityManager;
import com.mqplayer.api.domain.services.PlaylistService;
import com.mqplayer.api.web.models.PlaylistModel;
import com.mqplayer.api.web.models.RecordModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

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
    private ObjectMapper objectMapper;

    @Autowired
    private PlaylistService playlistService;

    @RequestMapping(method = RequestMethod.GET)
    public List<PlaylistModel> getPlaylists() {
        User user = securityContext.getUser();
        List<Playlist> playlists = playlistService.getAll(user.getId());
        return objectMapper.map(playlists, PlaylistModel.class);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public PlaylistModel getPlaylist(@PathVariable long id) {
        Playlist playlist = playlistService.getOne(id);
        securityManager.authorize(playlist);
        return objectMapper.map(playlist, PlaylistModel.class);
    }

    @RequestMapping(method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.OK)
    public void addPlaylist(@RequestBody AddPlaylistDto dto) {
        playlistService.addPlaylist(securityContext.getUser(), dto);
    }

    @RequestMapping(value = "/{id}/records", method = RequestMethod.GET)
    public List<RecordModel> getPlaylistRecords(@PathVariable long id) {
        Playlist playlist = playlistService.getOne(id);
        securityManager.authorize(playlist);
        List<Record> records = playlistService.getRecords(id);
        return objectMapper.map(records, RecordModel.class);
    }
}
