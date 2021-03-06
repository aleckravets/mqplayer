package com.mqplayer.api.domain.dto;

import java.util.List;

/**
 * @author akravets
 */
public class CreatePlaylistDto {
    private String name;
    private List<RecordDto> records;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<RecordDto> getRecords() {
        return records;
    }

    public void setRecords(List<RecordDto> records) {
        this.records = records;
    }

    public static class RecordDto {
        private String id;
        private String name;
        private String url;
        private Long accountId;
        private Integer order;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }

        public Integer getOrder() {
            return order;
        }

        public void setOrder(Integer order) {
            this.order = order;
        }

        public Long getAccountId() {
            return accountId;
        }

        public void setAccountId(Long accountId) {
            this.accountId = accountId;
        }
    }
}
