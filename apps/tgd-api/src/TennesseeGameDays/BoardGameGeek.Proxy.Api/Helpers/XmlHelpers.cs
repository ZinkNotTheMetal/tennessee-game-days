using System.Text.RegularExpressions;

namespace BoardGameGeek.Proxy.Api.Helpers;

public static class XmlHelpers
{
    public static string RemoveInvalidXml(this string xmlStr)
    {
        string pattern = "&#((\\d+)|(x\\S+));";
        Regex regex = new Regex(pattern, RegexOptions.IgnoreCase);
        if (regex.IsMatch(xmlStr))
        {
            xmlStr = regex.Replace(xmlStr, new MatchEvaluator(m =>
                {
                    string s = m.Value;
                    string unicodeNumStr = s.Substring(2, s.Length - 3);

                    int unicodeNum = unicodeNumStr.StartsWith("x") ?
                        Convert.ToInt32(unicodeNumStr.Substring(1), 16)
                        : Convert.ToInt32(unicodeNumStr);

                    //according to https://www.w3.org/TR/xml/#charsets
                    if ((unicodeNum == 0x9 || unicodeNum == 0xA || unicodeNum == 0xD) ||
                        ((unicodeNum >= 0x20) && (unicodeNum <= 0xD7FF)) ||
                        ((unicodeNum >= 0xE000) && (unicodeNum <= 0xFFFD)) ||
                        ((unicodeNum >= 0x10000) && (unicodeNum <= 0x10FFFF)))
                    {
                        return s;
                    }
                    else
                    {
                        return String.Empty;
                    }
                })
            );
        }
        return xmlStr;
    }
}