import { YOUR_PAPER_SERVER_URL, JAX2REST_SERVER_URL } from '_constants';
import MemberApi from "api/member-api.js";
import { WokSearchClient } from "api/wos-api.js";

import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { InputAdornment, CircularProgress, Icon } from "@material-ui/core";
// @material-ui/icons
import People from "@material-ui/icons/People";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import CustomDropdown from "components/CustomDropdown/CustomDropdown.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import Badge from "components/Badge/Badge.js";

import typoStyles from "assets/jss/material-kit-react/components/typographyStyle.js";
import styles from "assets/jss/material-kit-react/views/loginPage.js";

const useStyles = makeStyles(styles);
const useTypoStyles = makeStyles(typoStyles);

export default function RegFormCard(props) {
    const classes = useStyles();
    const typoClasses = useTypoStyles();

    const [memberApi, ] = React.useState(new MemberApi(YOUR_PAPER_SERVER_URL));
    const register = (memberDto) => {
        memberDto['organizationList'] = [memberDto.organization];
        memberApi.register(
            memberDto.username, memberDto.password,
            memberDto.name, memberDto.authorNameList, [memberDto.organization]
        ).then(res => {
            console.log(res);
            alert('성공적으로 등록하였습니다. 이어서 논문을 추가합니다.');
            memberApi.searchByAuthorsAndAdd(
                memberDto.username, memberDto.password,
                memberDto.name, memberDto.authorNameList, [memberDto.organization]
            ).then(res => {
                alert('주어진 정보로 논문을 추가하였습니다.')
            }).catch(err => {
                console.log(err);
                alert('주어진 정보로 논문을 추가하지 못했습니다.')
            });
            window.location.href = '/';
        }).catch(err => {
            console.error(err);
            alert('알 수 없는 이유로 회원가입에 실패했습니다.');
        });
    };

    const [memberDto, setMemberDto] = React.useState({
        username: '',
        password: '',
        
        name: '',
        organization: 'Sejong Univ',
        authorNameList: [],
    });
    const [available, setAvailable] = React.useState(false);
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const updateMemberField = (field, value) => {
        if (!new Set(Object.keys(memberDto)).has(field)) return alert('존재하지 않은 필드입니다.');
        if (field === 'username') setAvailable(false);
        memberDto[field] = value;
        setMemberDto({...memberDto});
        return memberDto;
    }
    const availableCheck = (username) => {
        if(username.length < 5) return alert('아이디는 5자 이상이어야합니다.');

        memberApi.availableCheck(username).then(res => {
            console.log(res);
            
            if (res) alert('사용 가능합니다.')
            else alert('중복된 아이디입니다.')

            setAvailable(res);
        }).catch(err => {
            alert('중복확인 중 오류가 발생했습니다.')
            console.log(err);
        });
    }

    const [loading, setLoading] = React.useState(false);
    const Loading = loading? <CircularProgress/>: '';
    const [searchClient, ] = React.useState(new WokSearchClient(JAX2REST_SERVER_URL));
    const [searchResultHTML, setSearchResultHTML] = React.useState('');
    const searchByAuthors = () => {
        setLoading(true);
        searchClient.setPageSize(0);

        const userQuery = authors.join(' OR ');
        const query = searchClient.buildUserQuery('AU', userQuery, [memberDto.organization]);
        console.log(query);
        
        searchClient.search(query, null, null, '5year', true)
            .then(res => {
                const recordsFound = res.recordsFound;
                const recordsSearched = res.recordsSearched;

                setSearchResultHTML(<h4>
                    입력된 영문명들로 검색된 최근 5년 중 논문 수는<br/>
                    <span className={typoClasses.primaryText}>{recordsSearched}</span>개 중 {` `}
                    <span className={typoClasses.primaryText}>{recordsFound}</span>개 입니다.<br/>
                    최대 50개까지 자동 등록됩니다.
                </h4>);
                updateMemberField('authorNameList', authors);
                setLoading(false);
            }).catch(err => {
                alert('검색 중 에러가 발생했습니다.');
                console.error(err);
                setLoading(false);
            });
    };

    const [authors, setAuthors] = React.useState([]);
    const [authorInput, setAuthorInput] = React.useState('');
    const addAuthor = author => {
        if (!author)                return alert('공백은 추가할 수 없습니다.');
        if (author.length < 3)      return alert('저자 명은 3자 이상이어야 합니다.');

        authors.push(author);
        searchByAuthors();
        setAuthors([...authors]);
    };
    const deleteAuthor = idx => {
        authors.splice(idx, 1);
        searchByAuthors();
        setAuthors([...authors]);
    }

    const [cardAnimaton, ] = React.useState("");

    return ( 
        <Card className={classes[cardAnimaton]}>
            <CardHeader color="primary" className={classes.cardHeader}>
            <h4>REGISTER</h4>
            </CardHeader>
            <CardBody>
                <GridContainer>
                    <GridItem xs={12}><h3>필수 정보</h3></GridItem>
                    {/* 아이디 & 중복확인 */}
                    <GridItem xs={9}>
                        <CustomInput
                            value={memberDto.username}
                            onChange={e => {updateMemberField('username', e.target.value)}}
                            labelText="Username"
                            id="regUsername"
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                type: "text",
                                endAdornment: (
                                <InputAdornment position="end">
                                    <People className={classes.inputIconsColor} />
                                </InputAdornment>
                                )
                            }}
                        />
                    </GridItem>
                    <GridItem xs={3} style={{ textAlign: 'center', paddingTop: '15px' }}>
                        <Button color={ (available)? 'white' : 'primary' } onClick={() => availableCheck(memberDto.username)}>중복확인</Button>
                    </GridItem>
                    {/* 아이디 & 중복확인 끝 */}

                    {/* 비밀번호 & 비밀번호 확인 */}
                    <GridItem xs={12}>
                        <CustomInput
                            value={memberDto.password}
                            onChange={e => {updateMemberField('password', e.target.value)}}
                            labelText="Password"
                            id="legPassword"
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                type: "password",
                                endAdornment: (
                                <InputAdornment position="end">
                                    <Icon className={classes.inputIconsColor}>
                                    lock_outline
                                    </Icon>
                                </InputAdornment>
                                ),
                                autoComplete: "off"
                            }}
                        />
                    </GridItem>
                    <GridItem xs={12}>
                        <CustomInput
                            value={confirmPassword}
                            onChange={e => {setConfirmPassword(e.target.value)}}
                            labelText="confirm"
                            id="confirmPassword"
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                type: "password",
                                endAdornment: (
                                <InputAdornment position="end">
                                    <Icon className={classes.inputIconsColor}>
                                    lock_outline
                                    </Icon>
                                </InputAdornment>
                                ),
                                autoComplete: "off"
                            }}
                        />
                    </GridItem>
                    <GridItem xs={12}>
                        {(memberDto.password && confirmPassword && confirmPassword === memberDto.password)? 
                            <font color='green'>비밀번호가 일치합니다.</font> : <font color='red'>비밀번호가 일치하지 않습니다.</font>}
                    </GridItem>
                    {/* 비밀번호 & 비밀번호 확인 끝 */}

                    {/* 추가 정보 시작 */}
                    {/* 이름 */}
                    <GridItem xs={9}>
                        <CustomInput
                            value={memberDto.name}
                            onChange={e => {updateMemberField('name', e.target.value)}}
                            labelText="Name"
                            id="regName"
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                type: "text",
                            }}
                        />
                    </GridItem>
                    <GridItem xs={3} style={{ textAlign: 'center', paddingTop: '15px'}}>
                        <CustomDropdown
                            noLiPadding
                            buttonText={memberDto.organization || 'Other'}
                            buttonProps={{
                                color: "transparent",
                            }}
                            dropdownList={[
                                <div onClick={() => {updateMemberField('organization', 'Sejong Univ')}}>Sejong Univ</div>,
                                {divider: true},
                                <div onClick={() => {updateMemberField('organization', '')}}>Other</div>,
                            ]}
                        />
                    </GridItem>

                    <GridItem xs={12}><h3>추가 정보</h3></GridItem>
                    {/* 논문 상 영문 명 */}
                    <GridItem xs={9}>
                        <CustomInput
                            value={authorInput}
                            onChange={e => {setAuthorInput(e.target.value)}}
                            labelText="논문 상 영문명 추가"
                            id="regAuthor"
                            formControlProps={{
                                fullWidth: true
                            }}
                        />
                    </GridItem>
                    <GridItem xs={3} style={{ textAlign: 'center', paddingTop: '15px' }}>
                        {(loading)? 
                            Loading:
                            <Button onClick={() => addAuthor(authorInput)} color="primary">
                                이름추가
                            </Button>}
                    </GridItem>
                    <GridItem xs={12}>
                        {authors.map((a, idx) => 
                        <span key={idx} onClick={() => (window.confirm('삭제할까요?'))? deleteAuthor(idx): ''}>
                            <Badge
                                color='primary'
                                children={<>{a} x</>}
                            />
                        </span>)}
                    </GridItem>
                    <GridItem xs={12}>
                        {(loading)? '':searchResultHTML}
                    </GridItem>
                </GridContainer>
            </CardBody>
            <CardFooter className={classes.cardFooter}>
                <Button onClick={() => { window.location.href = '/' }} simple color="primary" size="lg">
                    돌아가기
                </Button>
                <Button onClick={() => { register(memberDto); }} simple color="danger" size="lg">
                    등록하기
                </Button>
            </CardFooter>
        </Card>
    );
}