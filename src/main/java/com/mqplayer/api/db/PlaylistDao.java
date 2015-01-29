package com.mqplayer.api.db;

import com.mqplayer.api.entities.Playlist;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

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

    public Playlist getOne(long id, long userId) {
        return db.queryForObject("select * from playlist where id = ? && userId = ?", Playlist.class, id, userId);
    }
}
