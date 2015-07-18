package com.mqplayer.api.db;

import com.mqplayer.api.db.mappers.RecordMapper;
import com.mqplayer.api.domain.entities.Account;
import com.mqplayer.api.domain.entities.Playlist;
import com.mqplayer.api.domain.entities.Record;
import com.mqplayer.api.domain.entities.User;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public class PlaylistDao extends BaseDao {
    @Autowired
    private Db db;

    public List<Playlist> getAll(long userId) {
        return db.query("select * from playlist where user_id = ?", Playlist.class, userId);
    }

    public Playlist getOne(long id) {
        return db.queryForEntity("select * from playlist where id = ?", Playlist.class, id);
    }

    public List<Record> getRecords(long playlistId) {
        Set<String> columns = getColumns(Record.class, "r", "record");
        columns.addAll(getColumns(Account.class, "a", "account"));
        columns.addAll(getColumns(User.class, "u", "user"));

        return db.query("select " + StringUtils.join(columns, ", ") +
                        " from record r " +
                        " join account a on r.account_id = a.id" +
                        " join user u on u.id = a.user_id" +
                        " where r.playlist_id = ?",
                new RecordMapper(), playlistId);
    }

    public Playlist create(Playlist playlist) {
        Long id =
                db.<Long>insert(
                        "insert playlist (name, user_id) values (?, ?)",
                        "id",
                        playlist.getName(), playlist.getUserId()
                );

        playlist.setId(id);

        return playlist;
    }

    public void createRecord(Record record) {
        db.getJdbcOperations().update(
                "insert record (account_id, id, name, url, playlist_id) values (?, ?, ?, ?, ?)",
                record.getAccountId(), record.getId(), record.getName(), record.getUrl(), record.getPlaylistId()
        );
    }

    public void deleteOne(long id) {
        db.getJdbcOperations().update(
                "delete from record where playlist_id = ?",
                id
        );

        db.getJdbcOperations().update(
                "delete from playlist where id = ?",
                id
        );
    }

    public void deleteMany(List<Long> ids) {
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("ids", ids);

        db.update(
                "delete from record where playlist_id in (:ids)",
                parameters

        );

        db.update(
                "delete from playlist where id in (:ids)",
                parameters
        );
    }

    public void update(long id, String name) {
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("id", id);
        parameters.addValue("name", name);

        db.update("update playlist set name = :name where id = :id", parameters);
    }
}
