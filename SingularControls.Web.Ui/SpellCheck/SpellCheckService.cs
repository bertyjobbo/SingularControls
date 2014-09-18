using System;
using System.Activities.Statements;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using FuzzyString;

namespace ContactsPOCs.SpellCheck
{
    public class SpellCheckService : ISpellCheckService
    {
        // fields
        private static object _SyncLock = new object();
        private static readonly IDictionary<string, IList<KeyValuePair<string, int>>> _dictionaries = new Dictionary<string, IList<KeyValuePair<string, int>>>();
        private static readonly List<FuzzyStringComparisonOptions> _options = new List<FuzzyStringComparisonOptions>
            {
                FuzzyStringComparisonOptions.UseOverlapCoefficient,
                FuzzyStringComparisonOptions.UseLongestCommonSubsequence,
                FuzzyStringComparisonOptions.UseLongestCommonSubstring
            };

        private const int word_importance_min_score = 200;
        private const int result_max = 3;
        private const FuzzyStringComparisonTolerance tolerance = FuzzyStringComparisonTolerance.Strong;

        /// <summary>
        /// Get results
        /// </summary>
        /// <param name="strings"></param>
        /// <param name="langCode"></param>
        /// <returns></returns>
        public IList<SpellCheckResult> GetResults(string[] strings, string langCode)
        {
            lock (_SyncLock)
            {
                try
                {
                    var dic = checkAndGetDictionary(langCode);

                    return strings.Where(x => x.Length > 2)
                        .Select(x =>
                        {
                            if (!dic.Select(y => y.Key).Contains(x.ToLower()))
                            {
                                return new SpellCheckResult
                                {
                                    Checking = true,
                                    Current = false,
                                    IsNew = true,
                                    Original = x,
                                    Word = x,
                                    Suggestions = getSuggestions(x, dic)
                                };
                            }

                            return null;

                        })
                        .Where(x => x != null)
                        .ToList();
                }
                catch
                {
                    return new List<SpellCheckResult>();
                }
            }
        }

        private IList<KeyValuePair<string, int>> checkAndGetDictionary(string langCode)
        {
            langCode = langCode.ToLower();

            if (!_dictionaries.ContainsKey(langCode))
            {
                var path = HttpContext.Current.Server.MapPath("~/Spellcheck/Dictionaries/" + langCode + ".txt");
                var customPath = HttpContext.Current.Server.MapPath("~/Spellcheck/Dictionaries/" + langCode + "-custom.txt");
                var data = File.ReadAllLines(path).Select(x =>
                {
                    var splt = x.Split(' ');
                    return new KeyValuePair<string, int>(splt[0], Convert.ToInt32(splt[1]));
                })
                .Where(x => x.Value > word_importance_min_score && x.Key.Length > 2)
                .OrderByDescending(x => x.Value)
                .Concat(File.ReadAllLines(customPath).Select(x => new KeyValuePair<string, int>(x,9999999)))
                .ToArray();
                _dictionaries.Add(langCode, data);
            }

            var dic = _dictionaries[langCode];
            return dic;
        }

        /// <summary>
        /// Add word
        /// </summary>
        /// <param name="word"></param>
        /// <param name="langCode"></param>
        /// <returns></returns>
        public bool AddWord(string word, string langCode)
        {
            try
            {
                lock (_SyncLock)
                {
                    var dic = checkAndGetDictionary(langCode);
                    if (dic.Select(x => x.Key).Contains(word.ToLower())) return true;
                    var customFile =
                        File.ReadAllLines(
                            getCustomPath(langCode)).ToList();
                    customFile.Add(word.ToLower());
                    File.WriteAllLines(getCustomPath(langCode), customFile.Where(x=>!string.IsNullOrEmpty(x)));
                    _dictionaries.Remove(langCode.ToLower());
                    logAddedWord(word, langCode);
                    return true;
                }
            }
            catch
            {
                return false;
            }


        }

        private void logAddedWord(string word, string langCode)
        {
            //TODO Log added word - email?
        }

        private string getCustomPath(string langCode)
        {
            return HttpContext.Current.Server.MapPath("~/Spellcheck/Dictionaries/" + langCode + "-custom.txt");
        }

        /// <summary>
        /// Get suggestions
        /// </summary>
        /// <param name="str"></param>
        /// <param name="dic"></param>
        /// <returns></returns>
        private string[] getSuggestions(string str, IEnumerable<KeyValuePair<string, int>> dic)
        {
            var matched = dic.Where(x => str.ToLower().ApproximatelyEquals(x.Key, _options, tolerance)).ToList();

            var preScore = matched
                .OrderByDescending(x => x.Value)
                .Take(result_max)
                .ToList();

            var scored =
                preScore
                    .Select(x => new { Score = str.LevenshteinDistance(x.Key), Text = x.Key })
                    .OrderBy(x => x.Score)
                    .ToList();

            var output =
                scored
                .Select(x => x.Text)
                .ToArray();

            return output;
        }
    }
}