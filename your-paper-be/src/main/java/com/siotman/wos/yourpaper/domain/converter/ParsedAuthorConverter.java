package com.siotman.wos.yourpaper.domain.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.siotman.wos.yourpaper.domain.json.ParsedAuthorJson;

import javax.persistence.AttributeConverter;
import java.io.IOException;

public class ParsedAuthorConverter implements AttributeConverter<ParsedAuthorJson, String> {
    private ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(ParsedAuthorJson parsedAuthorJsons) {
        if (parsedAuthorJsons == null) return "";

        String json = null;

        try {
            json = objectMapper.writeValueAsString(parsedAuthorJsons);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        return json;
    }

    @Override
    public ParsedAuthorJson convertToEntityAttribute(String json) {
        if (json == null) return null;

        ParsedAuthorJson parsedAuthorJson = null;
        try {
            parsedAuthorJson = objectMapper.readValue(json, ParsedAuthorJson.class);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return parsedAuthorJson;
    }
}
