package com.mqplayer.api.db;

import com.mqplayer.api.db.mappers.AccountRowMapper;
import com.mqplayer.api.domain.Account;
import com.mqplayer.api.domain.Playlist;
import com.mqplayer.api.domain.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.support.DataAccessUtils;
import org.springframework.jdbc.core.*;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

/**
 * @author akravets
 */
public class Db extends JdbcTemplate {
    public <T> List<T> query(String sql, Class<T> clazz, Object... args) {
        return query(sql, args, new BeanPropertyRowMapper<T>(clazz));
    }

    public <T> T queryForObject(String sql, Class<T> clazz, Object... args) {
        return queryForObject(sql, new BeanPropertyRowMapper<T>(clazz), args);
    }

    public <T> T queryForObject(String sql, RowMapper<T> rowMapper, Object... args) {
        List<T> results = query(sql, args, new RowMapperResultSetExtractor<T>(rowMapper, 1));
        return DataAccessUtils.singleResult(results);
    }

    public <T extends Number> T insert(final String sql, final String pk, final Object... args) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        final ArgumentPreparedStatementSetter argsSetter = new ArgumentPreparedStatementSetter(args);

        update(
                new PreparedStatementCreator() {
                    public PreparedStatement createPreparedStatement(Connection connection) throws SQLException {
                        PreparedStatement ps = connection.prepareStatement(sql, new String[] {pk});
                        argsSetter.setValues(ps);
                        return ps;
                    }
                },
                keyHolder);

        return (T)keyHolder.getKey();
    }
}
