using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApplication.Helpers;

using WebApplication.Models;
using WebApplication.Models.Models_Object;

namespace WebApplication.Controllers
{
    public class HomeController : Controller
    {

        private HomeModel M_Home;
        public HomeController()
        {
            M_Home = new HomeModel();
        }
        public ActionResult Index()
        {
            if ( (string)Session["username"] == null )
            {
                Session["url"] = "Home";
                
                return RedirectToAction("Index", "Login");
               
            }
            return View();
        }


        public ActionResult Search()
        {
            if ((string)Session["username"] == null)
            {
                Session["url"] = "Home";

                return RedirectToAction("Index", "Login");

            }
            return View();
        }

        public ActionResult Submit_Search(Event items,string event_start,string event_end)
        {
            if ((string)Session["username"] == null)
            {
                Session["url"] = "Home";

                return RedirectToAction("Index", "Login");

            }
            DateTime result_Start = DateConvert.DateJStoDatet_start(event_start);
            DateTime result_End = DateConvert.DateJStoDatet_End(event_end);
            var result = M_Home.GetShearch(items.type_id.ToString(),items.customer,items.remark,items.status.ToString(), result_Start, result_End);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult GetTypeEvent()
        {
            var result = M_Home.GetTypeEvent();
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult GetCustomer()
        {
            var result = M_Home.GetCustomer();
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult GetStaff()
        {
            var result = M_Home.GetStaff();
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult CkEventAndStep(string type,string customer,string code_event)
        {
            var result = M_Home.GetSteplist(type);//stepของแต่ละtype
            //var result_eventlist = M_Home.GetPendingCode(type, customer);//กรณี type customer เดียวกัน แต่มีหลาย ID event
            return Json(new { hisEvent = result.Count==0 ? null: M_Home.GetStep(type, customer, code_event), liststep =result ,PendingEvent = result.Count == 0 ? null : M_Home.GetPendingCode(type, customer) }, JsonRequestBehavior.AllowGet);
            //return Json(result, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult GetFile(string code_event,int step)
        {
            var result = M_Home.GetFile(code_event,step);
            return Json(result, JsonRequestBehavior.AllowGet);
         
        }

        [HttpPost]
        public ActionResult GetEvent()
        {
            var result = M_Home.GetEvent("");
            return Json(result, JsonRequestBehavior.AllowGet);

        }
        [HttpPost]
        public ActionResult GetHistory(string code)
        {
            var result = M_Home.GetEvent(code);
            var liststep = M_Home.GetSteplist(result[0].type_id.ToString());//stepของแต่ละtype
            if (result == null)
            {
                return null;
            }
            foreach (Event item in result)
            {
                item.listfile=M_Home.GetFile(item.code_event, item.step);

            }
            return Json(new { history=result , liststep = liststep }, JsonRequestBehavior.AllowGet);

        }
        [HttpPost]
        public ActionResult InsertEvent(Event items,string mode,string step,string event_start,string event_end)
        {

            string code = items.code_event;
            //string Date_Start = items.event_start.ToString();
            string Date_Start = event_start.ToString();
            //string Date_End = items.event_end.ToString();
            string Date_End = event_end.ToString();
            int type = items.type_id;
            string type_detail = "";
            int customer = items.customer_id;
           // string location = "";
            string remark = items.remark;
            string staff = items.staff;
            //string file = frm["filepond"];

            //var postedFile = Request.Files["filepond"];
            //var fileIsValid = ValidateFile(postedFile);
            //if (postedFile != null)
            //{
            //    string path = Server.MapPath("~/Uploads/");
            //    if (!Directory.Exists(path))
            //    {
            //        Directory.CreateDirectory(path);
            //    }

            //    postedFile.SaveAs(path + Path.GetFileName(postedFile.FileName));
            //}

        

            DateTime result_Start = DateConvert.DateJStoDatetime(Date_Start);
            DateTime result_End = DateConvert.DateJStoDatetime(Date_End);

            M_Home.insertEvent(code,type, type_detail, customer, remark, result_Start, result_End,Session["username"].ToString(),staff,mode,step);
            return Json(new { status = "success" }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult UpdateEvent(Event items, string event_start, string event_end)
        {

            string code = items.code_event;
            //string Date_Start = items.event_start.ToString();
            //string Date_End = items.event_end.ToString();    
            string Date_Start = event_start.ToString();
            string Date_End = event_end.ToString();     
            string remark = items.remark;
            int step = items.step;
            DateTime result_Start = DateConvert.DateJStoDatetime(Date_Start);
            DateTime result_End = DateConvert.DateJStoDatetime(Date_End);

            M_Home.UpdateEvent(code,remark, result_Start, result_End, step);
            return Json(new { status = "success" }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult UpdateStatus(Event items)
        {
            string code = items.code_event;
            int step = items.step;
            M_Home.UpdateStatus(code, step);
            if(M_Home.GetCountFinistBycode(code) == M_Home.GetCountstepBycode(code))
            {
                M_Home.UpdateStatustoFinist(code);
            }
            return Json(new { status = "success" }, JsonRequestBehavior.AllowGet);
        }
        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
       
        public ActionResult DownloadFile(string id)
        {
            var r = id;
            var temp = r.Split('^');
            string filePath = temp[0];
            //string fullName = Server.MapPath("~/Preparation/");
           string fullName = Path.Combine("E:/web/test_file/");
            byte[] fileBytes = GetFile(fullName + filePath);
            return File(fileBytes, System.Net.Mime.MediaTypeNames.Application.Octet, temp[1]);
        }

        byte[] GetFile(string s)
        {
            System.IO.FileStream fs = System.IO.File.OpenRead(s);
            byte[] data = new byte[fs.Length];
            int br = fs.Read(data, 0, data.Length);
            if (br != fs.Length)
                throw new System.IO.IOException(s);
            return data;
        }

        [HttpPost]
        public ActionResult InsertFile(RawFile file_item)
        {
            try
            {
                string date = DateTime.Now.ToString("yyyyMMddHHmmss");
                string date_ff = DateTime.Now.ToString("yyyyMMddHHmmss.fff");
                //Value temp_file = new Value();
                //temp_file = Session["TxtFile"] as Value;

                if (file_item.file != null && file_item.file.ContentLength > 0)
                {
                    var InputFileName = Path.GetFileName(date_ff);
                    var ServerSavePath = Path.Combine("E:/web/test_file/" + InputFileName);
                    file_item.file.SaveAs(ServerSavePath);

                    M_Home.InsertFile(file_item.code, file_item.step, file_item.file, date_ff, date, Session["username"].ToString());
                }
                return Json(new { status = "success" }, JsonRequestBehavior.AllowGet);

            }
            catch(Exception ex)
            {
                return Json(new { status = "error" }, JsonRequestBehavior.AllowGet);

            }
        }

        public bool ValidateFile(HttpPostedFileBase file)
        {
            switch (file.ContentType)
            {
                // Example: return valid = true for following file types:
                case ("image.gif"):
                case ("image/jpg"):
                case ("image/png"):
                    return true;

                // Otherwise if anything else, return false
                default: return false;
            }
        }
        public class RawFile
        {
            public HttpPostedFileBase file { get; set; }
            //public string description { get; set; }
            public int id { get; set; }
            public string code { get; set; }
            public int  step { get; set; }
        
        }
    }
}