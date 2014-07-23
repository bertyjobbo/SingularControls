using System.Collections.Generic;

namespace SingularControls.Web.Ui.Translations
{
    /// <summary>
    /// Translation factory
    /// </summary>
    public interface ITranslationFactory
    {
        /// <summary>
        /// Get translations
        /// </summary>
        /// <param name="requestedKeys"></param>
        /// <param name="languageCode"></param>
        /// <returns></returns>
        IList<KeyValuePair<string,string>> GetTranslations(IList<string> requestedKeys, string languageCode);
    }
}