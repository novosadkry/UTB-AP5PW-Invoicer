using System.Text.RegularExpressions;

namespace UTB_AP5PW_Invoicer.Server.Utilities
{
    public partial class SlugifyParameterTransformer : IOutboundParameterTransformer
    {
        [GeneratedRegex("([a-z])([A-Z])")]
        private static partial Regex PathTransformer();

        public string? TransformOutbound(object? value)
        {
            var path = value?.ToString();
            return path != null
                ? PathTransformer().Replace(path, "$1-$2").ToLower()
                : null;
        }
    }
}
