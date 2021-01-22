using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication1.Models.DBModel
{

    public partial class Cv
    {
        public int Id { get; set; }
        [Required, MaxLength(50, ErrorMessage = "Name max length 50 symbols!")]

        public string Name { get; set; }
        [Required(ErrorMessage = "Birthday is required field")]

        public DateTime Birthday { get; set; }
        [Required(ErrorMessage = "Married status is required field")]

        public bool Married { get; set; }
        [Required, MaxLength(50, ErrorMessage = "Phone max length 15 symbols!")]

        public string Phone { get; set; }
        [Required(ErrorMessage = "Salary is required field")]

        public decimal Salary { get; set; }
    }
}
