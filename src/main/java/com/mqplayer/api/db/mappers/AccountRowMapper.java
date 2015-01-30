package com.mqplayer.api.db.mappers;

import com.mqplayer.api.domain.entities.Account;
import com.mqplayer.api.domain.entities.User;
import org.springframework.jdbc.core.BeanPropertyRowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * @author akravets
 */
public class AccountRowMapper extends BeanPropertyRowMapper<Account> {

    public AccountRowMapper() {
        super(Account.class);
    }

    @Override
    public Account mapRow(ResultSet rs, int rowNum) throws SQLException {
        Account account = super.mapRow(rs, rowNum);
        User user = new User();
        user.setId(rs.getLong("userId"));
        account.setUser(user);
        return account;
    }
}
