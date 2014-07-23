using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SingularControls.Web.Ui.Translations
{
    public class TranslationCache : ITranslationFactory
    {
        #region singleton
        private TranslationCache() { }
        private static ITranslationFactory _current;
        public static ITranslationFactory Current { get { return _current ?? (_current = new TranslationCache()); } }
        #endregion

        /// <summary>
        /// Get translations
        /// </summary>
        /// <param name="requestedKeys"></param>
        /// <param name="languageCode"></param>
        /// <returns></returns>
        public IList<KeyValuePair<string, string>> GetTranslations(IList<string> requestedKeys, string languageCode)
        {
            // output
            var output = new List<KeyValuePair<string, string>>(requestedKeys.Count);

            // batched request
            var batched = new List<string>();

            // loop through request and get from cache or add to batch
            foreach (var requestedKey in requestedKeys)
            {
                if (_cache.ContainsKey(requestedKey))
                {
                    output.Add(new KeyValuePair<string, string>(requestedKey, _cache[requestedKey]));
                }
                else
                {
                    batched.Add(requestedKey);
                }
            }

            // get non-cached stuff
            if (_nonCachedTranslationFactoryFunc != null)
            {
                var dataFactory = _nonCachedTranslationFactoryFunc.Invoke();
                var translations = dataFactory.GetTranslations(batched, languageCode);
                output.AddRange(translations);
                foreach (var trans in translations)
                {
                    _cache.Add(trans);
                }
                
            }

            //
            return output;

        }

        /// <summary>
        /// Only for this
        /// </summary>
        /// <param name="func"></param>
        public void SetNonCachedTranslationFactoryFunc(Func<ITranslationFactory> func)
        {
            _nonCachedTranslationFactoryFunc = func;
        }
        private Func<ITranslationFactory> _nonCachedTranslationFactoryFunc;

        private readonly IDictionary<string, string> _cache = new Dictionary<string, string>();
    }
}