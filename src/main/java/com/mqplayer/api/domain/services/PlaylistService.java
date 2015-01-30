package com.mqplayer.api.domain.services;

import com.mqplayer.api.db.PlaylistDao;
import com.mqplayer.api.domain.dto.AddPlaylistDto;
import com.mqplayer.api.domain.entities.Playlist;
import com.mqplayer.api.domain.entities.Record;
import com.mqplayer.api.domain.entities.User;
import com.mqplayer.api.exceptions.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    public Playlist getOne(long id) {
        Playlist playlist = playlistDao.getOne(id);

        if (playlist == null) {
            throw new NotFoundException();
        }

        return playlist;
    }

    public List<Record> getRecords(long playlistId) {
        return playlistDao.getRecords(playlistId);
    }

    @Transactional
    public void addPlaylist(User user, AddPlaylistDto playlistDto) {
        Playlist playlist = new Playlist(playlistDto.getName(), user.getId());
        playlistDao.addPlaylist(playlist);

        for (AddPlaylistDto.RecordDto recordDto: playlistDto.getRecords()) {
            Record record = new Record(recordDto.getName(), recordDto.getUrl(), playlist.getId());
            playlistDao.addRecord(playlist, record);
        }
    }
}
