using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace WebApplication1.Models.DBModel
{
    public partial class ConnectContext:DbContext
    {
        public ConnectContext() { }
        public  ConnectContext(DbContextOptions<ConnectContext> options)
            : base(options)
        {
        }
        public virtual DbSet<Cv> Cv { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer("server=DESKTOP-KGO4OUT\\SQLEXPRESS;Initial Catalog=TestTask;Integrated Security=True;");
            }
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
