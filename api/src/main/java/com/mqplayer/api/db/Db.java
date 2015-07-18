package com.mqplayer.api.db;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.support.DataAccessUtils;
import org.springframework.jdbc.core.*;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

/**
 * @author akravets
 */
@Component
public class Db extends NamedParameterJdbcTemplate {
    @Autowired
    public Db(DataSource dataSource) {
        super(dataSource);
    }

    public <T> List<T> query(String sql, Class<T> clazz, Object... args) {
        return getJdbcOperations().query(sql, args, new BeanPropertyRowMapper<T>(clazz));
    }

    public <T> List<T> query(String sql, RowMapper<T> rowMapper, Object... args) {
        return getJdbcOperations().query(sql, args, rowMapper);
    }

    public <T> T queryForEntity(String sql, Class<T> clazz, Object... args) {
        return queryForEntity(sql, new BeanPropertyRowMapper<T>(clazz), args);
    }

    public <T> T queryForEntity(String sql, RowMapper<T> rowMapper, Object... args) {
        List<T> results = getJdbcOperations().query(sql, args, new RowMapperResultSetExtractor<T>(rowMapper, 1));
        return DataAccessUtils.singleResult(results);
    }

    public <T extends Number> T insert(final String sql, final String pk, final Object... args) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        final ArgumentPreparedStatementSetter argsSetter = new ArgumentPreparedStatementSetter(args);

        getJdbcOperations().update(
                new PreparedStatementCreator() {
                    public PreparedStatement createPreparedStatement(Connection connection) throws SQLException {
                        PreparedStatement ps = connection.prepareStatement(sql, new String[]{pk});
                        argsSetter.setValues(ps);
                        return ps;
                    }
                },
                keyHolder);

        return (T)keyHolder.getKey();
    }
}
