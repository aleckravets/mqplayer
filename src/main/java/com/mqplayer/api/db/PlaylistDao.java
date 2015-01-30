package com.mqplayer.api.db;

import com.mqplayer.api.domain.entities.Playlist;
import com.mqplayer.api.domain.entities.Record;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author akravets
 */
@Repository
public class PlaylistDao {
    @Autowired
    private Db db;

    public List<Playlist> getAll(long userId) {
        return db.query("select * from playlist where userId = ?", Playlist.class, userId);
    }

    public Playlist getOne(long id) {
        return db.queryForObject("select * from playlist where id = ?", Playlist.class, id);
    }

    public List<Record> getRecords(long playlistId) {
        return db.query("select * from record where playlistId = ?", Record.class, playlistId);
    }

    public Playlist addPlaylist(Playlist playlist) {
        Long id =
                db.<Long>insert(
                        "insert playlist (name, userId) values (?, ?)",
                        "id",
                        playlist.getName(), playlist.getUserId()
                );

        playlist.setId(id);

        return playlist;
    }

    public Record addRecord(Playlist playlist, Record record) {
        Long id =
                db.<Long>insert(
                        "insert record (name, url, playlistId) values (?, ?, ?)",
                        "id",
                        record.getName(), record.getUrl(), playlist.getId()
                );

        record.setId(id);

        return record;
    }
}
