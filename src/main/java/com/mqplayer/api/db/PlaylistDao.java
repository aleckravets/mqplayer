package com.mqplayer.api.db;

import com.mqplayer.api.domain.entities.Playlist;
import com.mqplayer.api.domain.entities.Record;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
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
        return db.queryForEntity("select * from playlist where id = ?", Playlist.class, id);
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

    public void addRecord(Playlist playlist, Record record) {
        db.getJdbcOperations().update(
            "insert record (service, id, name, url, playlistId) values (?, ?, ?, ?, ?)",
            record.getService(), record.getId(), record.getName(), record.getUrl(), playlist.getId()
        );
    }

    public void deleteOne(long id) {
        db.getJdbcOperations().update(
                "delete from record where playlistId = ?",
                id
        );

        db.getJdbcOperations().update(
                "delete from playlist where id = ?",
                id
        );
    }

    public void deleteMany(List<Long> ids) {
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("ids", ids);

        db.update(
                "delete from record where playlistId in (:ids)",
                parameters

        );

        db.update(
                "delete from playlist where id in (:ids)",
                parameters
        );
    }
}
