import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";

import Paginations from "components/Pagination/Pagination.js";
import CustomDropdown from "components/CustomDropdown/CustomDropdown.js";
import Button from "components/CustomButtons/Button.js";

const useStyles = makeStyles(theme => ({
    root: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    paper: {
      marginTop: theme.spacing(3),
      width: '100%',
      overflowX: 'auto',
      marginBottom: theme.spacing(2),
    },
    table: {
      minWidth: 650,
    },
    cell: {
      maxWidth: 200,
      overflowX: 'scroll',
      whiteSpace: 'nowrap',
      direction: 'rtl',
    }
}));

const pagesTransform = (now, end) => {
    const formedPages = [];

    let amount = 5;
    let start = Math.floor(+(now - 1) / amount) * amount + 1;

    if (start !== 1) formedPages.push({ text: 'PREV' });
    for (let i = start; i <= end; i++) {
        if (start + amount === i) { formedPages.push({ text: 'NEXT' }); break; }

        if (i === now) formedPages.push({ active: true, text: i });
        else formedPages.push({ text: i });
    }
    return formedPages;
}

export default function TcDataTable(props) {
    const classes = useStyles();
    const {paperContainer, pageState, onPageClick, setPageSize, member} = props;
    const tcDataRecords = paperContainer.getRecords([8, 14]);
    const [citingHTML, setCitingHTML] = React.useState(<></>);
    
    if (!tcDataRecords || !tcDataRecords.length) {
        return <div><br/><h1>NO TC_DATA_RECORDS AVAILABLE</h1></div>
    }
    console.log(tcDataRecords);
    console.log(paperContainer.getRawResponse());
    
    var mS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const years = [];
    const rest = [];
    const now = new Date();
    for (let year = now.getFullYear(); year >= now.getFullYear() - 4; year--) {
        years.push(`${year}`);
    };
    const lastYear = now.getFullYear() - 5;
    const nowMonth = now.getMonth();
    // for (let mon = 11; mon >= nowMonth; mon--) {
    for (let mon = 11; mon >= 0; mon--) {
            rest.push(mS[mon]);
    }
    // const authors = ['Derrien, Morgane'];
    const authors = member.memberInfoDto.authorNameList;
    const authorRegex = / |'|-|,/g;
    const regexs = authors.map(a => {
        const target = a.replace(authorRegex, '');
        return new RegExp(target, 'i');
    });
    
    // const getSelfTcData = (idx) => {
    //     const citingPaperJsonList = paperContainer.getCitingPaperJsonList(idx);
    //     const selfTcData = {};
    //     for (let i = 0; i < citingPaperJsonList.length; i++) {
    //         const el = citingPaperJsonList[i];
    //         console.log(el);
    //         for (let j = 0; j < regexs.length; j++) {
    //             const rg = regexs[j];
    //             console.log(rg);
                
    //             if (rg.test(el.au.replace(authorRegex, ''))) {
    //                 if (!selfTcData[el.py]) selfTcData[el.py] = {total: 0};
    //                 selfTcData[el.py]['total'] += 1;
    //                 let mon = /[A-Za-z-]+/.exec(el.pd);
    //                 if (mon) {
    //                     if (selfTcData[el.py][mon]) {
    //                         selfTcData[el.py][mon] += 1;
    //                     } else {
    //                         selfTcData[el.py][mon] = 0;
    //                     }
    //                 }
    //                 break;
    //             }
    //         }
    //     }
        
    //     return selfTcData;
    // }
    
    const transformCiting = (idx, cite) => {
        return (<div className={classes.root} style={{ paddingTop: '24px' }}>
        <h3>{pageState.firstRecord + idx}번 논문을 인용 중인 논문 리스트 </h3>
        <a href={paperContainer.getCitingLink(idx)}>해당 정보 출처 바로가기</a>
        <Paper className={classes.paper}>
        <Table className={classes.table} size="small" aria-label="a dense table">
            <TableHead>
                <TableRow>
                    <TableCell className={classes.cell} align="right">제목</TableCell>
                    <TableCell className={classes.cell} align="right">발행년월</TableCell>
                    <TableCell className={classes.cell} align="right">저자</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                
                    {cite.map(c => {
                        return <TableRow>
                                <TableCell className={classes.cell} align="right">{c.ti}</TableCell>
                                <TableCell className={classes.cell} align="right">{c.pd}</TableCell>
                                <TableCell className={classes.cell} align="right">{c.au}</TableCell>
                            </TableRow>;
                    })}
                
            </TableBody>
        </Table>
        </Paper>
        </div>)
    }

    const onRowClick = (idx) => {
        const citings = paperContainer.getCitingPaperJsonList(idx);
        setCitingHTML(transformCiting(idx, citings))
    }
    const pagesElements = pagesTransform(pageState.currentPage, pageState.endPage);
    return (<>
        {citingHTML}
        <div className={classes.root} style={{ paddingBottom: '100px' }}>
            <GridContainer>
                <GridItem xs={12} sm={12} md={8} style={{ textAlign: 'left', paddingTop: '24px' }}>
                    <br/><h1>RECORDS FOUND : {pageState.recordsFound}</h1>
                </GridItem>
                <GridItem xs={12} sm={12} md={4} style={{ textAlign: 'right', paddingTop: '24px' }}>
                    <CustomDropdown
                        noLiPadding
                        buttonText={<h3>{pageState.pageSize}</h3>}
                        buttonProps={{
                            color: "transparent"
                        }}
                        dropdownList={[
                            <h3 onClick={(e) => {setPageSize(10)}}>10</h3>,
                            {divider: true},
                            <h3 onClick={(e) => {setPageSize(25)}}>25</h3>,
                            {divider: true},
                            <h3 onClick={(e) => {setPageSize(50)}}>50</h3>
                        ]}
                        />
                </GridItem>
            </GridContainer>
            <Paper className={classes.paper}>
            <Table className={classes.table} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.cell} component="th">NO</TableCell>
                        <TableCell className={classes.cell} component="th" align="center">인용논문</TableCell>
                        <TableCell className={classes.cell} component="th" align="right">total</TableCell>
                        {years.map((col, idx) => 
                            <TableCell className={classes.cell} component="th" key={`col-${idx}`} align="right">{col}</TableCell>)}
                        <TableCell style={{ maxWidth: 20 }} align="right">
                            {lastYear}:
                        </TableCell>
                        {rest.map((col, idx) => 
                            <TableCell className={classes.cell} component="th" key={`col-${idx}`} align="right">{col}</TableCell>)}
                    </TableRow>
                </TableHead>
                <TableBody>
                {tcDataRecords.map((record, idx) => {
                    const parsed = JSON.parse(record[1] || "{}");
                    
                    return (<TableRow key={`rcd-${idx}`}>
                        <TableCell key={`rcd-no${idx}`} className={classes.cell} component="th" scope="row">
                            {pageState.firstRecord + idx}
                        </TableCell>
                        <TableCell key={`rcd-show${idx}`} className={classes.cell} component="th" scope="row" align="center">
                            <Button color="transparent" onClick={() => { onRowClick(idx) }}>
                                보기
                            </Button>
                        </TableCell>
                        
                        <TableCell key={`rcd-total${idx}`} className={classes.cell} component="th" scope="row" align="right">
                            {record[0]}
                        </TableCell>
                        {years.map((key, jdx) => {
                            return (<TableCell className={classes.cell} key={`el-${jdx}`} align="right">{(parsed[key] && parsed[key]['total']) || 0}</TableCell>)
                        })}
                        <TableCell style={{ maxWidth: 20 }} align="right">
                        </TableCell>
                        {rest.map((key, jdx) => {
                            return (<TableCell className={classes.cell} key={`el-${jdx}`} align="right">{(parsed[lastYear] && parsed[lastYear][key]) || 0}</TableCell>)
                        })}
                    </TableRow>)
                })}
                </TableBody>
            </Table>
            <GridContainer>
                <GridItem xs={12} sm={12} md={12} style={{ textAlign: 'center', paddingTop: '24px' }}>
                    <Paginations justify="center"
                        onClick={onPageClick}
                        pages={pagesElements}
                    />
                </GridItem>
            </GridContainer>
            </Paper>
        </div>
    </>);
}