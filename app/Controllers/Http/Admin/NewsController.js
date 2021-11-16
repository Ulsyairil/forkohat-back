"use strict";

const Helpers = use("Helpers");
const fs = use("fs");
const path = use("path");
const removeFile = Helpers.promisify(fs.unlink);
const News = use("App/Models/News");
const RandomString = require("randomstring");
const Moment = require("moment");
const voca = require("voca");
const { validate } = use("Validator");

class NewsController {
  async index({ request, response }) {
    try {
      const rules = {
        page: "required|integer",
        limit: "required|integer",
        order: "required|in:asc,desc",
        search: "string",
        trash: "required|boolean",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const page = request.input("page");
      const limit = request.input("limit");
      const order = request.input("order");
      const search = request.input("search");
      const trash = request.input("trash");

      // Get data
      let query = News.query().with("Author");

      if (search) {
        query
          .where("title", "like", `%${search}%`)
          .orWhere("content", "like", `%${search}%`);
      }

      if (trash == "0" || trash == false) {
        query.whereNull("deleted_at");
      }

      if (trash == "1" || trash == true) {
        query.whereNotNull("deleted_at");
      }

      let data = await query.orderBy("id", order).paginate(page, limit);

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async get({ request, response }) {
    try {
      const rules = {
        news_id: "required|integer",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const news_id = request.input("news_id");

      let data = await News.query().with("Author").where("id", news_id).first();

      if (!data) {
        return response.status(404).send({
          message: "Berita Tidak Ditemukan",
        });
      }

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async create({ auth, request, response }) {
    try {
      const rules = {
        title: "required|string",
        content: "required|string ",
      };

      const messages = {
        "title.required": "Judul Berita Harus Diisi",
        "content.required": "Konten Berita Harus Diisi",
      };

      const validation = await validate(request.all(), rules, messages);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const user = await auth.getUser();
      const title = request.input("title");
      const content = request.input("content");
      const inputImage = request.file("image", {
        extnames: ["png", "jpg", "jpeg"],
      });

      if (!inputImage) {
        return response.status(422).send({
          message: "Gambar Berita Harus Diunggah",
        });
      }

      let random = RandomString.generate({
        capitalization: "lowercase",
      });

      let fileName = `${voca.snakeCase(
        inputImage.clientName.split(".").slice(0, -1).join(".")
      )}_${random}.${inputImage.extname}`;

      await inputImage.move(Helpers.resourcesPath("uploads/news"), {
        name: fileName,
      });

      if (!inputImage.moved()) {
        return response.status(422).send(inputImage.error());
      }

      // Create data
      let news = await News.create({
        author_id: user.id,
        title: title,
        content: content,
        image_name: fileName,
        image_mime: inputImage.extname,
        image_path: Helpers.resourcesPath("uploads/news"),
        image_url: `/api/v1/file/${inputImage.extname}/${fileName}`,
      });

      // Get data created
      let data = await News.query().with("Author").where("id", news.id).first();

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async edit({ request, response }) {
    try {
      const rules = {
        news_id: "required|integer",
        title: "required|string",
        content: "required|string ",
      };

      const messages = {
        "news_id.required": "ID Berita Harus Diisi",
        "news_id.integer": "ID Berita Harus Berupa Angka",
        "title.required": "Judul Berita Harus Diisi",
        "content.required": "Konten Berita Harus Diisi",
      };

      const validation = await validate(request.all(), rules, messages);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const news_id = request.input("news_id");
      const title = request.input("title");
      const content = request.input("content");
      const inputImage = request.file("image", {
        extnames: ["png", "jpg", "jpeg"],
      });

      let findNews = await News.find(news_id);

      if (!findNews) {
        return response.status(404).send({
          message: "Berita Tidak Ditemukan",
        });
      }

      let random = RandomString.generate({
        capitalization: "lowercase",
      });

      let fileName;
      if (inputImage) {
        removeFile(
          path.join(Helpers.resourcesPath("uploads/news"), findNews.image_name)
        );

        fileName = `${voca.snakeCase(
          inputImage.clientName.split(".").slice(0, -1).join(".")
        )}_${random}.${inputImage.extname}`;

        await inputImage.move(Helpers.resourcesPath("uploads/news"), {
          name: fileName,
        });

        if (!inputImage.moved()) {
          return response.status(422).send(inputImage.error());
        }
      }

      let query = News.query().where("id", news_id);

      // Update news table
      if (inputImage) {
        await query.update({
          title: title,
          content: content,
          image_name: fileName,
          image_mime: inputImage.extname,
          image_path: Helpers.resourcesPath("uploads/news"),
          image_url: `/api/v1/file/${inputImage.extname}/${fileName}`,
        });
      } else {
        await query.update({
          title: title,
          content: content,
        });
      }

      // Get data created
      let data = await News.query().with("Author").where("id", news_id).first();

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async dump({ request, response }) {
    try {
      const rules = {
        news_id: "required|integer",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const news_id = request.input("news_id");

      let findNews = await News.find(news_id);

      if (!findNews) {
        return response.status(404).send({
          message: "Berita Tidak Ditemukan",
        });
      }

      await News.query().where("id", news_id).update({
        deleted_at: Moment.now(),
      });

      // Get data created
      let data = await News.query().with("Author").where("id", news_id).first();

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async restore({ request, response }) {
    try {
      const rules = {
        news_id: "required|integer",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const news_id = request.input("news_id");

      let findNews = await News.find(news_id);

      if (!findNews) {
        return response.status(404).send({
          message: "Berita Tidak Ditemukan",
        });
      }

      await News.query().where("id", news_id).update({
        deleted_at: null,
      });

      // Get data created
      let data = await News.query().with("Author").where("id", news_id).first();

      return response.send(data);
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }

  async destroy({ request, response }) {
    try {
      const rules = {
        news_id: "required|integer",
      };

      const validation = await validate(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send(validation.messages()[0]);
      }

      const news_id = request.input("news_id");

      const findNews = await News.find(news_id);

      if (!findNews) {
        return response.status(404).send({
          message: "Berita Tidak Ditemukan",
        });
      }

      removeFile(path.join(findNews.path, findNews.image_name));

      await News.query().where("id", news_id).delete();

      return response.send({
        message: "Berita Berhasil Dihapus",
      });
    } catch (error) {
      console.log(error.message);
      return response.status(500).send(error.message);
    }
  }
}

module.exports = NewsController;
