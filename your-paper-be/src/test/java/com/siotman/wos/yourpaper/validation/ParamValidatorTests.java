package com.siotman.wos.yourpaper.validation;

import com.siotman.wos.yourpaper.domain.dto.MemberDto;
import com.siotman.wos.yourpaper.domain.dto.UidDto;
import com.siotman.wos.yourpaper.domain.dto.UidsDto;
import com.siotman.wos.yourpaper.domain.validation.MemberDtoValidator;
import com.siotman.wos.yourpaper.domain.validation.UidsDtoValidator;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.autoconfigure.json.JsonTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;
import java.util.List;

@RunWith(SpringRunner.class)
@JsonTest
public class ParamValidatorTests {

    @Test
    public void 내_논문_추가하기_파라미터는_검증받아야한다() {
        List<UidDto> uids = new ArrayList<>();
        UidDto uidDto = new UidDto("uid1234", true);
        uids.add(uidDto);
        UidsDto uidsDto = new UidsDto("이강은", uids);
        UidsDtoValidator uidsDtoValidator = new UidsDtoValidator();
        System.out.println(uidsDtoValidator.validate("/add", uidsDto));
    }
}