using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebApplication.Helpers;
using WebApplication.Models.Database;
using WebApplication.Models.Models_Object;

namespace WebApplication.Models
{
    public class HomeModel
    {
        private DB dB;
        public HomeModel()
        {
            dB = new DB();
        }
        public List<Type_Event> GetTypeEvent()
        {
            try
            {
                var sql = $"SELECT * from tb_type where isactive ='1'";
                var result = dB.Database.SqlQuery<Type_Event>(sql).ToList();
                return result;
            }
            catch (Exception ex)
            {
                return null;
            }

        }
        public List<Customer> GetCustomer()
        {
            try
            {
                var sql = $@"SELECT ID, name, address, product, consultant, on_sit, shift, area_zone, area_construction
                        FROM tb_customer";
                var result = dB.Database.SqlQuery<Customer>(sql).ToList();
                return result;
            }
            catch (Exception ex)
            {
                return null;
            }

        }
        public List<string> GetStaff()
        {
            try
            {
                var sql = $"SELECT name from tb_user";
                var result = dB.Database.SqlQuery<string>(sql).ToList();
                return result;
            }
            catch (Exception ex)
            {
                return null;
            }

        }
        public List<string> GetSteplist(string type)
        {
            try
            {
                var sql = $@"SELECT b.step_name from tb_type as a inner join
                tb_step as b on a.ID = b.type_id where a.ID ={type}";                             
                var result = dB.Database.SqlQuery<string>(sql).ToList();
                return result;
            }
            catch(Exception ex)
            {
                return null;
            }

        }
        public int GetCountstepBycode(string code)
        {
            try
            {
                var sql = $@"SELECT count( step_name) from tb_step where type_id=(select type_id from tb_event where code_event='{code}' limit 1)";                             
                var result = dB.Database.SqlQuery<int>(sql).First();
                return result;
            }
            catch(Exception ex)
            {
                return -1;
            }
        }
        public int GetCountFinistBycode(string code)
        {
            try
            {
                var sql = $@"select count(code_event) from tb_event where status=1 and code_event='{code}'";
                var result = dB.Database.SqlQuery<int>(sql).First();
                return result;
            }
            catch (Exception ex)
            {
                return 0;
            }
        }
        public void UpdateStatustoFinist(string code)
        {
            string sql = $@"UPDATE tb_event SET status='2' WHERE code_event='{code}' and status='1'";
                
            var update = dB.Database.ExecuteSqlCommand(sql);
        }
        public List<string> GetPendingCode(string type, string customer)
        {
            try
            {
                var sql = $@"SELECT code_event FROM tb_event
                 where type_id ={type} and customer_id = {customer} and status !='2'
                 group by code_event ";
                var result = dB.Database.SqlQuery<string>(sql).ToList();
                return result;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        public List<Event> GetStep(string type,string customer,string code)
        {
            try
            {
                var sql = $@"SELECT  code_event, type_id,customer_id, remark, event_start, event_end, step, status, staff, ins_time, ins_user
                            FROM tb_event
                            where type_id ={type} and customer_id = {customer} ";
                if (code != "" && code !=null)
                {
                    sql += $@" and code_event = '{code}' ";
                }
                else
                {
                    sql+=$@" and code_event =(select code_event FROM tb_event where  type_id ={type} and customer_id= {customer} and status!='2' limit 1 ) ";
                }
                       
                var result = dB.Database.SqlQuery<Event>(sql).ToList();
                return result;
            }
            catch (Exception ex)
            {
                return null;
            }

        }
        public List<Event> GetShearch(string type, string customer, string remark,string status , DateTime start, DateTime End)
        {
            try
            {
               
                string sqlwhere = " where 1=1 ";
                if (type !="" && type!=null && type != "0") {
                    sqlwhere += $" and a.type_id ={type}";
                }
                if (customer != "" && customer != null)
                {
                    sqlwhere += $" and c.name like '%{customer}%'";
                }
                if (remark != "" && remark != null)
                {
                    sqlwhere += $" and a.remark like '%{remark}%'";
                }
                if (status != "" && status != null && status!="-1")
                {
                    if (status == "1")
                    {
                        // เอา 2 status (1 เสร็จของแต่ละ event ,2 เสร็จทั้งหมด )
                        sqlwhere += $" and (a.status ='1' or a.status ='2')";
                    }
                    else
                    {
                        sqlwhere += $" and a.status ={status}";
                    }
               
                }
                if (start != null && start.ToString("dd/MM/yyyy") != "01/01/0001")
                {
                    sqlwhere += $" and a.event_start >='{start.ToString("yyyy-MM-dd")}'";
                }
                if ( End != null && End.ToString("dd/MM/yyyy") != "01/01/0001")
                {
                    sqlwhere += $" and a.event_end <='{End.ToString("yyyy-MM-dd ")}'";
                }

                //var sql = $@"  SELECT a.ID, a.code_event, a.type_id, a.customer_id, a.remark, a.event_start, a.event_end, a.step, 

                //                    CASE
                //                   when (a.step::varchar(10)||'/'||(select count(tb_step.""ID"" )from tb_step where type_id =a.type_id )='1/0' ) then ''
                //                   else (a.step::varchar(10) || '/' || (select count(tb_step.""ID"")from tb_step where type_id = a.type_id ))       
                //               END as sum_step,
                //              a.status, a.staff, a.ins_time, a.ins_user
                //              ,b.type_event ,b.color
                //              ,c.name ,c.address ,c.contact_name,contact_tel,contact_fax,contact_email
                //              ,d.step_name
                //            FROM tb_event as a
                //            left join tb_type as b on a.type_id = b.id
                //            left join tb_customer as c on a.customer_id = c.ID
                //            left join tb_step as d on a.type_id = d.type_id and a.step = d.step 
                //            {sqlwhere}";
                var sql = $@"  SELECT a.ID, a.code_event, a.type_id, a.customer_id, a.remark, a.event_start, a.event_end, a.step, 

                               CASE
				                   when (CONCAT(a.step,'/',(select count(tb_step.ID )from tb_step where type_id =a.type_id ))='1/0' ) then ''
				                   else (CONCAT(a.step, '/' , (select count(tb_step.ID)from tb_step where type_id = a.type_id )))       
				               END 
				               AS 'sum_step',		
                              a.status, a.staff, a.ins_time, a.ins_user
                              ,b.type_event ,b.color
                              ,c.name ,c.address ,c.contact_name,contact_tel,contact_fax,contact_email
                              ,d.step_name
                            FROM tb_event as a
                            left join tb_type as b on a.type_id = b.id
                            left join tb_customer as c on a.customer_id = c.ID
                            left join tb_step as d on a.type_id = d.type_id and a.step = d.step 
                            {sqlwhere}";

                var result = dB.Database.SqlQuery<Event>(sql).ToList();
                return result;
            }
            catch (Exception ex)
            {
                return null;
            }



        }
        public List<Event> GetEvent(string code)
        {
            try
            {
                var sql = "";
                //if (code == "")
                //{
                //    sql = @"  SELECT a.ID, a.code_event, a.type_id, a.customer_id, a.remark, a.event_start, a.event_end, a.step,

                //               CASE
                //                   when (a.step::varchar(10)||'/'||(select count(tb_step.""ID"" )from tb_step where type_id =a.type_id )='1/0' ) then ''
                //                   else (a.step::varchar(10) || '/' || (select count(tb_step.""ID"")from tb_step where type_id = a.type_id ))       
                //               END as sum_step,

                //              a.status, a.staff, a.ins_time, a.ins_user
                //              ,b.type_event ,b.color
                //              ,c.name ,c.address ,c.contact_name,contact_tel,contact_fax,contact_email
                //              ,d.step_name
                //            FROM tb_event as a
                //            left join tb_type as b on a.type_id = b.id
                //            left join tb_customer as c on a.customer_id = c.ID
                //            left join tb_step as d on a.type_id = d.type_id and a.step = d.step ";
                //}
                //else
                //{
                //    sql = $@"  SELECT a.ID, a.code_event, a.type_id, a.customer_id, a.remark, a.event_start, a.event_end, a.step,

                //               CASE
                //                   when (a.step::varchar(10)||'/'||(select count(tb_step.""ID"" )from tb_step where type_id =a.type_id )='1/0' ) then ''
                //                   else (a.step::varchar(10) || '/' || (select count(tb_step.""ID"")from tb_step where type_id = a.type_id ))       
                //               END as sum_step,

                //              a.status, a.staff, a.ins_time, a.ins_user
                //              ,b.type_event ,b.color
                //              ,c.name ,c.address ,c.contact_name,contact_tel,contact_fax,contact_email
                //              ,d.step_name
                //            FROM tb_event as a
                //            left join tb_type as b on a.type_id = b.id
                //            left join tb_customer as c on a.customer_id = c.ID
                //            left join tb_step as d on a.type_id = d.type_id and a.step = d.step 
                //            WHERE a.code_event ='{code}'";
                //}


                if (code == "")
                {
                    sql = @" SELECT a.ID, a.code_event, a.type_id, a.customer_id, a.remark, a.event_start, a.event_end, a.step,  
				               CASE
				                   when (CONCAT(a.step,'/',(select count(tb_step.ID )from tb_step where type_id =a.type_id ))='1/0' ) then ''
				                   else (CONCAT(a.step, '/' , (select count(tb_step.ID)from tb_step where type_id = a.type_id )))       
				               END 
				               AS 'sum_step',			  
	                          a.status, a.staff, a.ins_time, a.ins_user
	                          ,b.type_event ,b.color
	                          ,c.name ,c.address ,c.contact_name,contact_tel,contact_fax,contact_email
	                          ,d.step_name
                            FROM tb_event as a
                            left join tb_type as b on a.type_id = b.id
                            left join tb_customer as c on a.customer_id = c.ID
                            left join tb_step as d on a.type_id = d.type_id and a.step = d.step ";
                }
                else
                {
                    sql = $@"  SELECT a.ID, a.code_event, a.type_id, a.customer_id, a.remark, a.event_start, a.event_end, a.step,
  
                                CASE
				                   when (CONCAT(a.step,'/',(select count(tb_step.ID )from tb_step where type_id =a.type_id ))='1/0' ) then ''
				                   else (CONCAT(a.step, '/' , (select count(tb_step.ID)from tb_step where type_id = a.type_id )))       
				               END 
				               AS 'sum_step',
   
                              a.status, a.staff, a.ins_time, a.ins_user
                              ,b.type_event ,b.color
                              ,c.name ,c.address ,c.contact_name,contact_tel,contact_fax,contact_email
                              ,d.step_name
                            FROM tb_event as a
                            left join tb_type as b on a.type_id = b.id
                            left join tb_customer as c on a.customer_id = c.ID
                            left join tb_step as d on a.type_id = d.type_id and a.step = d.step 
                            WHERE a.code_event ='{code}'";
                }

                var result = dB.Database.SqlQuery<Event>(sql).ToList();
                return result;
            }
            catch(Exception ex)
            {
                return null;
            }

        }

        public List<File> GetFile(string code,int step)
        {
            try
            {
                var sql = $@" SELECT  event_code, name, name_format, size, step, remark, ins_time, ins_user
                            FROM  tb_attach_file WHERE event_code='{code}' and step = {step} ";

                var result = dB.Database.SqlQuery<File>(sql).ToList();
                return result;
            }
            catch (Exception ex)
            {
                return null;
            }

        }
        public void insertEvent(string code_event,int type, string type_detail,int customer, string remark,DateTime start,DateTime End,string user,string staff,string mode,string step)
        {
            string sql = "";
            string newID = "";
            string period = DateTime.Now.ToString("yyMM");
            if ((code_event == ""||code_event == null) && mode=="new")
            {
                try
                {
                    sql = $"SELECT code_event from tb_event where code_event like '{'E' + period}%' order by code_event desc limit 1";
                    var result = dB.Database.SqlQuery<string>(sql).First();
                    int index = int.Parse(result.Substring(4))+1;
                    newID = "E"+period+ (int.Parse(result.Substring(5)) + 1).ToString("00");
                }
                catch (Exception ex)
                {
                    newID = "E" + period + "01";
                }

            }
            else {
                if (code_event.Length != 7)
                {
                    return;
                }
                newID = code_event;
            }
           // .ToString("yyyy-MM-dd HH:mm:ss")
             sql = $@"INSERT INTO tb_event
                       (code_event, type_id, customer_id, remark, event_start, event_end, step, status, staff, ins_time, ins_user)
                        VALUES('{newID}', {type}, {customer}, '{remark}', '{start.ToString("yyyy-MM-dd HH:mm:ss")}', '{End.ToString("yyyy-MM-dd HH:mm:ss")}',{step}
                        , 0, '{staff}', '{DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")}', '{user}'); ";
                                 
            var insert = dB.Database.ExecuteSqlCommand(sql);
        }

        public void UpdateEvent(string code,string remark, DateTime start, DateTime End,int step)
        {
          string  sql = $@"UPDATE tb_event SET remark='{remark}',event_start='{start.ToString("yyyy-MM-dd HH:mm:ss")}',event_end='{End.ToString("yyyy-MM-dd HH:mm:ss")}'
                          WHERE code_event='{code}' and step={step} ";

            var update = dB.Database.ExecuteSqlCommand(sql);
        }
        public void UpdateStatus(string code,int step)
        {
          string  sql = $@"UPDATE tb_event SET status=1 WHERE code_event='{code}' and step={step} ";
                         

            var update = dB.Database.ExecuteSqlCommand(sql);
        }

        public void InsertFile(string code, int step, HttpPostedFileBase file, string name_format,string insdttm, string insusrid)

        {
            string query = null;
            query = $@"INSERT INTO Tb_Attach_file ( event_code, name, name_format, size, step, ins_time, ins_user)
                    VALUES ('{code}','{file.FileName.ToString().ReplaceSingleQuote()}' ,'{name_format}' ,'{file.ContentLength}' ,{step} ,'{DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")}' ,'{insusrid}' ); ";

            var insert_status = dB.Database.ExecuteSqlCommand(query);
        }
    }
}