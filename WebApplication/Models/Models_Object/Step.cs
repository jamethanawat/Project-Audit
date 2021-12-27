using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication.Models.Models_Object
{
    public class Step
    {
        public Int64? ID { get; set; }
        public string code_event { get; set; }
        public string type { get; set; }
        public string type_detail { get; set; }
    }
}