using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication.Models.Models_Object
{
    public class User
    {
        public Int64? ID { get; set; }   
        public string name { get; set; }
        public string tel { get; set; }
        public string line { get; set; }
        public string email { get; set; }
        public string username { get; set; }
        public string password { get; set; }
        public string position { get; set; }
        public User(string Name, string Tel, string Line, string Email,string User,string Pass,string Position)
        {
            this.name = Name;
            this.tel = Tel;
            this.line = Line;
            this.email = Email;
            this.username = User;
            this.password = Pass;
            this.position = Position;
          
        }
        public User()
        {
            this.name = "admin";
            this.tel = "123";
            this.line = "zz";
            this.email = "zzzzzz@gmail.com";
            this.username = "admin";
            this.password = "admin";
            this.position = "admin";
        }
    }
}