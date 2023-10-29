using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using SPEditor.Data;
using SPEditor.Entityes.Models;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace SPEditor
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddDbContext<SPEditorContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("SPEditorContext") ?? throw new InvalidOperationException("Connection string 'SPEditorContext' not found.")));

            builder.Services.AddDefaultIdentity<User>(options => {
            options.SignIn.RequireConfirmedAccount = true;
                options.Password = new PasswordOptions()
                {
                    RequireDigit = false,
                    RequiredLength = 6,
                    RequireLowercase = true,
                    RequireUppercase = false,
                    RequireNonAlphanumeric = false
                };
            })
                .AddRoles<IdentityRole>()
                .AddEntityFrameworkStores<SPEditorContext>();

            builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
            .AddCookie(options =>
            {
                options.ExpireTimeSpan = TimeSpan.FromDays(7);
                options.SlidingExpiration = true;
                options.AccessDeniedPath = "/Forbidden/";
            });

            // Add services to the container.
            builder.Services.AddControllersWithViews();
            builder.Logging.AddFile(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logs", "logf.log"));
            builder.Logging.AddSimpleConsole();

            var app = builder.Build();

            

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.Use(async (curr, next) =>
            {
                curr.Response.Headers["Cache-Control"] = "no-cache";
                await next();
            });

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");

            app.Run();
        }
    }
}