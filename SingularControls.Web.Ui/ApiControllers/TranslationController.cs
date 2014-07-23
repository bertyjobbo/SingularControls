using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using SingularControls.Web.Ui.Translations;


namespace SingularControls.Web.Ui.ApiControllers
{
    [RoutePrefix("api/translation")]
    public class TranslationController : ApiController
    {
        public TranslationController()
        {
            _translationFactory = TranslationCache.Current;
            ((TranslationCache)_translationFactory).SetNonCachedTranslationFactoryFunc(() => new TranslationFactory());
        }

        private readonly ITranslationFactory _translationFactory;

        [Route("translations/{languageCode}")]
        [AcceptVerbs("POST")]
        public IList<KeyValuePair<string, string>> GetTranslationResponses(Dictionary<string, object> requests, string languageCode)
        {
            //var output = new List<KeyValuePair<string,string>>();
            //foreach (var translationRequest in requests)
            //{
            //    var keyArr = translationRequest.Key.Split(':');
            //    var value = "**" + keyArr[0] + ": " + keyArr[1] + "**";
            //    output.Add(new KeyValuePair<string, string>(translationRequest.Key,value));
            //}
            //return output;

            return _translationFactory.GetTranslations(requests.Select(x => x.Key).ToList(), languageCode);
        }
    }
}
