import * as React from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import {TextField} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import {transferListActions} from "../../../store/slices/transferListSlice";
import {dispatch} from "../../../store";

function not(a, b) {
    return a?.filter((value) => b?.indexOf(value) === -1);
}

function intersection(a, b) {
    return a?.filter((value) => b?.indexOf(value) !== -1);
}

/*const optionMinus = (optionA, optionB)=>
{
    if(optionA == null || optionA == undefined || !Array.isArray(optionA)) return []
    if(optionB == null || optionB == undefined || !Array.isArray(optionB) || optionB.length == 0) return optionA;

    const aIds = optionA.map(i=>i.id);
    const bIds = optionB.map(i=>i.id);
    const aMinusBIds = aIds.filter(aId=>bIds.indexOf(aId) == -1)
    return optionA?.filter((value) => aMinusBIds.indexOf(value.id) > -1);
}*/

const optionMatchesKey = (o, key)=>
{
    if(o == null || o == undefined) return false;
    if(key == null || key == undefined) return true;
    const matches = o.id?.trim()?.toUpperCase()?.includes(key?.trim()?.toUpperCase()) || o?.label?.trim()?.toUpperCase()?.includes(key?.trim()?.toUpperCase());
    return matches;
}


export default function TransferList({initialList, preselected}) {
    const [checked, setChecked] = React.useState([]);
    const [left, setLeft] = React.useState([]);
    const [right, setRight] = React.useState([]);


    useEffect(()=>
    {
        setLeft(initialList)
        setRight(preselected)
    }, [])

    useEffect(()=>
    {
        dispatch(transferListActions.selectionChanged(right))
    }, [right])

    useEffect(()=>
    {
        const rightIds = right?.map(r=>r?.id);
        setLeft(right == null || right == undefined || right.length == 0 ? initialList : initialList?.filter(u=>rightIds?.indexOf(u?.id) == -1))
    }, [initialList, right])

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const handleAllRight = () => {
        const leftMatchingKey = left?.filter(r=>optionMatchesKey(r, keyLeft)) || []
        const leftNotMatchingKey = left?.filter(r=>!optionMatchesKey(r, keyLeft)) || []
        setRight((right||[]).concat(leftMatchingKey));
        setLeft([leftNotMatchingKey]);
    };

    const handleCheckedRight = () => {
        setRight(right?.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    const handleAllLeft = () => {
        const rightMatchingKey = right?.filter(r=>optionMatchesKey(r, keyRight)) || []
        const rightNotMatchingKey = right?.filter(r=>!optionMatchesKey(r, keyRight)) || []
        setLeft((left||[]).concat(rightMatchingKey));
        setRight(rightNotMatchingKey);
    };
    const isPreselected = (item)=>
    {
        const preselectedIds = preselected?.map(i=>i?.id);
        const selected = preselectedIds?.indexOf(item?.id) >=0
        return selected;
    }
    const [keyLeft, setKeyLeft] = useState('')
    const [keyRight, setKeyRight] = useState('')
    const preselectedStyle = {backgroundColor: 'lightGreen', fontWeight: 'bolder', color: 'white'}

    const CustomList = ({items, position}) => {
        let currentKey = position == 'left' ? keyLeft : keyRight;
        const keyLeftRef = useRef();
        const keyRightRef = useRef();

        useEffect(()=>
        {keyLeft.current?.focus();}, [keyLeft])


        /*useEffect(() => {
            keyRightRef.current?.focus();
        }, [keyRight]);*/

        /*useEffect(() => {
            keyLeftRef.current?.focus();
        }, [keyLeft]);*/

        const onKeyLeftChange = (e)=>
        {
            const newKey = e.target.value;
            setKeyLeft(newKey);
            currentKey = newKey;
        }

        const onKeyRightChange = (e)=>
        {
            const newKey = e.target.value;
            setKeyRight(newKey);
            currentKey = newKey;
        }

        return (
            <Paper sx={{ width: 300, height: 230, overflow: 'auto' }}>
                {position == 'right' && <TextField inputRef={keyRightRef} size={"small"} fullWidth value={keyRight} onChange={onKeyRightChange}/>}
                {position == 'left' && <TextField inputRef={keyLeftRef} size={"small"} fullWidth value={keyLeft} onChange={onKeyLeftChange}/>}

                <List dense component="div" role="list">
                    {items?.map((value) => {
                        const labelId = value?.label;
                        return optionMatchesKey(value, currentKey) ? (
                            <ListItem
                                key={value?.id}
                                role="listitem"
                                button
                                onClick={handleToggle(value)}
                                style={isPreselected(value) ? preselectedStyle : {}}
                            >
                                <ListItemIcon>
                                    <Checkbox
                                        checked={checked.indexOf(value) !== -1}
                                        tabIndex={-1}
                                        disableRipple
                                        inputProps={{
                                            'aria-labelledby': labelId,
                                        }}
                                    />
                                </ListItemIcon>
                                <ListItemText id={labelId} primary={value?.label} />
                            </ListItem>
                        ) : null;
                    })}
                </List>
            </Paper>
        );
    }

    return (
        <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid item><CustomList position={'left'} items={left} /></Grid>
            <Grid item>
                <Grid container direction="column" alignItems="center">
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleAllRight}
                        disabled={left?.length === 0}
                        aria-label="move all right"
                    >
                        ≫
                    </Button>
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedRight}
                        disabled={leftChecked?.length === 0}
                        aria-label="move selected right"
                    >
                        &gt;
                    </Button>
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedLeft}
                        disabled={rightChecked.length === 0}
                        aria-label="move selected left"
                    >
                        &lt;
                    </Button>
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleAllLeft}
                        disabled={right?.length === 0}
                        aria-label="move all left"
                    >
                        ≪
                    </Button>
                </Grid>
            </Grid>
            <Grid item><CustomList position={'right'} items={right} /></Grid>
        </Grid>
    );
}
