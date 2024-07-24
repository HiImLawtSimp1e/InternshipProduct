using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Models.Validation
{
    public class ZeroOrRangeAttribute : ValidationAttribute
    {
        private readonly int _minValue;
        private readonly int _maxValue;

        public ZeroOrRangeAttribute(int minValue, int maxValue)
        {
            _minValue = minValue;
            _maxValue = maxValue;
        }

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            if (value == null)
            {
                return ValidationResult.Success;
            }

            int? intValue = value as int?;

            if (intValue == 0 || (intValue >= _minValue && intValue <= _maxValue))
            {
                return ValidationResult.Success;
            }

            return new ValidationResult(ErrorMessage ?? $"The field {validationContext.DisplayName} must be 0 or between {_minValue} and {_maxValue}.");
        }
    }
}
