using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace SPEditor.Entityes.Models
{
    public class UserFile
    {
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }
        [Required]
        [StringLength(100)]
        [DisplayName("File name")]
        public string ServerFilePath { get; set; }
        [Required]
        public User Owner { get; set; }
        [Required]
        [DefaultValue(false)]
        public bool IsDeleted { get; set; }
    }
}
