using Microsoft.EntityFrameworkCore;
using SPEditor.Data;
using SPEditor.Entityes.Models;
using System.Security.Principal;

namespace SPEditor.Extentions
{
    public static class SPEditorContextExtentions
    {
        /// <summary>
        /// Get user id by current logged in identity
        /// </summary>
        /// <param name="context"></param>
        /// <param name="currentIdentity"></param>
        /// <returns></returns>
        public static string? GetUserId(this SPEditorContext context, IIdentity? currentIdentity)
        {
            User? user = context.Users
            .Where(x => x.Email == currentIdentity.Name)
            .FirstOrDefault();

            return user?.Id;
        }
    }
}
