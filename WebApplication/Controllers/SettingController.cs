using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApplication.Models;
using WebApplication.Models.Models_Object;

namespace WebApplication.Controllers
{
    public class SettingController : Controller
    {
        private SettingModel M_Setting;
        public SettingController()
        {
            M_Setting = new SettingModel();
        }

        // GET: Setting
        public ActionResult Index()
        {
            return View();
        } 
        public ActionResult View_Type()
        {
            return View();
        }


     
     
        public ActionResult GetDataType()
        {
            //List<listtype> type;

            //type = M_Setting.GetType("");
            //type.ForEach(us =>
            //{
            //    us.children = M_Setting.GetStep(us.id.ToString());
            //});
            return Json(GetDataTypeF(), JsonRequestBehavior.AllowGet);
        }

        public List<listtype> GetDataTypeF()
        {
            List<listtype> type;

            type = M_Setting.GetType("");
            type.ForEach(us =>
            {
                us.children = M_Setting.GetStep(us.id.ToString());
            });
            return type;
        }


        public ActionResult GetDataByID(string typeID)
        {
            List<listtype> type = new List<listtype>();
            List<liststep> step = new List<liststep>();
            type = M_Setting.GetType(typeID);
            if (type.Count > 0)
            {
                step = M_Setting.GetStep(type[0].id.ToString());
            }

            return Json(new { Type = type, Step = step }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult SaveChange(listtype type, string step, string mode)
        {
            var tmp = step.Split(',');
            int i = 1;

            if (mode == "new")
            {
                var IDtype = M_Setting.InsertType(type.type_event, type.color);

                foreach (var item in tmp)
                {
                    if (item != "")
                    {
                        M_Setting.InsertStep(IDtype.ToString(), item, i);
                        i++;
                    }
                    
                }

            }
            else if (mode == "edit")
            {

                M_Setting.UpdateType(type.id.ToString(), type.type_event, type.color);
                if (tmp.Length > 0)
                {
                    M_Setting.DeleteStep(type.id.ToString());
                    foreach (var item in tmp)
                    {
                        if (item != "")
                        {
                            M_Setting.InsertStep(type.id.ToString(), item, i);
                            i++;
                        }
                    }
                }
            }
            return Json(new { status = "success", data=GetDataTypeF() }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult DeleteTypeEvent(string type_id)
        {

           // M_Setting.DeleteStep(type_id.ToString());
            M_Setting.DeleteType(type_id.ToString());
            return Json(new { status = "success", data = GetDataTypeF() }, JsonRequestBehavior.AllowGet);
        }
    }
}