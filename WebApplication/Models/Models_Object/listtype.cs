using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication.Models.Models_Object
{
    public class listtype
    {
        public Int32? id { get; set; }
        public string type_event { get; set; }
        public string color { get; set; }
        public List<liststep> children { get; set; }
    }
}