using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SPEditor.Data;
using SPEditor.Entityes.Models;
using SPEditor.Entityes.ViewModels;
using System.Security.Claims;

namespace SPEditor.Controllers;
public class UsersController : Controller
{
    ILogger<UsersController> logger;
    private readonly UserManager<User> userManager;
    private readonly SPEditorContext context;

    public UsersController(ILogger<UsersController> logger, UserManager<User> userManager, SPEditorContext context)
    {
        this.logger = logger;
        this.userManager = userManager;
        this.context = context;
    }

    [HttpGet]
    public IActionResult Register()
    {
        return View();
    }

    [HttpPost]
    public async Task<IActionResult> Register([FromForm] RegisterUserViewModel registerUser)
    {
        if (!ModelState.IsValid)
        {
            return View(registerUser);
        }

        // it will validate on client. But also need to be on server for be sure.
        if (registerUser.Password != registerUser.ConfirmPassword)
        {
            logger.LogError("Unable create user {string}", "Passwords not equals");
            ModelState.AddModelError("create_err", "Passwords not equals");
            return View(registerUser);
        }

        IEnumerable<IdentityError> errors = await CreateUser(registerUser);
        if (errors.Any())
        {
            string errorDescription = errors.ToList().First().Description;
            logger.LogError("Unable create user {string}", errorDescription);
            ModelState.AddModelError("create_err", errorDescription);
            return View(registerUser);
        }

        // todo: add mapping
        bool loginUserOk = await LoginUserAsync(new LoginUser()
        {
            Email = registerUser.Email,
            Password = registerUser.Password
        });

        if (!loginUserOk)
        {
            logger.LogError("Unable login user");
            return View(registerUser);
        }

        logger.LogInformation("{string} Registered at {date}", registerUser.Email, DateTime.Now);
        return RedirectToAction("Index", "Home");
    }

    [HttpGet]
    public IActionResult Login()
    {
        return View();
    }

    [HttpPost]
    public async Task<IActionResult> Login([FromForm] LoginUser loginUser)
    {
        if (!ModelState.IsValid)
        {
            return View(loginUser);
        }

        bool isOk = await LoginUserAsync(loginUser);
        if (!isOk)
            return View(loginUser);

        logger.LogInformation("{string} Logon at {date}", loginUser.Email, DateTime.Now);
        return RedirectToAction("Index", "Home");
    }

    [HttpGet]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return RedirectToAction("Index", "Home");
    }


    /// <summary>
    /// Login user. Makes validation of data about user
    /// </summary>
    /// <param name="login"></param>
    /// <returns>true - if user is correct. Else false</returns>
    private async Task<bool> LoginUserAsync(LoginUser login)
    {
        if(login == null)
        {
            ModelState.AddModelError(string.Empty, "Login user is null");
            return false;
        }

        User? user = await context.Users.FirstOrDefaultAsync(x => x.Email == login.Email);

        if(user == null)
        {
            ModelState.AddModelError(string.Empty, "User does not exists");
            return false;
        }

        if(!(await userManager.CheckPasswordAsync(user, login.Password)))        
        {
            ModelState.AddModelError(string.Empty, "Password is incorrect");
            return false;
        }

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, login.Email),
            new Claim(ClaimTypes.Role, "Simple"),
        };

        var claimsIdentity = new ClaimsIdentity(
            claims, CookieAuthenticationDefaults.AuthenticationScheme
        );

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

    /// <summary>
    /// Creates user in DB
    /// </summary>
    /// <param name="registerUser"></param>
    /// <returns>Enumerable of errors of identity model if happend</returns>
    private async Task<IEnumerable<IdentityError>> CreateUser(RegisterUserViewModel registerUser)
    {
        // todo: add mapping
        User user = new User();
        user.UserName = registerUser.UserName;
        user.Email = registerUser.Email;
        user.FirstName = string.Empty;
        user.LastName = string.Empty;
        IdentityResult res = await userManager.CreateAsync(user, registerUser.Password);

        return res.Errors;
    }
}
