using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SingularControls.Web.Ui.Translations
{
    public class TranslationFactory : ITranslationFactory
    {
        /// <summary>
        /// Get translations
        /// </summary>
        /// <param name="requestedKeys"></param>
        /// <param name="languageCode"></param>
        /// <returns></returns>
        public IList<KeyValuePair<string, string>> GetTranslations(IList<string> requestedKeys, string languageCode)
        {
            return requestedKeys.Select(x => new KeyValuePair<string, string>(x, "--" + x + "--")).ToList();
        }
    }
}