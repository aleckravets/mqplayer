package com.mqplayer.api.db;

import com.mqplayer.api.db.mappers.AccountMapper;
import com.mqplayer.api.domain.entities.Account;
import com.mqplayer.api.domain.entities.User;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public class SecurityDao extends BaseDao {
    @Autowired
    private Db db;

    public User getUserByToken(String service, String token) {
        return db.queryForEntity(
                "select u.* from user u join account a on u.id = a.user_id where a.service = ? and a.token = ?",
                User.class,
                service, token
        );
    }

    public Account getAccountByToken(String service, String token) {
        Set<String> columns = getColumns(Account.class, "a", "account");
        columns.addAll(getColumns(User.class, "u", "user"));

        return db.queryForEntity(
                "select " + StringUtils.join(columns, ", ") +
                " from account a" +
                " join user u on u.id = a.user_id" +
                " where a.service = ? and a.token = ?",
                new AccountMapper(),
                service, token
        );
    }

    public Account getAccountByEmail(String service, String email) {
        Set<String> columns = getColumns(Account.class, "a", "account");
        columns.addAll(getColumns(User.class, "u", "user"));

        return db.queryForEntity(
                "select " + StringUtils.join(columns, ", ") +
                " from account a " +
                " join user u on u.id = a.user_id" +
                " where a.service = ? and a.email = ?",
                new AccountMapper(),
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
                "update account set user_id = ? where user_id = ?",
                targetUser.getId(),
                sourceUser.getId());

        // transfer playlists
        db.getJdbcOperations().update(
                "update playlist set user_id = ? where user_id = ?",
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
                        "insert account (service, email, token, user_id) values (?, ?, ?, ?)",
                        "id",
                        account.getService(), account.getEmail(), account.getToken(), account.getUserId()
                );

        account.setId(id);

        return account;
    }
}
