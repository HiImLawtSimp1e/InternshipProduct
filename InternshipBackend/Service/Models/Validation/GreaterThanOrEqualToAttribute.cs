using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Models.Validation
{
    public class GreaterThanOrEqualToAttribute : ValidationAttribute
    {
        private readonly string _comparisonProperty;

        public GreaterThanOrEqualToAttribute(string comparisonProperty)
        {
            _comparisonProperty = comparisonProperty;
        }

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var currentValue = value as int?;

            if (currentValue == null || currentValue == 0)
            {
                return ValidationResult.Success;
            }

            var property = validationContext.ObjectType.GetProperty(_comparisonProperty);
            if (property == null)
            {
                return new ValidationResult($"Unknown property: {_comparisonProperty}");
            }

            var comparisonValue = (int?)property.GetValue(validationContext.ObjectInstance);

            if (comparisonValue.HasValue && currentValue < comparisonValue)
            {
                return new ValidationResult($"{validationContext.DisplayName} must be greater than or equal to {_comparisonProperty}.");
            }

            return ValidationResult.Success;
        }
    }
}
