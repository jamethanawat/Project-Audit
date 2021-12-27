using MySql.Data.Entity;

using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Web;

namespace WebApplication.Models.Database
{
    [DbConfigurationType(typeof(MySqlEFConfiguration))]

    public class DB : DbContext
    {
        public DB() : base("DB")
        {

        }
        //protected override void OnModelCreating(DbModelBuilder modelBuilder)
        //{
        //    // Map to the correct Chinook Database tables

        //    //modelBuilder.Entity<Tnsleave>().ToTable("tnsleave", "public");

        //    // Chinook Database for PostgreSQL doesn't auto-increment Ids
        //    // modelBuilder.Conventions
        //    //     .Remove<StoreGeneratedIdentityKeyConvention>();
        //}

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
        
        }
    }
}