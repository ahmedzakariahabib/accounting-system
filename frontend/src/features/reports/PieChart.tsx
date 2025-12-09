import { Box, useTheme } from '@mui/material';
import { ResponsivePie } from '@nivo/pie'
import { useTranslation } from "react-i18next";
  // بيانات الرسم البياني الدائري
  interface SaleData {
  name: string;
  value: number;
  color: string
}
  const data:SaleData[] = [
    { name: "جاكيت جينز", value: 10800 ,  color: "#007C7C"},
    { name: "تي شيرت قطن", value: 8600 ,  color: "#008787" },
    { name: "بنطلون شينو", value: 6500 ,  color: "#009A9A"},
    { name: "حذاء جلد", value: 4200  ,  color: "#01CBCB" },
    { name: "وشاح صوف", value: 3100  ,  color: "#02F9F9" },
  ];
export default function PieChart() {
            const theme = useTheme()
              const { t  } = useTranslation();

  return (<>
    <div className='pt-5 ps-8'>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t("topSellingProducts")}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">{t("bestPerformanceThisMonth")}</p>
    </div>
 
    <Box sx={{height : "60vh" , }}>
      <ResponsivePie 
        data={data}
        id="name"     

 colors={({ data }) => data.color}
    theme={{
    // "background": "#ffffff",
    "text": {
        "fontSize": 11,
        "fill": theme.palette.text.primary,
        "outlineWidth": 0,
        "outlineColor": "#ffffff"
    },
    "axis": {
        "domain": {
            "line": {
                "stroke": theme.palette.divider,
                "strokeWidth": 1
            }
        },
        "legend": {
            "text": {
                "fontSize": 12,
                "fill": theme.palette.text.primary,
                "outlineWidth": 0,
                "outlineColor": "#ffffff"
            }
        },
        "ticks": {
            "line": {
                "stroke": theme.palette.divider,
                "strokeWidth": 1
            },
            "text": {
                "fontSize": 11,
                "fill": theme.palette.text.primary,
                "outlineWidth": 0,
                "outlineColor": "#ffffff"
            }
        }
    },
    "grid": {
        "line": {
            "stroke": theme.palette.divider,
            "strokeWidth": 1
        }
    },
    "legends": {
        "title": {
            "text": {
                "fontSize": 11,
                "fill": theme.palette.text.primary,
                "outlineWidth": 0,
                "outlineColor": "#ffffff"
            }
        },
        
        "text": {
            "fontSize": 11,
            "fill": theme.palette.text.primary,
            "outlineWidth": 0,
            "outlineColor": "#ffffff"
        },
        "ticks": {
            "line": {},
            "text": {
                "fontSize": 10,
                "fill": theme.palette.text.primary,
                "outlineWidth": 0,
                "outlineColor": "#ffffff"
            }
        }
    },
    "annotations": {
        "text": {
            "fontSize": 13,
            "fill": theme.palette.text.primary,
            "outlineWidth": 2,
            "outlineColor": "#ffffff",
            "outlineOpacity": 1
        },
        "link": {
            "stroke": "#000000",
            "strokeWidth": 1,
            "outlineWidth": 2,
            "outlineColor": "#ffffff",
            "outlineOpacity": 1
        },
        "outline": {
            "stroke": "#000000",
            "strokeWidth": 2,
            "outlineWidth": 2,
            "outlineColor": "#ffffff",
            "outlineOpacity": 1
        },
        "symbol": {
            "fill": "#000000",
            "outlineWidth": 2,
            "outlineColor": "#ffffff",
            "outlineOpacity": 1
        }
    },
    "tooltip": {
        // "wrapper": {},
        "container": {
            "background": theme.palette.background.default,
            "color": theme.palette.text.primary,
            "fontSize": 12
        },
        "basic": {},
        "chip": {},
        "table": {},
        "tableCell": {},
        "tableCellValue": {}
    }
}}
        margin={{ top: 20, right: 10, bottom: 70, left: 10 }}
        enableArcLinkLabels={false}
        // enableArcLabels={false}
        innerRadius={0.5}
        padAngle={0.6}
        cornerRadius={2}
        activeOuterRadiusOffset={8}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor={theme.palette.text.primary}
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
  transitionMode="endAngle"
        legends={[
            {
                anchor: 'bottom-left',
                direction: 'column',
                translateX: 1,
                translateY: 55,
                itemWidth: 65,
                itemHeight: 10,
                itemsSpacing: 10,
                symbolSize: 15
            }
        ]}
 
    />
        </Box>
  </> )
}
