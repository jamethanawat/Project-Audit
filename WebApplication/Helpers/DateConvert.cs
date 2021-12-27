using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;

namespace WebApplication.Helpers
{
    public static class DateConvert
    {
        public static DateTime DateJStoDatetime(string txt)
        {
            try
            {
               
                var tmp = txt.Split(' ');
                var tmpdate = tmp[0].Split('/');
                var tmptime = tmp[1].Split(':');
                string txtdate = (Int16.Parse(tmpdate[0])).ToString("00") + "/" + (Int16.Parse(tmpdate[1])).ToString("00") + "/" + (Int16.Parse(tmpdate[2])).ToString("00");
                string txttime = (Int16.Parse(tmptime[0])).ToString("00") + ":" + (Int16.Parse(tmptime[1])).ToString("00") + ":00";
                txt = txtdate + " " + txttime;
                DateTime result = DateTime.ParseExact(txt, "dd/MM/yyyy HH:mm:ss", CultureInfo.InvariantCulture);

                return result;
            }
            catch (Exception ex)
            {
                if (txt == "1/1/0001 0:00:00" || txt == "01/01/01 00:00:00" || txt == ""|| txt ==null)
                {
                    DateTime result2 = DateTime.ParseExact(DateTime.Now.ToString("0001-01-01 00:00:00"), "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                    return result2;
                }
                else
                {
                    DateTime result2 = DateTime.ParseExact(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"), "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                    return result2;
                }
        
            }
  
        }
        public static DateTime DateJStoDatet_start(string txt)
        {
            try
            {
                var tmpdate = txt.Split('/');      
                string txtdate = (Int16.Parse(tmpdate[0])).ToString("00") + "/" + (Int16.Parse(tmpdate[1])).ToString("00") + "/" + (Int16.Parse(tmpdate[2])).ToString("00");
                txtdate = txtdate + " 00:01:00";
                DateTime result = DateTime.ParseExact(txtdate, "dd/MM/yyyy HH:mm:ss", CultureInfo.InvariantCulture);

                return result;
            }
            catch (Exception ex)
            {
                if (txt == "1/1/0001 0:00:00" || txt == "01/01/01 00:00:00" || txt == "" || txt == null)
                {
                    DateTime result2 = DateTime.ParseExact(DateTime.Now.ToString("0001-01-01 00:00:00"), "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                    return result2;
                }
                else
                {
                    DateTime result2 = DateTime.ParseExact(DateTime.Now.ToString("yyyy-MM-dd 00:01:00"), "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                    return result2;
                }

            }

        }
        public static DateTime DateJStoDatet_End(string txt)
        {
            try
            {
                var tmpdate = txt.Split('/');
                string txtdate = (Int16.Parse(tmpdate[0])).ToString("00") + "/" + (Int16.Parse(tmpdate[1])).ToString("00") + "/" + (Int16.Parse(tmpdate[2])).ToString("00");
                txtdate = txtdate + " 23:59:00";
                DateTime result = DateTime.ParseExact(txtdate, "dd/MM/yyyy HH:mm:ss", CultureInfo.InvariantCulture);

                return result;
            }
            catch (Exception ex)
            {
                if (txt == "1/1/0001 0:00:00" || txt == "01/01/01 00:00:00" || txt == "" || txt == null)
                {
                    DateTime result2 = DateTime.ParseExact(DateTime.Now.ToString("0001-01-01 00:00:00"), "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                    return result2;
                }
                else
                {
                    DateTime result2 = DateTime.ParseExact(DateTime.Now.ToString("yyyy-MM-dd 23:59:00"), "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                    return result2;
                }

            }

        }
    }
}