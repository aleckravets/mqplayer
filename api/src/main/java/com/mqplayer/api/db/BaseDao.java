package com.mqplayer.api.db;

import com.mqplayer.api.db.annotations.Ignore;
import org.springframework.util.StringUtils;

import java.lang.reflect.Field;
import java.util.HashSet;
import java.util.Set;

public class BaseDao {

    protected Set<String> getColumns(Class<?> clazz, String tableName, String aliasPrefix) {
        HashSet<String> columns = new HashSet<String>();
        Field[] fields = clazz.getDeclaredFields();
        for (Field field : fields) {
            if (field.getAnnotation(Ignore.class) != null) {
                continue;
            }
            StringBuilder result = new StringBuilder();
            if (tableName != null) {
                result.append(tableName).append(".");
            }
            String name = underscoreName(field.getName());
            result.append(name);
            if (aliasPrefix != null) {
                result.append(" as ").append(aliasPrefix).append("_").append(name);
            }
            columns.add(result.toString());
        }
        return columns;
    }

    /**
     * (copied from org.springframework.jdbc.core.BeanPropertyRowMapper)
     * Convert a name in camelCase to an underscored name in lower case.
     * Any upper case letters are converted to lower case with a preceding underscore.
     * @param name the string containing original name
     * @return the converted name
     */
    private String underscoreName(String name) {
        if (!StringUtils.hasLength(name)) {
            return "";
        }
        StringBuilder result = new StringBuilder();
        result.append(name.substring(0, 1).toLowerCase());
        for (int i = 1; i < name.length(); i++) {
            String s = name.substring(i, i + 1);
            String slc = s.toLowerCase();
            if (!s.equals(slc)) {
                result.append("_").append(slc);
            }
            else {
                result.append(s);
            }
        }
        return result.toString();
    }

}


