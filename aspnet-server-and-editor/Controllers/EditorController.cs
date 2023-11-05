using Microsoft.AspNetCore.Mvc;

namespace SPEditor.Controllers;

public class EditorController : Controller
{
    ILogger logger;
    public EditorController(ILogger<EditorController> logger) 
    { 
        this.logger = logger;
    }

    public IActionResult SPEditor()
    {
        return View();
    }

    public IActionResult EditorBody()
    {
        return View();
    }
}