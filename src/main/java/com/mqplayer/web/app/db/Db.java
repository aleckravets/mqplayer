package com.mqplayer.web.app.db;

import com.mqplayer.web.app.domain.Playlist;
import com.mqplayer.web.app.domain.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.support.DataAccessUtils;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.RowMapperResultSetExtractor;
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

    public List<Playlist> getPlaylists(long userId) {
        return query("select * from playlist where userId = ?", new Object[] {userId}, Playlist.class);
    }

    public User getUserByToken(String service, String token) {
        return queryForObject(
                "select u.* from user u join account a on u.id = a.userId where a.service = ? and a.token = ?",
                new Object[]{service, token},
                User.class
        );
    }

    private <T> List<T> query(String sql, Object[] args, Class<T> clazz) {
        return jdbcTemplate.query(sql, args, new BeanPropertyRowMapper<T>(clazz));
    }

    private <T> T queryForObject(String sql, Object[] args, Class<T> clazz) {
        return queryForObject(sql, args, new BeanPropertyRowMapper<T>(clazz));
    }

    private <T> T queryForObject(String sql, Object[] args, RowMapper<T> rowMapper) {
        List<T> results = jdbcTemplate.query(sql, args, new RowMapperResultSetExtractor<T>(rowMapper, 1));
        return DataAccessUtils.singleResult(results);
    }
}
