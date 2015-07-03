package com.mqplayer.api.db;

import com.mqplayer.api.db.mappers.AccountRowMapper;
import com.mqplayer.api.domain.entities.Account;
import com.mqplayer.api.domain.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

/**
 * @author akravets
 */
@Repository
public class SecurityDao {
    @Autowired
    private Db db;

    public User getUserByToken(String service, String token) {
        return db.queryForEntity(
                "select u.* from user u join account a on u.id = a.userId where a.service = ? and a.token = ?",
                User.class,
                service, token
        );
    }

    public Account getAccountByToken(String service, String token) {
        return db.queryForEntity(
                "select * from account where service = ? and token = ?",
                new AccountRowMapper(),
                service, token
        );
    }

    public Account getAccountByEmail(String service, String email) {
        return db.queryForEntity(
                "select * from account where service = ? and email = ?",
                new AccountRowMapper(),
                service, email
        );
    }

    public boolean updateToken(Account account, String token) {
        return 0 < db.getJdbcOperations().update(
                "update account set token = ? where service = ? and email = ?",
                token, account.getService(), account.getEmail()
        );
    }

    public User addUser(User user) {
        Long userId = db.<Long>insert("insert user select null", "id");
        user.setId(userId);
        return user;
    }

    public void mergeUsers(User targetUser, User sourceUser) {
        // re-assign sourceUser's accounts
        db.getJdbcOperations().update(
                "update account set userId = ? where userId = ?",
                targetUser.getId(),
                sourceUser.getId());

        // transfer playlists
        db.getJdbcOperations().update(
                "update playlist set userId = ? where userId = ?",
                targetUser.getId(),
                sourceUser.getId());

        // delete sourceUser
        db.getJdbcOperations().update(
                "delete from user where id = ?",
                sourceUser.getId()
        );
    }

    public Account addAccount(Account account) {
        Long id =
                db.<Long>insert(
                        "insert account (service, email, token, userId) values (?, ?, ?, ?)",
                        "id",
                        account.getService(), account.getEmail(), account.getToken(), account.getUser().getId()
                );

        account.setId(id);

        return account;
    }
}
