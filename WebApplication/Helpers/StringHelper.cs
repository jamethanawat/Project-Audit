using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;

namespace WebApplication.Helpers
{
    public static class StringHelper
    {

        public static string ReplaceSingleQuote(this string source)
        {
            if (source != null)
            {
                source = Regex.Replace(source, "'", "`");
                return source;
            }
            else
            {
                return null;
            }
        }
    }
}