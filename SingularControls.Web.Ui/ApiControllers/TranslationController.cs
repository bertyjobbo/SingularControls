using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using SingularControls.Web.Ui.Translation;

namespace SingularControls.Web.Ui.ApiControllers
{
    [RoutePrefix("api/translation")]
    public class TranslationController : ApiController
    {
        [Route("translations")]
        [AcceptVerbs("POST")]
        public IList<TranslationResponse> GetTranslationResponses(Dictionary<string, TranslationRequest> requests)
        {
            var output = new List<TranslationResponse>();
            foreach (var translationRequest in requests)
            {
                var keyArr = translationRequest.Key.Split(':');
                var value = "**" + keyArr[0] + ": " + keyArr[1] + "**";
                output.Add(new TranslationResponse
                {
                    ListAndKey = translationRequest.Key,
                    TranslatedValue = value
                });
            }
            return output;
        }
    }
}
