package com.mqplayer.web.app.db;

import com.mqplayer.web.app.domain.Playlist;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.util.List;

/**
 * @author akravets
 */
@Repository
public class Db {
    @Autowired
    private DataSource dataSource;

    private JdbcTemplate jdbcTemplate;

    @Autowired
    public void setDataSource(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    public List<Playlist> getPlaylists(int userId) {
        return jdbcTemplate.query(
                "select * from playlist where userId = ?",
                new Object[] {userId},
                new PlaylistRowMapper());
    }
}
