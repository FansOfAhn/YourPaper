package com.siotman.wos.domain.dto;

import com.siotman.wos.domain.jpa.Paper;
import com.siotman.wos.domain.jpa.RecordState;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TcDataDto {
    private String uid;
    private String recordState;
    private Map<String, Integer> tcData;

    public void updateEntityTcData(Paper old) {
        old.setRecordState(RecordState.valueOf(recordState));
        if (tcData.size() != 0) old.setTcData(tcData);
    }
}