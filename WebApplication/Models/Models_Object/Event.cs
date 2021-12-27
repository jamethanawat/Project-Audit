using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication.Models.Models_Object
{
    public class Event
    {

        public Int64? ID { get; set; }
        public string code_event { get; set; }
        public string type_event { get; set; }
        public int type_id { get; set; }
        //public string type_detail { get; set; }
        public int customer_id { get; set; }
        public string customer { get; set; }
        public string location { get; set; }
        public string remark { get; set; }
        public DateTime event_start { get; set; }
        public DateTime event_end { get; set; }
        public int step { get; set; }
        public string step_name { get; set; }
        public string sum_step { get; set; }
        public int status { get; set; }
        public string staff { get; set; }
        public DateTime ins_time { get; set; }
        public string ins_user { get; set; }
        public string color { get; set; }
        public string name { get; set; }
        public string address { get; set; }
        public string contact_name { get; set; }
        public string contact_tel { get; set; }
        public string contact_fax { get; set; }
        public string contact_email { get; set; }
        public List<File> listfile { get; set; } 

    }
}