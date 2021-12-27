using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApplication.Models;
using WebApplication.Models.Database;
using WebApplication.Models.Models_Object;

namespace WebApplication.Controllers
{
    public class LoginController : Controller
    {
        // GET: Login
        private DB _DB;
        private LoginModel M_Login;
        public LoginController()
        {
            M_Login = new LoginModel();
            _DB = new DB();
        }
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Create()
        {
            return View();
        }
        public ActionResult Submit(FormCollection frm)
        {

            string user = frm["user"];
            string pass = frm["pass"];
            //check user & password
            var Tuser =M_Login.Getuser(user,pass);
            if(Tuser == null)
            {
                TempData["Message"] = "The Username or Password Is Incorrect";
                return RedirectToAction("Index", "Login");
            }
            Session["name"] = Tuser.name;
            Session["username"] = Tuser.username;
            Session["position"] = Tuser.position;
            string url = "";
            if(Session["url"] != null)
            {
                url = Session["url"].ToString();
            }
            else
            {
                url = "Home";
            }
            return RedirectToAction("Index", url);
        }
        public ActionResult Submit_Create(FormCollection frm)
        {

            string user = frm["user"];
            string pass = frm["pass"];

            string name = frm["name"];
            string email = frm["email"];
            string skill = frm["skill"];
            string tel = frm["tel"];
            string line = frm["line"];
            string position = frm["position"];

            //check user 
            
            if (!M_Login.Checkuser(user))
            {
                TempData["Message"] = "The Username Is Duplicate";
                return RedirectToAction("Index", "Login");
            }
             //insert user
             M_Login.InsertUser(user,pass,name,email,tel,line,position);
             //insert skill
             M_Login.InsertSkill(user,skill);
            return RedirectToAction("Index","Login");
        }

    }
}