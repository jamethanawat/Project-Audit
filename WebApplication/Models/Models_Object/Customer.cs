using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication.Models.Models_Object
{
    public class Customer
    {
      
        public Int64? ID { get; set; }
        public string name { get; set; }
        public string address { get; set; }
        public string product { get; set; }
        public string consultant { get; set; }
        public string on_sit { get; set; }
        public string shift { get; set; }
        public string area_zone { get; set; }
        public string area_construction { get; set; }
    }
}