import React, { useState } from 'react';
import { Box, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ResponsiveBar } from '@nivo/bar';

interface SaleData {
  date: string;
  sales: number;
}

// بيانات تجريبية
const initialData: SaleData[] = [
  { date: '2025-11-01', sales: 1000 },
  { date: '2025-11-05', sales: 2000 },
  { date: '2025-11-08', sales: 1500 },
  { date: '2025-11-09', sales: 3000 },
];

const Filter: React.FC = () => {
  // الحالة للفلترة بالفترة الزمنية
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);

  // فلترة البيانات حسب الفترة الزمنية
  const filteredData = initialData.filter((item) => {
    const itemDate = new Date(item.date);
    const [start, end] = dateRange;
    if (!start || !end) return true; // لو محدش اختار فترة
    return itemDate >= start && itemDate <= end;
  });

  // تحضير بيانات البار تشارت
  const chartData = filteredData.map((d) => ({
    date: d.date,
    sales: d.sales,
  }));

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box p={4}>
        <h2>Dashboard</h2>

        {/* Date Range Picker */}
        <DateRangePicker
          startText="من"
          endText="إلى"
          value={dateRange}
          onChange={(newValue) => setDateRange(newValue)}
          renderInput={(startProps, endProps) => (
            <>
              <TextField {...startProps} sx={{ mr: 2 }} />
              <TextField {...endProps} />
            </>
          )}
        />

        {/* الجدول */}
        <TableContainer component={Paper} sx={{ mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>التاريخ</TableCell>
                <TableCell>المبيعات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row) => (
                <TableRow key={row.date}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.sales}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Bar Chart */}
        <Box height={400} mt={4}>
          <ResponsiveBar
            data={chartData}
            keys={['sales']}
            indexBy="date"
            margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
            padding={0.3}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={{ scheme: 'nivo' }}
            axisBottom={{
              tickRotation: -45,
            }}
            axisLeft={{ legend: 'المبيعات', legendPosition: 'middle', legendOffset: -50 }}
          />
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default Filter;
