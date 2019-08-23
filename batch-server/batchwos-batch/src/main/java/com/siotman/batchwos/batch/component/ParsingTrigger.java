package com.siotman.batchwos.batch.component;

import com.siotman.batchwos.batch.domain.jpa.Paper;
import org.codehaus.jettison.json.JSONObject;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class ParsingTrigger {
    /* SourceType,UID$,targetURL$,SID$,EXTRA*/

    private final Map<String, String> MSG_FORMAT
            = new HashMap<String, String>() {{
                put("sourceType",   "");
                put("UID",          "");
                put("targetURL",    "");
                put("extra",        "");
    }};

    private final Map<String, String> FLOW_MSG_FORMAT
            = new HashMap<String, String>() {{
        put("type",   "FLOW");
        put("from",   "");
        put("to",     "");
        put("UID",    "");
    }};


    @Autowired private RabbitTemplate rabbitTemplate;
    public enum TYPE {
        ADD_PARSE_DETAIL    (new HashMap<String, String>() {{
            put("sourceType", "DETAIL_LINK");
            put("exchange", "create");
            put("routingKey", "target.create.record");
        }}),

        UPDATE_PARSE_DETAIL (new HashMap<String, String>() {{
            put("sourceType", "DETAIL_LINK");
            put("exchange", "update");
            put("routingKey", "target.update.record");
        }});

        private Map<String, String> format;

        TYPE(Map<String, String> format) {
            this.format = format;
        }
    }

    public void startOne(TYPE type, Paper paper, String extra) {
        MSG_FORMAT.put("sourceType",    type.format.get("sourceType"));
        MSG_FORMAT.put("UID",           paper.getUid());
        MSG_FORMAT.put("targetURL",     paper.getSourceUrls().getSourceURL());
        MSG_FORMAT.put("extra",         extra);

        String json = new JSONObject(MSG_FORMAT).toString();

        rabbitTemplate.convertAndSend(
                type.format.get("exchange"),
                type.format.get("routingKey"),
                json
        );

        sendFlow(paper.getUid());
    }

    public void sendFlow(String UID) {
        FLOW_MSG_FORMAT.put("from",  "batchServer");
        FLOW_MSG_FORMAT.put("to",    "broker");
        FLOW_MSG_FORMAT.put("UID",   UID);
        FLOW_MSG_FORMAT.put("state", "WAITING");

        String json = new JSONObject(FLOW_MSG_FORMAT).toString();

        rabbitTemplate.convertAndSend(
                "any",
                "flow.server",
                json
        );
    }
}
