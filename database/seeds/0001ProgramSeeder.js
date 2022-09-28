"use strict";

/*
|--------------------------------------------------------------------------
| ProgramSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");
const Database = use("Database");
const Moment = require("moment");

class ProgramSeeder {
  async run() {
    const dateNow = Moment().format("YYYY-MM-DD HH:mm:ss");

    await Database.table("programs").insert([
      {
        title: "Umum",
        description: "Program Umum Forkohat",
        created_at: dateNow,
        updated_at: dateNow,
      },
      {
        title: "Balikpapan Timur",
        description:
          "Balikpapan Timur adalah sebuah kecamatan di Kota Balikpapan, Kalimantan Timur, Indonesia. Luas dari kecamatan ini adalah 92,42 km² di perairan, dan di daratan seluas 137,158 km².",
        created_at: dateNow,
        updated_at: dateNow,
      },
      {
        title: "Balikpapan Barat",
        description:
          "Balikpapan Barat adalah sebuah kecamatan di Kota Balikpapan, Kalimantan Timur, Indonesia. Mayoritas penduduk di kecamatan ini adalah pendatang dari berbagai daerah seperti Pulau Madura, Jawa, Sulawesi, Kalsel, dan lain sebagainya. Luas dari kecamatan ini adalah 37,49 km² di perairan, dan di daratan seluas 179,952 km² atau sekitar 35,75% Luas Kota Balikpapan.",
        created_at: dateNow,
        updated_at: dateNow,
      },
      {
        title: "Balikpapan Utara",
        description:
          "Balikpapan Utara adalah sebuah kecamatan di Kota Balikpapan, Provinsi Kalimantan Timur, Indonesia. Luas dari kecamatan ini adalah 13.216,62 Ha atau 132,17 km².",
        created_at: dateNow,
        updated_at: dateNow,
      },
      {
        title: "Balikpapan Tengah",
        description:
          "Balikpapan Tengah adalah sebuah kecamatan di Kota Balikpapan, Kalimantan Timur, Indonesia. Luas dari kecamatan ini adalah 9,97 km² di perairan, dan di daratan seluas 11,07 km².",
        created_at: dateNow,
        updated_at: dateNow,
      },
      {
        title: "Balikpapan Selatan",
        description:
          "Balikpapan Selatan adalah sebuah kecamatan di Kota Balikpapan, Kalimantan Timur, Indonesia.",
        created_at: dateNow,
        updated_at: dateNow,
      },
      {
        title: "Balikpapan Kota",
        description:
          "Balikpapan Kota adalah sebuah kecamatan di Kota Balikpapan, Kalimantan Timur, Indonesia, dan merupakan pemekaran kecamatan Balikpapan Selatan.",
        created_at: dateNow,
        updated_at: dateNow,
      },
    ]);

    console.log("Programs Generated");
  }
}

module.exports = ProgramSeeder;
