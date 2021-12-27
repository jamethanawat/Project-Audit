using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebApplication.Models.Database;
using WebApplication.Models.Models_Object;

namespace WebApplication.Models
{
    public class SettingModel
    {
        private DB dB;
        public SettingModel()
        {
            dB = new DB();
        }
        public List<listtype> GetType(string id)
        {
            string txtsql = "";
            if (id == "")
            {
                txtsql = @"select id, type_event, color from tb_type where isactive ='1' ";
            }
            else
            {
                txtsql = $@"select id, type_event, color from tb_type where isactive ='1' and id={id} ";
            }

            var result = dB.Database.SqlQuery<listtype>(txtsql).ToList();
            return result;
        }
        public List<liststep> GetStep(string type)
        {
            //var sql = $@"SELECT ""ID"", type_id, step, step_name FROM tb_step where type_id={type} ";
            var sql = $@"SELECT ID, type_id, step, step_name FROM tb_step where type_id={type} ";

            var result = dB.Database.SqlQuery<liststep>(sql).ToList();
            return result;
        }
        public void DeleteStep(string type_id)
        {
            var sql = $@"DELETE FROM tb_step where type_id ={type_id} ";
            var result = dB.Database.ExecuteSqlCommand(sql);

        }
        public void InsertStep(string type_id, string stepname,int step)
        {
            var sql = $@"INSERT INTO tb_step (type_id, step_name ,step)VALUES({type_id},'{stepname}',{step})";
            var result = dB.Database.ExecuteSqlCommand(sql);

        }
        public void UpdateType(string type_id, string type, string color)
        {
            var sql = $@"UPDATE tb_type
                        SET type_event='{type}', color='{color}'
                        WHERE id={type_id};";

            var result = dB.Database.ExecuteSqlCommand(sql);

        }
        public void DeleteType(string type_id)
        {
            var sql = $@"UPDATE tb_type set isactive ='0' where id = {type_id}  ";
            var result = dB.Database.ExecuteSqlCommand(sql);

        }
        public Int64 InsertType(string type, string color)
        {
            //var sql = $@"INSERT INTO tb_type (type_event,color,isactive)VALUES('{type}', '{color}','1') RETURNING id";  
            var sql = $@"INSERT INTO tb_type (type_event,color,isactive)VALUES('{type}', '{color}','1') ; SELECT LAST_INSERT_ID();";  

            //var sql = $@"INSERT INTO tb_type (type_code,color)OUTPUT Inserted.id  VALUES('{type}', '{color}') ";
                      

            //var result = dB.Database.ExecuteSqlCommand(sql);          

            var result = dB.Database.SqlQuery<Int32>(sql).First();
            return result;

        }
    }
}