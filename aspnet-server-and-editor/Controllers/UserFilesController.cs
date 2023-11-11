using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using SPEditor.Data;
using SPEditor.Entityes.Models;
using SPEditor.Entityes.ViewModels;

namespace SPEditor.Controllers;

public class UserFilesController : Controller
{
    private readonly SPEditorContext _context;

    public UserFilesController(SPEditorContext context)
    {
        _context = context;
    }

    public IActionResult SaveFile([FromBody] UserFileDto userFileData)
    {
        return Ok();
    }

    public IActionResult CreateNewFile([FromBody] CreateFileDto createFileData)
    {
        return Ok();
    }
}
