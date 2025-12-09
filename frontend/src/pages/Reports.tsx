
import { LucideNotebookText } from "lucide-react";
import BarChart from "../features/reports/BarChart"
import { useTranslation } from "react-i18next";
import { MdOutlinePictureAsPdf } from "react-icons/md";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { Box, Paper } from "@mui/material";
import PieChart from "../features/reports/PieChart";
import type { TabItem } from "../types/reports";
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}




export default function Reports() {
          const { t  } = useTranslation();
           const [value, setValue] = React.useState(0);
const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const tabs: TabItem[] = [
    { id: 1, title: t("totalRevenue"), salary: 125.430, state: 12.5 },
    { id: 2, title: t("totalOrders"), salary: 1.280, state: 8.2 },
    { id: 3, title: t("averageOrderValue"), salary: 98.00, state: 1.5 },
  ];




  return (<>
    <main className="flex-1 p-8 bg-[#FAF9F6] dark:bg-[#1A2C2E]">
            <div className="mx-auto w-full max-w-7xl">
                     {/* PageHeading */}    
                <div className="flex flex-wrap justify-between gap-4 items-center mb-6">
                    <p className=" dark:text-[#f0f5f5] text-[#101818] text-4xl font-black leading-tight tracking-[-0.033em]">{t("sidebar.reports")}</p>
                    <div className="flex items-center gap-3">
                        <button className="flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-green-700/10 px-4 py-2.5 text-sm font-bold text-green-800 shadow-soft hover:bg-green-700/20 dark:bg-green-500/10 dark:text-green-400 dark:hover:bg-green-500/20">
                            <span className="material-symbols-outlined text-base"><LucideNotebookText /></span>
                            <span className="truncate">تصدير Excel</span>
                        </button>
                        <button  className="flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-red-700/10 px-4 py-2.5 text-sm font-bold text-red-800 shadow-soft hover:bg-red-700/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20">
                            <span className="material-symbols-outlined text-base"><MdOutlinePictureAsPdf /></span>
                            <span className="truncate">تصدير PDF</span>
                        </button>
                    </div>
                </div>
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                      <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label={t("salese")} {...a11yProps(0)} />
                        <Tab label={t("profit_and_loss")} {...a11yProps(1)} />
                        <Tab label={t("item_movement")} {...a11yProps(2)} />
                      </Tabs>
                    </Box>
                    <CustomTabPanel value={value} index={0}>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {tabs.map((tab)=>
                              <div key={tab.id} className="flex flex-col gap-2 rounded-xl bg-white p-6 shadow-soft dark:bg-[#292929] dark:shadow-soft-dark">
                                <p className="text-base font-medium text-slate-600 dark:text-slate-400">{tab.title}</p>
                                <p className="tracking-light text-3xl font-bold text-slate-900 dark:text-white">{tab.salary}</p>
                                <p className={`${tab.state >= 5 ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"} text-sm font-medium text-green-600 dark:text-green-500 flex items-center gap-1`}>
                                  {tab.state >= 5 ? "+" : "-"} <span>{tab.state} %</span>
                                  <span className="material-symbols-outlined text-base">{tab.state >= 5 ? <FaArrowUp /> : <FaArrowDown />}</span>
                                </p>
                              </div>
                            
                            )}
                        </div>

                        <Box sx={{display: "flex" , gap: "25px" , marginTop: "20px" ,}}>
                            <Paper sx={{width:"60%" ,  borderRadius:"13px"}}>
                                <BarChart/>
                            </Paper>
                            <Paper sx={{width:"40%" ,  borderRadius:"13px"}}>
                                <PieChart/>
                            </Paper>
                        </Box>
                    </CustomTabPanel>

                    <CustomTabPanel value={value} index={1}>
                        <Box sx={{display: "flex" , gap: "25px" , marginTop: "20px" ,}}>
                            <Paper sx={{width:"60%" ,  borderRadius:"13px"}}>
                                <BarChart/>
                            </Paper>
                            <Paper sx={{width:"40%" ,  borderRadius:"13px"}}>
                                <PieChart/>
                            </Paper>
                        </Box>
                    </CustomTabPanel>

                    <CustomTabPanel value={value} index={2}>
                        <Box sx={{display: "flex" , gap: "25px" , marginTop: "20px" ,}}>
                            <Paper sx={{width:"60%" ,  borderRadius:"13px"}}>
                                <BarChart/>
                            </Paper>
                            <Paper sx={{width:"40%" ,  borderRadius:"13px"}}>
                                <PieChart/>
                            </Paper>
                        </Box>
                    </CustomTabPanel>
                  </Box>

            </div>
            </main>

  </>
)
}
