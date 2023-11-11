using System.Security.Claims;

namespace SPEditor.Extentions
{
    public static class ClaimPrincipalExtentions
    {
        /// <summary>
        /// Indicates if user IsAuthenticated
        /// </summary>
        /// <param name="claimsPrincipal"></param>
        /// <returns></returns>
        public static bool IsAuthenticated(this ClaimsPrincipal claimsPrincipal)
        {
            if (claimsPrincipal.Identity == null)
            {
                return false;
            }

            if (claimsPrincipal.Identity.IsAuthenticated == false)
            {
                return false;
            }

            return true;
        }
    }
}
