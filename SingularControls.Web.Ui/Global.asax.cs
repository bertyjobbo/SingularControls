using System;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;

namespace SingularControls.Web.Ui
{
    public class Global : System.Web.HttpApplication
    {

        protected void Application_Start(object sender, EventArgs e)
        {
            //RouteTable.Routes.MapRoute(
            //        "Default",
            //        "{controller}/{action}/{id}",
            //        new { controller = "Home", action = "Index", id = RouteParameter.Optional }
            //);

            RouteTable.Routes.MapRoute(
                "NgView",
                "NgView/GetView/{controllerName}/{actionName}",
                new { controller="NgView", action="GetView" }
            );

            GlobalConfiguration.Configure(WebApiConfig.Register);
        }

        protected void Session_Start(object sender, EventArgs e)
        {

        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {

        }

        protected void Application_AuthenticateRequest(object sender, EventArgs e)
        {

        }

        protected void Application_Error(object sender, EventArgs e)
        {

        }

        protected void Session_End(object sender, EventArgs e)
        {

        }

        protected void Application_End(object sender, EventArgs e)
        {

        }
    }
}