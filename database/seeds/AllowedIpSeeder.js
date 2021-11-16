"use strict";

/*
|--------------------------------------------------------------------------
| AllowedIpSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");
const Database = use("Database");

class AllowedIpSeeder {
  async run() {
    await Database.table("allowed_ip").insert([
      {
        ip_address: "127.0.0.1",
      },
      {
        ip_address: "180.248.84.27",
      },
    ]);

    console.log("Allowed Ip Generated");
  }
}

module.exports = AllowedIpSeeder;
