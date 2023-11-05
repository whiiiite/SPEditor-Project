using Microsoft.AspNetCore.Identity;

namespace SPEditor.Entityes.Models;

public class User : IdentityUser
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
}
