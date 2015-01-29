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
@Repository
public class Db {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Playlist> getPlaylists(long userId) {
        return query("select * from playlist where userId = ?", new Object[]{userId}, Playlist.class);
    }

    public User getUserByToken(String service, String token) {
        return queryForObject(
                "select u.* from user u join account a on u.id = a.userId where a.service = ? and a.token = ?",
                User.class,
                service, token
        );
    }

    public Account getAccountByToken(String service, String token) {
        return this.queryForObject(
                "select * from account where service = ? and token = ?",
                new AccountRowMapper(),
                service, token
        );
    }

    public Account getAccountByEmail(String service, String email) {
        return this.queryForObject(
                "select * from account where service = ? and email = ?",
                new AccountRowMapper(),
                service, email
        );
    }

    public boolean updateToken(Account account, String token) {
        return 0 < jdbcTemplate.update(
                "update account set token = ? where service = ? and email = ?",
                token, account.getService(), account.getEmail()
        );
    }

    public User addUser(User user) {
        Long userId = this.<Long>insert("insert user select null", "id");
        user.setId(userId);
        return user;
    }

    public void mergeUsers(User targetUser, User sourceUser) {
        // re-assign sourceUser's accounts
        jdbcTemplate.update(
                "update account set userId = ? where userId = ?",
                targetUser.getId(),
                sourceUser.getId());

        // delete sourceUser
        jdbcTemplate.update(
                "delete from user where id = ?",
                sourceUser.getId()
        );
    }

    public Account addAccount(Account account) {
        Long id =
                this.<Long>insert(
                    "insert account (service, email, token, userId) values (?, ?, ?, ?)",
                    "id",
                    account.getService(), account.getEmail(), account.getToken(), account.getUser().getId()
                );

        account.setId(id);

        return account;
    }

    private <T> List<T> query(String sql, Object[] args, Class<T> clazz) {
        return jdbcTemplate.query(sql, args, new BeanPropertyRowMapper<T>(clazz));
    }

    private <T> T queryForObject(String sql, Class<T> clazz, Object... args) {
        return queryForObject(sql, new BeanPropertyRowMapper<T>(clazz), args);
    }

    private <T> T queryForObject(String sql, RowMapper<T> rowMapper, Object... args ) {
        List<T> results = jdbcTemplate.query(sql, args, new RowMapperResultSetExtractor<T>(rowMapper, 1));
        return DataAccessUtils.singleResult(results);
    }

    private <T extends Number> T insert(final String sql, final String pk, final Object... args) {
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
