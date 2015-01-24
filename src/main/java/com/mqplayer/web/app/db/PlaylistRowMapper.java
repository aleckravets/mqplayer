package com.mqplayer.web.app.db;

import com.mqplayer.web.app.domain.Playlist;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * @author akravets
 */
public class PlaylistRowMapper implements RowMapper<Playlist> {
    @Override
    public Playlist mapRow(ResultSet rs, int rowNum) throws SQLException {
        Playlist playlist = new Playlist();

        playlist.setId(rs.getLong("id"));
        playlist.setName(rs.getString("name"));
        playlist.setAccountId(rs.getLong("accountId"));

        return playlist;
    }
}
