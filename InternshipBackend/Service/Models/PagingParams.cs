using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Models
{
    public class PagingParams<T>
    {
        public T? Result { get; set; }
        public int Pages { get; set; }
        public int CurrentPage { get; set; }

    }
}
