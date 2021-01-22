using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using WebApplication1.Models;
using WebApplication1.Models.DBModel;

namespace WebApplication1.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly ConnectContext db;
        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
            db = new ConnectContext();
        }

        public IActionResult Index()
        {
            List<Cv> cvs = null;
            try
            {
                cvs = new List<Cv>();
                cvs = db.Cv.ToList();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
            return View(Tuple.Create(new Cv(),cvs));
        }


        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
        [HttpPost]
        public JsonResult DeleteCv(int id)
        {
            var removable = db.Cv.FirstOrDefault(x => x.Id==id);
             db.Cv.Remove(removable ?? throw new InvalidOperationException());
             db.SaveChanges();
            return Json(new
            {
                success = true,
                text = "OK"
            });
        }

        [HttpPost]
        public JsonResult ChangeCv(Cv cv)
        {
            var success = false;
            var oldCv = db.Cv.FirstOrDefault(x => x.Id == cv.Id);
            if (oldCv != null)
            {
                oldCv.Birthday = cv.Birthday;
                oldCv.Married = cv.Married;
                oldCv.Name = cv.Name;
                oldCv.Phone = cv.Phone;
                oldCv.Salary = cv.Salary;
                db.Cv.Update(oldCv);
                db.SaveChanges();
                success = true;
            }
            return Json(new
            {
                success,
                text = "Done!",
                cv
            });
        }
        [HttpPost]
        public JsonResult SaveCv(Cv cv)
        {
            if(!ModelState.IsValid || cv==null)
            {
                ModelState.AddModelError("", "Wrong data");

                return Json(new
                {
                    success = false,
                    text = ModelState.Values.SelectMany(v => v.Errors),
                    model = cv,
                    modelstate = ModelState
                });
            }

            db.Cv.Add(cv);
            db.SaveChanges();
            return Json(new
            {
                success = true,
                Text = "Good!",
                cv = cv,
            });
        }
        [HttpGet]
        public JsonResult GetCv(int id)
        {
            bool success = true;
            Cv cv = null;
            try
            {
                cv = db.Cv.FirstOrDefault(x => x.Id == id);
            }
            catch (Exception e)
            {
                success = false;
            }
            return Json(new { success, cv});
        }
        public IActionResult CreateCv()
        {
            return View();
        }
    }
}
