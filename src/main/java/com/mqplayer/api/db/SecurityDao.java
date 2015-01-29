package com.mqplayer.api.db;

import com.mqplayer.api.db.mappers.AccountRowMapper;
import com.mqplayer.api.entities.Account;
import com.mqplayer.api.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

/**
 * @author akravets
 */
@Repository
public class SecurityDao {
    @Autowired
    private Db db;

    public User getUserByToken(String service, String token) {
        return db.queryForObject(
                "select u.* from user u join account a on u.id = a.userId where a.service = ? and a.token = ?",
                User.class,
                service, token
        );
    }

    public Account getAccountByToken(String service, String token) {
        return db.queryForObject(
                "select * from account where service = ? and token = ?",
                new AccountRowMapper(),
                service, token
        );
    }

    public Account getAccountByEmail(String service, String email) {
        return db.queryForObject(
                "select * from account where service = ? and email = ?",
                new AccountRowMapper(),
                service, email
        );
    }

    public boolean updateToken(Account account, String token) {
        return 0 < db.update(
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
        db.update(
                "update account set userId = ? where userId = ?",
                targetUser.getId(),
                sourceUser.getId());

        // delete sourceUser
        db.update(
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

    public boolean isPlaylistOwner(long userId, long playlistId) {
        return false;
//        return 0 < db.queryForObject(
//                "update account set token = ? where service = ? and email = ?",
//                token, account.getService(), account.getEmail()
//        );
    }
}
