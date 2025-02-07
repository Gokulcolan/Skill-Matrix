import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

export default function CommonDatePicker({ label, selectedDate, onDateChange, sx }) {

    const handleDateChange = (newDate) => {
        if (newDate) {
            onDateChange(dayjs(newDate)); // Pass a `dayjs` object
        } else {
            onDateChange(null); // Clear the date
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
                <DatePicker
                    label={label}
                    value={selectedDate ? dayjs(selectedDate) : null} // Handle both prepopulated and cleared states
                    onChange={handleDateChange} // Update on date change
                    format="YYYY-MM-DD"
                    sx={sx}
                />
            </DemoContainer>
        </LocalizationProvider>
    );
}
