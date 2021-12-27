using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication.Models.Models_Object
{
    public class File
    {
      
        public Int64? ID { get; set; }
        public string code_event { get; set; }
        public string name { get; set; }
        public string name_format { get; set; }
        public string size { get; set; }
        public int step { get; set; }
        public string remark { get; set; }
        public DateTime ins_time { get; set; }
        public string ins_user { get; set; }
    }
}