using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.Web.Mvc;
using WebApplication.Models.Database;
using WebApplication.Models.Models_Object;

namespace WebApplication.Models
{
    public class LoginModel
    {
        private DB dB;   
        public LoginModel()
        {
            dB = new DB();
        }
        public User Getuser(string user,string pass)
        {
            try
            {
                var sql = $"SELECT * from tb_user WHERE username = '{user}' and password='{pass}'";
                //var sql = $"SELECT name from user WHERE user_id ='12'";
                var result = dB.Database.SqlQuery<User>(sql).First();
                return result;
            }
            catch (Exception ex )
            {
                return null;
            }
         
        }
        public Boolean Checkuser(string user)
        {
            try
            {
                var sql = $"SELECT username from tb_user WHERE username = '{user}' limit 1";
                var result = dB.Database.SqlQuery<User>(sql).ToList();
                if (result.Count()>0)
                {
                    return false;
                }
                else
                {
                    return true;
                }
              
            }
            catch
            {
                return false;
            }
        }
        public void InsertUser(string user,string pass, string name, string email, string tel, string line,string position)
        {
            var sql = $@"INSERT INTO tb_user
                        (name, tel, line, email, username, password, position)
                        VALUES('{name}', '{tel}', '{line}','{email}', '{user}', '{pass}', '{position}')  ";
            var insert = dB.Database.ExecuteSqlCommand(sql);
        }
        public void InsertSkill(string user, string skill)
        {
            var sql_delete = $@"DELETE From tb_skill WHERE ""user"" = '{user}'";
            dB.Database.ExecuteSqlCommand(sql_delete);
            var CountSkill = skill.Split(',');
            foreach (var item in CountSkill)
            {
                var sql = $@"INSERT INTO tb_skill
                        (""user"", skill, rank, ins_time, ins_user)
                        VALUES('{user}', '{item}', 0, now(), '{user}')   ";
                dB.Database.ExecuteSqlCommand(sql);
            }  
        }
    }
}