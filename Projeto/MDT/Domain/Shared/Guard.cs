
using System.Text.RegularExpressions;
using MDT.Domain.Shared;
using Microsoft.IdentityModel.Tokens;

namespace MDT.Domain.Shared
{

    public class Guard
    {
        public static bool ValidString(string value, int maxLimit) {
            return value.Length <= maxLimit;
        }

        public static bool ValidIntegerValue(int value, int minLimit, int maxLimit) {
            return value >= minLimit && value <= maxLimit;
        }

        public static bool ValidString(string value, int minChars, int maxChars) {
            return value.Length >= minChars && value.Length <= maxChars;
        }

        public static bool ValidPhoneNumber(string phoneNumber) {
            return new Regex(@"^[1-9]\d{2} ?\d{3} ?\d{3}$").IsMatch(phoneNumber);
        }

        public static void BulkValidateArguments((string, string)[] values) {
            for (int i = 0; i < values.Length; i++) {
                if (string.IsNullOrEmpty(values[i].Item1)) {
                    throw new Exception($"The {values[i].Item2} field is required!");
                }
            }
        }
    }
}
