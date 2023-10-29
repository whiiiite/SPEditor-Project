using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SPEditor.Configurations;
using SPEditor.Entityes.Models;

namespace SPEditor.Data
{
    public class SPEditorContext : IdentityDbContext<User>
    {
        public SPEditorContext (DbContextOptions<SPEditorContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.ApplyConfiguration(new RoleConfiguration());
        }

        public DbSet<SPEditor.Entityes.Models.UserFile> UserFile { get; set; } = default!;
    }
}
