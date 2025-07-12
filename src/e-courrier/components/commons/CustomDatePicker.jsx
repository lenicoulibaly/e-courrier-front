import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {InputAdornment} from "@mui/material";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import React from "react";
import {MobileDatePicker} from "@mui/x-date-pickers";
import DateRangeIcon from "@mui/icons-material/DateRange";

export const CustomDatePicker = ({label, onChange})=>
{
    return<LocalizationProvider dateAdapter={AdapterDateFns}>
        <MobileDatePicker
            onChange={onChange}
            label={label}
            onError={console.log}
            minDate={new Date('2018-01-01')}
            format="dd/MM/yyyy"
            slotProps={{
                textField: {
                    margin: 'normal',
                    fullWidth: true,
                    InputProps: {
                        endAdornment: (
                            <InputAdornment position="end" sx={{ cursor: 'pointer' }}>
                                <DateRangeIcon />
                            </InputAdornment>
                        )
                    }
                }
            }}
        />
    </LocalizationProvider>
}