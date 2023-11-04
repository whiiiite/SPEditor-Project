using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SPEditor.Data;
using SPEditor.Entityes.Models;
using SPEditor.Entityes.ViewModels;
using System.Security.Claims;

namespace SPEditor.Controllers
{
    public class UsersController : Controller
    {
        ILogger<UsersController> logger;
        private readonly UserManager<User> userManager;

        public UsersController(ILogger<UsersController> logger, UserManager<User> userManager)
        {
            this.logger = logger;
            this.userManager = userManager;
        }

        [HttpGet]
        public IActionResult Register()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Register([FromForm] RegisterUserViewModel registerUser)
        {
            // it will validate on client. But also need to be on server for be sure.
            if(ModelState.IsValid)
            {
                if (registerUser.Password != registerUser.ConfirmPassword)
                {
                    logger.LogError("Unable create user {string}", "Passwords not equals");
                    ModelState.AddModelError("create_err", "Passwords not equals");
                    return View(registerUser);
                }

                IEnumerable<IdentityError> errors = await CreateUser(registerUser);
                if (errors.Any())
                {
                    string errorDescription = errors.ToList()[0].Description;
                    logger.LogError("Unable create user {string}", errorDescription);
                    ModelState.AddModelError("create_err", errorDescription);
                    return View(registerUser);
                }

                // todo: add mapping
                bool isOk = await LoginUser(new LoginUser()
                {
                    Email = registerUser.Email,
                    Password = registerUser.Password
                });

                if (!isOk)
                {
                    logger.LogError("Unable login user");
                    ModelState.AddModelError("login_err", "Unable login user");
                    return View(registerUser);
                }
                return RedirectToAction("Index", "Home");
            }
            else
            {
                return View(registerUser);
            }
        }

        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromForm] LoginUser loginUser)
        {
            bool isOk = await LoginUser(loginUser);

            if (!isOk) return View();

            return RedirectToAction("Index", "Home");
        }

        [HttpGet]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("Index", "Home");
        }


        private async Task<bool> LoginUser(LoginUser login)
        {
            if(login == null)
            {
                ModelState.AddModelError(string.Empty, "Login user is null");
                return false;
            }

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, login.Email),
                new Claim(ClaimTypes.Role, "Simple"),
            };

            var claimsIdentity = new ClaimsIdentity(
                claims, CookieAuthenticationDefaults.AuthenticationScheme);

            var authProperties = new AuthenticationProperties
            {
                IsPersistent = true
            };

            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimsIdentity),
                authProperties);

            return true;
        }

        private async Task<IEnumerable<IdentityError>> CreateUser(RegisterUserViewModel registerUser)
        {
            // todo: add mapping
            User user = new User();
            user.UserName = registerUser.UserName;
            user.Email = registerUser.Email;
            user.FirstName = "";
            user.LastName = "";
            IdentityResult res = await userManager.CreateAsync(user, registerUser.Password);

            return res.Errors;
        }
    }
}
