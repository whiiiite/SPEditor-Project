using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using SPEditor.Entityes.Models;
using Microsoft.AspNetCore.Authorization;
using SPEditor.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.Cookies;
using SPEditor.Extentions;

namespace SPEditor.Controllers;

public class EditorController : Controller
{
    ILogger logger;
    SPEditorContext dbcontext;
    public EditorController(ILogger<EditorController> logger, 
        SPEditorContext dbcontext) 
    { 
        this.logger = logger;
        this.dbcontext = dbcontext;
    }

    public async Task<IActionResult> SPEditor()
    {
        if (!User.IsAuthenticated())
        {
            return BadRequest();
        }

        ViewData["Title"] = "SPEditor";

        string? userId = dbcontext.GetUserId(User.Identity);

        if (userId != null)
        {
            ViewBag.Id = userId;
        }

        return View();
    }

    public IActionResult EditorBody()
    {
        if (!User.IsAuthenticated())
        {
            return BadRequest();
        }

        return View();
    }
}