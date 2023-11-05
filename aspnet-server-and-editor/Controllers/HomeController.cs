using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using SPEditor.Data;
using SPEditor.Entityes.Models;
using SPEditor.Models;
using System.Diagnostics;

namespace SPEditor.Controllers;
public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private readonly SPEditorContext dbContext;

    public HomeController(ILogger<HomeController> logger, SPEditorContext dbContext)
    {
        _logger = logger;
        this.dbContext = dbContext;
    }

    public async Task<IActionResult> Index()
    {
        return View();
    }


    public IActionResult Privacy()
    {
        return View();
    }

    [OutputCache(NoStore = true, Duration = 0)]
    public IActionResult SPEditor()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}