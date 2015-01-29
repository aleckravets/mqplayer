package com.mqplayer.api.db;

import com.mqplayer.api.domain.Playlist;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author akravets
 */
@Service
public class PlaylistDao {
    @Autowired
    private Db db;

    public List<Playlist> getAll(long userId) {
        return db.query("select * from playlist where userId = ?", Playlist.class, userId);
    }

    public Playlist getOne(long id) {
        return db.queryForObject("select * from playlist where id = ?", Playlist.class, id);
    }
}
