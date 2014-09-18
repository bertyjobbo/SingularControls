using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ContactsPOCs.SpellCheck
{
    public interface ISpellCheckService
    {
        IList<SpellCheckResult> GetResults(string[] strings, string langCode);
        bool AddWord(string word, string langCode);
    }
}