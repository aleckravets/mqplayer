package com.mqplayer.web.app.db;

import com.mqplayer.web.app.domain.Account;
import com.mqplayer.web.app.domain.Playlist;
import com.mqplayer.web.app.domain.User;
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
        return query("select * from playlist where userId = ?", new Object[]{userId}, Playlist.class);
    }

    public User getUserByToken(String service, String token) {
        return queryForObject(
                "select u.* from user u join account a on u.id = a.userId where a.service = ? and a.token = ?",
                new Object[]{service, token},
                User.class
        );
    }

    public boolean updateToken(String email, String token) {
        return 0 < jdbcTemplate.update(
                "update account set token = ? where email = ?",
                new Object[] {email, token});
    }

    public User addUser(User user) {
        Long userId = this.<Long>insert("insert user null", "id", new Object[]{});
        user.setId(userId);
        return user;
    }

    public void mergeUsers(User targetUser, User sourceUser) {
        // re-assign sourceUser's accounts
        jdbcTemplate.update(
                "update account set uesrId = ? where userId = ?",
                targetUser.getId(),
                sourceUser.getId());

        // delete sourceUser
        jdbcTemplate.update(
                "delete user where id = ?",
                sourceUser.getId()
        );
    }

    public void addAccount(Account account) {
        jdbcTemplate.update(
                "insert account (service, email, token, userId) values (?, ?, ?, ?)",
                new Object[] {account.getService(), account.getEmail(), account.getToken(), account.getUserId()}
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

    private <T extends Number> T insert(final String sql, final String pk, final Object[] args) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        final ArgumentPreparedStatementSetter argsSetter = new ArgumentPreparedStatementSetter(args);

        jdbcTemplate.update(
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
