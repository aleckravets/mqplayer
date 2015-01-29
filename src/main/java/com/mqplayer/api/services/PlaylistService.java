package com.mqplayer.api.services;

import com.mqplayer.api.db.PlaylistDao;
import com.mqplayer.api.entities.Playlist;
import com.mqplayer.api.exceptions.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author akravets
 */
@Service
public class PlaylistService {
    @Autowired
    private PlaylistDao playlistDao;

    public List<Playlist> getAll(long userId) {
        return playlistDao.getAll(userId);
    }

    public Playlist getOne(long id, long userId) {
        Playlist playlist = playlistDao.getOne(id, userId);

        if (playlist == null) {
            throw new NotFoundException();
        }

        return playlist;
    }
}
