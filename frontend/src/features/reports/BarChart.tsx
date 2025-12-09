import React from 'react'
import { ResponsiveBar } from '@nivo/bar'
import { Box, useTheme } from '@mui/material';
// import type { SalesData } from '../../types/reports';
import { useTranslation } from "react-i18next";
import { data } from './data';


//   const data: SalesData[] = [
//     { name: "يناير", sales: 12000 ,  color: "#CCE3E3"},
//     { name: "فبراير", sales: 19000,  color: "#88BBC0" },
//     { name: "مارس", sales: 3000 ,  color: "#66ACAC"},
//     { name: "أبريل", sales: 5000 ,  color: "#338F8F"},
//     { name: "مايو", sales: 22000 ,  color: "#008080"},
//     { name: "يونيو", sales: 30000 ,  color: "#007B7B"},
//   ];


export default function BarChart() {
        const theme = useTheme()
          const { t  } = useTranslation();

  
  return (<>
            <div className='ps-8 pt-5'>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t("salesOverTime")}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t("salesPerformance")}</p>
            </div>
        <Box sx={{height:"60vh" ,  }}>
        <ResponsiveBar 
         data={data}
         keys={["sales"]}   
         indexBy="name"
        //   borderRadius={8}  
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

         labelSkipWidth={12}
         labelSkipHeight={12}
        colors={({ data }) => data.color}
         legends={[
             {
                 dataFrom: 'keys',
                anchor:  'bottom-right', // ✅ قلب الاتجاه
                 direction: 'column',
                 translateX:  120,
                 itemsSpacing: 3,
                 itemWidth: 100,
                 itemHeight: 16
             }
         ]}
   
         margin={{ top: 30, right: 100, bottom: 50, left: 60 }}
       
     />
    </Box>
  </>)
}
