package com.mqplayer.api.domain.services;

import com.mqplayer.api.db.PlaylistDao;
import com.mqplayer.api.domain.dto.CreatePlaylistDto;
import com.mqplayer.api.domain.dto.PlaylistDto;
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
    public Playlist create(User user, CreatePlaylistDto playlistDto) {
        Playlist playlist = new Playlist(playlistDto.getName(), user.getId());
        playlistDao.create(playlist);

        for (CreatePlaylistDto.RecordDto recordDto: playlistDto.getRecords()) {
            Record record = new Record(recordDto.getAccountId(), recordDto.getId(), recordDto.getName(), recordDto.getUrl(), playlist.getId());
            playlistDao.createRecord(record);
        }
        return playlist;
    }

    @Transactional
    public void deleteOne(long id) {
        playlistDao.deleteOne(id);
    }

    @Transactional
    public void deleteMany(List<Long> ids) {
        playlistDao.deleteMany(ids);
    }

    public void update(Long id, PlaylistDto dto) {
        playlistDao.update(id, dto.getName());
    }
}
