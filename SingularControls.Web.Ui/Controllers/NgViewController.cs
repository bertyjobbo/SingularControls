using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;

namespace SingularControls.Web.Ui.Controllers
{
    public class NgViewController : Controller
    {
        // GET: NgView
        public ContentResult GetView(string controllerName, string actionName)
        {
            //Thread.Sleep(2000);
            var filePath = Server.MapPath("/Ng/Views/" + controllerName + "/" + actionName + ".html");
            var text = System.IO.File.ReadAllText(filePath);
            return Content(text, "text/html");
        }
    }
}