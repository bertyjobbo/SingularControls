using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ContactsPOCs.SpellCheck
{
    public class SpellCheckResult
    {
        public string Original { get; set; }
        public string Word { get; set; }
        public string[] Suggestions { get; set; }
        public bool Checking { get; set; }
        public bool IsNew { get; set; }
        public bool Current { get; set; }
    }
}