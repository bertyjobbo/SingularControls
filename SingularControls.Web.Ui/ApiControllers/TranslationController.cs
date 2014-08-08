using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
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
        public IList<KeyValuePair<string, string>> GetTranslationResponses(string[] requests, string languageCode)
        {
            //Thread.Sleep(4000);
            return _translationFactory.GetTranslations(requests, languageCode);
        }
    }
}
